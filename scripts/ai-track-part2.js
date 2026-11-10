module.exports = [
  {
    number: 11,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Autoregressive Generation & The KV Cache: Memory Footprint & Scaling Formulas",
    content: `### 1. Two Phases of LLM Inference: Prefill vs. Decode

Transformer-based autoregressive models generate text in two radically distinct operational phases:

\`\`\`
  Phase 1: Prefill (Prompt Processing)             Phase 2: Decode (Token-by-Token)
  Compute-Bound (High Parallelism)                  Memory-Bandwidth Bound (Sequential)
  ┌─────────────────────────────────────┐           ┌─────────────────────────────────────┐
  │ Processes all prompt tokens (e.g.   │           │ Generates 1 token at a time:        │
  │ 2,048 tokens) concurrently via GEMM │ ──► K, V  │ Attends to all past tokens via      │
  │ matrix multiplication. Saturates GPU│   Cache   │ cached Keys and Values. GPU memory  │
  │ Tensor Cores.                       │           │ bandwidth is the primary bottleneck.│
  └─────────────────────────────────────┘           └─────────────────────────────────────┘
\`\`\`

---

### 2. Why the KV Cache is Essential

In standard self-attention, generating token $t$ requires computing attention against all tokens $1 \\dots t-1$. Without caching, previous key ($K$) and query/value ($V$) states must be recomputed at every step, creating an $O(N^2)$ generation cost.
- **The KV Cache** stores computed Key and Value vectors for all past tokens in GPU VRAM.
- Each new decoding step only computes Key and Value for the *single newly generated token* ($O(1)$ per step).

---

### 3. KV Cache Memory Sizing Formula

The memory footprint of the KV cache grows linearly with batch size and context sequence length:

$$\\text{Memory (bytes)} = 2 \\times 2 \\times n_{\\text{layers}} \\times n_{\\text{heads}} \\times d_{\\text{head}} \\times \\text{seq\\_len} \\times \\text{batch\\_size} \\times \\text{bytes\\_per\\_elem}$$

Where:
- $2 \\times$ accounts for both Keys and Values.
- $\\text{bytes\\_per\\_elem} = 2$ for FP16/BF16, or $1$ for FP8.

**Concrete Example (Llama 3 70B, BF16, Context = 8,192, Batch Size = 8)**:
- Layers = 80, KV Heads = 8 (Grouped-Query Attention), Head Dim = 128
- $\\text{Bytes} = 2 \\times 80 \\times 8 \\times 128 \\times 8,192 \\times 8 \\times 2 = 21,474,836,480\\text{ bytes} \\approx \\mathbf{21.47\\text{ GB}}$
> The KV cache for just 8 concurrent users consumes over 21 GB of GPU VRAM!

\`\`\`python
def calculate_kv_cache_vram_gb(
    num_layers: int, 
    num_kv_heads: int, 
    head_dim: int, 
    seq_len: int, 
    batch_size: int, 
    dtype_bytes: int = 2
) -> float:
    # 2 for Key and Value
    total_bytes = 2 * num_layers * num_kv_heads * head_dim * seq_len * batch_size * dtype_bytes
    return total_bytes / (1024 ** 3)

# Example: Llama 3 8B (32 layers, 8 KV heads, 128 head dim, 8k tokens, batch 16)
vram_gb = calculate_kv_cache_vram_gb(32, 8, 128, 8192, 16, dtype_bytes=2)
print(f"Required KV Cache VRAM: {vram_gb:.2f} GB")  # ~17.18 GB
\`\`\``
  },
  {
    number: 12,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "PagedAttention & vLLM Architecture: Eliminating KV Cache Memory Fragmentation",
    content: `### 1. The Classical KV Cache Allocation Problem

In traditional serving frameworks (Hugging Face naive transformers, early TGI), memory for a request's KV cache had to be allocated contiguously based on the **maximum potential sequence length** (e.g., reserving 4,096 tokens even if the model outputs 20 tokens):

\`\`\`
Traditional Contiguous Allocation:
┌──────────────────────────────────────────────┬───────────────────────────────┐
│ Actual Tokens Used (200 tokens)              │ Reserved / Wasted (3,896 toks)│
└──────────────────────────────────────────────┴───────────────────────────────┘
                                                ▲ 60% - 80% VRAM Wasted!
\`\`\`

This creates catastrophic **internal fragmentation** (reserved memory never used) and **external fragmentation** (memory chunks too fragmented to host a new request).

---

### 2. PagedAttention Virtual Memory Solution

Inspired by virtual memory paging in operating systems (OS), **PagedAttention** (developed by Kwon et al. at UC Berkeley) breaks the KV cache into fixed-size **blocks** (e.g., 16 or 32 tokens per block):

\`\`\`
   Logical KV Cache (Sequential):
   [ Block 0 (Tokens 0-15) ] ──► [ Block 1 (Tokens 16-31) ] ──► [ Block 2 (Tokens 32-47) ]
                 │                               │                               │
                 ▼                               ▼                               ▼
   Physical Blocks in GPU Memory (Non-contiguous):
   ┌───────────────┬───────────────┬───────────────┬───────────────┐
   │ Physical #42  │ Free Block    │ Physical #11  │ Physical #89  │
   │ (Block 0)     │               │ (Block 2)     │ (Block 1)     │
   └───────────────┴───────────────┴───────────────┴───────────────┘
\`\`\`

---

### 3. Key Architectural Benefits of PagedAttention

| Metric | Traditional Contiguous Serving | vLLM with PagedAttention |
| :--- | :--- | :--- |
| **VRAM Waste** | 60% – 80% wasted memory | < 4% wasted (only in the final partial block) |
| **Serving Throughput** | 1x baseline | **2x to 4x higher throughput** on identical GPUs |
| **Parallel Sampling (Beam Search)**| Duplicate full KV caches | Zero duplication: share parent blocks via copy-on-write |
| **Prefix Caching** | Requires expensive memory copies | Instant block-pointer reuse for identical system prompts |`
  },
  {
    number: 13,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Continuous Batching (Iteration-Level Scheduling) vs. Static Batching",
    content: `### 1. Static Batching Bottleneck in Autoregressive Serving

In traditional deep learning (computer vision, classification), inputs have fixed dimensions and static batching works well. In LLM generation, however, requests have **unpredictable generation lengths**:

\`\`\`
Static Batching: GPU Underutilization
Request A: [ Gen 10 tokens ] ──► Idle (Waiting for B & C) ──────────────────────────┐
Request B: [ Gen 40 tokens ] ──────────────► Idle (Waiting for C) ───────────────────┼─► Batch Finishes
Request C: [ Gen 120 tokens ] ───────────────────────────────────────────────────────┘
                              ▲ Massive wasted GPU cycles during decoding
\`\`\`

---

### 2. Continuous Batching (Iteration-Level Scheduling)

Pioneered by Orca (Yu et al.) and standard in vLLM / TensorRT-LLM, **Continuous Batching** operates at the **iteration level** (every individual decoding step):
- As soon as Request A outputs an \`<EOS>\` token, it is immediately evicted from the active batch.
- A waiting request from the queue (Request D) enters the batch on the *very next step* without pausing or resetting existing requests:

\`\`\`
Continuous Iteration-Level Batching:
Step:    1    2    ...    10   11   12   ...   40   41   42   ...
Req A:  [#1] [#2] ...   [EOS] ◄── Evicted!
Req B:  [#1] [#2] ...   [#10][#11][#12] ... [EOS]
Req C:  [#1] [#2] ...   [#10][#11][#12] ... [#40][#41][#42] ...
Req D:                    ▲ Newly scheduled on Step 11!
\`\`\`

---

### 3. Production Impact on Key Latency Metrics
- **Throughput**: Improves by **3x to 5x** over static batching.
- **Time to First Token (TTFT)**: New requests do not wait for earlier long-generation requests to complete.
- **GPU Tensor Core Saturation**: Keeps matrix multiply units continuously loaded.`
  },
  {
    number: 14,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Prompt Caching & Prefix Caching: Anthropic, Gemini & vLLM Internal Mechanics",
    content: `### 1. The Redundant Prompt Problem

In typical enterprise AI workloads, 80% to 95% of prompt tokens are identical across sequential calls:
- Static System Prompts (1,000–5,000 tokens of rules and formatting constraints).
- Few-Shot Examples.
- Large Ingested Documents (e.g., 50-page financial report queried repeatedly by users).
- Multi-turn conversation chat history.

Without caching, the model must re-run the compute-heavy **Prefill phase** over the exact same prefix on every single turn!

---

### 2. Prefix Caching Mechanics

When a request enters the engine, the system hashes prefix token sequences into a Radix Tree or Trie:

\`\`\`
                         [ Root Node ]
                               │
               hash("You are an enterprise support...")
                               │
                               ▼
                    [ Block ID: 101-105 ] (Cached in VRAM)
                               │
             ┌─────────────────┴─────────────────┐
             ▼                                   ▼
    User Turn 1 Chunks                   User Turn 2 Chunks
    (Compute prefill only                (Compute prefill only
     for the new user delta)              for the new user delta)
\`\`\`

---

### 3. Economic & Latency Comparison

| Vector | Uncached Request | Cached Prefix Request (Anthropic / vLLM) | Improvement |
| :--- | :--- | :--- | :--- |
| **Prefill Latency (TTFT)** | 1,200 ms (re-computing 10k tokens) | **80 ms** (fetching KV cache from VRAM) | **15x Faster TTFT** |
| **Compute Cost (Tokens)** | 100% standard input token cost | **10% to 25%** of standard token rate | **75–90% Cost Reduction** |
| **GPU Energy & Heat** | Continuous GEMM matrix operations | Fast memory read | Substantially higher concurrency |

\`\`\`python
# Example: Anthropic Prompt Caching Header Configuration
import anthropic

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-3-5-sonnet-20241022",
    max_tokens=1024,
    system=[
        {
            "type": "text",
            "text": "Detailed 20-page system documentation and corporate knowledge base...",
            "cache_control": {"type": "ephemeral"} # Instructs engine to cache prefix
        }
    ],
    messages=[{"role": "user", "content": "What is the vacation policy?"}]
)
\`\`\``
  },
  {
    number: 15,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Speculative Decoding: Small Draft Models, Verification & Latency Reduction",
    content: `### 1. The Fundamental Decode Latency Wall

In modern GPUs, memory bandwidth—not compute capability—is the primary bottleneck for autoregressive token decoding. Reading all 70 billion parameters from GPU HBM memory to generate a single token utilizes only ~5% of GPU tensor core compute.

**Speculative Decoding** (Leviathan et al.) breaks this sequential barrier:

\`\`\`
  1. Small Draft Model (e.g. Llama 3 8B)
     Generates K draft tokens sequentially (Fast & Cheap):
     [ "The", "capital", "of", "France", "is" ]
                         │
                         ▼
  2. Large Target Model (e.g. Llama 3 70B)
     Evaluates all K tokens concurrently in a SINGLE parallel prefill step!
     [ Validated? -> Yes, Yes, Yes, Yes, Correct ]
                         │
                         ▼
  Result: 4 to 5 tokens generated in the time of a single large-model forward pass!
\`\`\`

---

### 2. Mathematical Guarantee: Zero Degradation in Output Quality

Speculative decoding uses **Speculative Sampling** (rejection sampling). If the target model rejects token $k$:
- All tokens after $k$ are discarded.
- A modified sampling distribution guarantees that the final output distribution is **mathematically identical** to sampling directly from the large target model!

---

### 3. Performance Trade-Off Matrix

| Metric | Standard Sequential Decoding | Speculative Decoding |
| :--- | :--- | :--- |
| **Inter-Token Latency (ITL)** | 40ms / token | **15ms – 20ms / token (2x to 2.5x speedup)** |
| **Accuracy Loss** | 0% | **0% (Exact mathematical equivalence)** |
| **VRAM Requirement** | Target model only (e.g., 140 GB) | Target model + Draft model (e.g., 140 GB + 16 GB) |
| **Best Acceptance Rate** | N/A | High-acceptance tasks (code completion, structured JSON, common idioms) |`
  },
  {
    number: 16,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Tokenization Mechanics: Byte-Pair Encoding (BPE), Token Healing & Multi-Lingual Compression",
    content: `### 1. Byte-Pair Encoding (BPE) Algorithm

Large Language Models do not process raw strings; they process numeric **tokens**. BPE builds vocabulary bottom-up from individual bytes, iteratively merging the most frequently adjacent byte pairs:

\`\`\`
Initial Bytes:  [ 'l', 'o', 'w', 'e', 's', 't' ]
Pass 1: Merge ('l', 'o') ──► 'lo'
Pass 2: Merge ('e', 's') ──► 'es'
Pass 3: Merge ('es', 't') ──► 'est'
Final Tokenization: ['lowest'] or ['low', 'est']
\`\`\`

---

### 2. Token Healing: Fixing the Trailing Whitespace Bug

Modern BPE tokenizers treat leading spaces as part of the token (e.g., \`" apple"\` $\\neq$ \`"apple"\`). 
When prompts end abruptly with partial words or punctuation (e.g., \`"The URL is http:"\`), standard greedy tokenizers commit to sub-optimal token boundaries:

\`\`\`
Without Token Healing:
User Prompt: "http:" ──► Encoded as Token("http") + Token(":")
Model generates: Token("/") ──► Output: "http: /" (Incorrect space inserted!)

With Token Healing:
Removes the last token, backs up the pointer, and lets the model regenerate from valid prefixes:
Prompt boundary healed ──► Generates Token("://") seamlessly!
\`\`\`

---

### 3. Multi-Lingual & Code Compression Ratios

| Language / Domain | Characters per Token (GPT-2, 50k vocab) | Characters per Token (Llama 3 / GPT-4o, 128k–200k vocab) | Impact |
| :--- | :--- | :--- | :--- |
| **English Prose** | ~4.0 chars / token | ~4.5 chars / token | High efficiency baseline |
| **Python Code** | ~3.2 chars / token | ~4.1 chars / token | Efficient whitespace & keyword encoding |
| **Hindi / Arabic / East Asian** | ~1.1 chars / token (Heavy byte fragmentation) | ~2.8 chars / token | **2.5x cheaper and faster** due to expanded multi-lingual vocabulary |`
  },
  {
    number: 17,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Model Quantization Techniques: PTQ vs. QAT, FP16, INT8, INT4, AWQ, GPTQ & GGUF",
    content: `### 1. The VRAM Problem & Quantization Goals

A 70-billion parameter model stored in FP16 (16-bit floating point) requires $70 \\times 2 = \\mathbf{140\\text{ GB}}$ of VRAM simply to hold model weights—demanding two expensive 80 GB A100/H100 GPUs.
**Quantization** maps continuous 16-bit float weights into lower-precision discrete integers (INT8, INT4):

\`\`\`
Continuous FP16 (-3.4e38 to +3.4e38) ──► Quantize: w_int = round(w_fp16 / Scale) + ZeroPoint ──► Discrete INT4 (-8 to +7)
\`\`\`

---

### 2. State-of-the-Art Quantization Methods

| Quantization Method | Target Precision | Calibrated On | Hardware Target | Best Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **GPTQ** | INT4 / INT8 | One-shot Hessian calibration dataset | GPU (CUDA) | High-throughput GPU inference (vLLM, TensorRT) |
| **AWQ (Activation-aware)** | INT4 | Identifies & protects top 1% salient weights from quantization | GPU (Tensor Cores) | **Best accuracy retention** among 4-bit GPU methods |
| **GGUF (llama.cpp)** | 2-bit to 8-bit (k-quants) | CPU/Apple Silicon/Metal | CPU / Mac / Consumer GPUs | Local edge devices, developer laptops, consumer PCs |
| **FP8 (Hopper Native)** | 8-bit Float (E4M3 / E5M2) | Native hardware execution on H100/H200 | NVIDIA Hopper (H100) | **Zero perplexity loss** with 2x speedup and 50% VRAM reduction |

---

### 3. VRAM Sizing Rule of Thumb

$$\\text{Model VRAM (GB)} \\approx \\text{Param Count (Billions)} \\times \\frac{\\text{Bits per Weight}}{8} \\times 1.25\\text{ (Overhead)}$$

- **70B Model in FP16**: $70 \\times 2 \\times 1.25 \\approx \\mathbf{175\\text{ GB}}$ (Requires 2x 80GB H100s)
- **70B Model in AWQ INT4**: $70 \\times 0.5 \\times 1.25 \\approx \\mathbf{43.7\\text{ GB}}$ (Fits on a **single** 80GB H100 with massive room for KV cache!)`
  },
  {
    number: 18,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "FlashAttention 1, 2 & 3: Memory Tiling & Eliminating the O(N²) HBM Bottleneck",
    content: `### 1. The Standard Attention Memory Bottleneck

Standard Self-Attention calculates:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d}}\\right)V$$

In standard PyTorch implementations:
1. $QK^T$ materializes an $N \\times N$ intermediate matrix in GPU High-Bandwidth Memory (HBM).
2. For an 8,000-token sequence, $N \\times N = 64,000,000$ elements.
3. For a 64,000-token sequence, $N \\times N = 4,096,000,000$ elements $\\rightarrow$ **Out of Memory (OOM)** crash!

\`\`\`
Standard Attention: Slow HBM Thrashing
GPU SRAM (Fast, 19 TB/s, ~100 KB) ◄────┐
                                        ├─► Read/Write huge N x N matrix repeatedly!
GPU HBM  (Slow, 3 TB/s, ~80 GB)   ◄────┘
\`\`\`

---

### 2. FlashAttention Mechanics: Tiling & Online Softmax

Pioneered by Tri Dao (Stanford), **FlashAttention** never materializes the full $N \\times N$ matrix in HBM:
- **Tiling**: Splits $Q, K, V$ matrices into small blocks that fit entirely inside ultra-fast on-chip **SRAM** (L1 cache).
- **Online Softmax**: Computes incremental softmax normalization factors dynamically across tiles without needing the global maximum upfront.
- **Kernel Fusion**: Combines matrix multiply, mask, softmax, and value accumulation into a single fused GPU kernel.

---

### 3. FlashAttention Evolution

| Generation | Core Innovation | Speedup vs. Standard Attention |
| :--- | :--- | :--- |
| **FlashAttention-1** | SRAM tiling + Online Softmax mathematical trick | 2x – 4x speedup, $O(N)$ memory instead of $O(N^2)$ |
| **FlashAttention-2** | Parallelizes across sequence length dimension and optimizes warp scheduling | 2x speedup over FlashAttention-1 (~73% theoretical peak FLOPs) |
| **FlashAttention-3** | Exploits Hopper H100 hardware features (FP8 support, Tensor Memory Accelerator TMA, asynchronous warps) | Up to 1.5x–2x speedup over FA-2 on NVIDIA H100 |`
  },
  {
    number: 19,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "Streaming Architecture: Server-Sent Events (SSE), WebSockets & The Vercel AI SDK Protocol",
    content: `### 1. Why Streaming is Mandatory for LLM UX

Because autoregressive models generate text sequentially at ~30–80 tokens per second:
- **Non-streaming**: User stares at a blank screen for 6–10 seconds until the entire 500-token paragraph completes.
- **Streaming**: The user receives the first token in **< 300 ms** (Time-To-First-Token, TTFT), reading tokens in real time as they generate.

---

### 2. Transport Protocol Comparison

| Protocol | Connection Type | Multiplexing | Browser Overhead | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Server-Sent Events (SSE)** | Unidirectional (Server $\\rightarrow$ Client) over HTTP/2 | High (reuses HTTP/2 connection) | Very Low (\`EventSource\` or \`fetch\` with \`ReadableStream\`) | **Industry Standard** for LLM chat completions |
| **WebSockets** | Full-Duplex (Bidirectional) | Requires dedicated TCP connection | High (custom heartbeat & reconnect logic) | Audio/Video Live API (e.g. Gemini Live, OpenAI Realtime) |
| **HTTP Long Polling** | Unidirectional HTTP/1.1 | None | Very High | Obsolete for LLM applications |

---

### 3. Production Fastify / Next.js SSE Streaming Implementation

\`\`\`typescript
// Next.js Route Handler (App Router: app/api/chat/route.ts)
import { OpenAIStream, StreamingTextResponse } from 'ai';
import OpenAI from 'openai';

const openai = new OpenAI();

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    stream: true,
    messages,
  });

  // Convert raw generator into WHATWG ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      for await (const chunk of response) {
        const text = chunk.choices[0]?.delta?.content || '';
        if (text) {
          // SSE Data Framing Protocol
          controller.enqueue(new TextEncoder().encode(\`data: \${JSON.stringify({ text })}\\n\\n\`));
        }
      }
      controller.enqueue(new TextEncoder().encode('data: [DONE]\\n\\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
    },
  });
}
\`\`\``
  },
  {
    number: 20,
    part: "Part 2: LLM Inference, Serving & Runtime Optimization",
    title: "LLM SLA Metrics & Capacity Planning: TTFT, ITL, TPS & Concurrency Modeling",
    content: `### 1. The Core LLM SLA Latency Metrics

Traditional web services measure P50/P95/P99 round-trip request latency. LLM systems decompose latency into four distinct operational metrics:

\`\`\`
Client Sends Request ──► [ Network ] ──► Prefill Phase ──► [ First Token Emitted ] ──► Decode Tokens ... ──► [ <EOS> Received ]
│◄───────────────────────────── TTFT ─────────────────────────────►│
                                                                   │◄────── ITL ──────►│
│◄──────────────────────────────────────── Total Request E2E Latency ────────────────────────────────────────►│
\`\`\`

1. **Time-To-First-Token (TTFT)**: Elapsed time from request dispatch until the client receives token #1. Governed by prefill compute and queue waiting time.
2. **Inter-Token Latency (ITL) / Time-Per-Output-Token (TPOT)**: Time between consecutive tokens during generation (target: < 30ms for human reading speed). Governed by memory bandwidth.
3. **Tokens Per Second (TPS)**: Total throughput per GPU instance (target throughput for serving infrastructure).
4. **Queue Time**: Time request sits waiting before entering an active continuous batch.

---

### 2. GPU Capacity Planning & Sizing Formula

To size an enterprise deployment serving $U$ concurrent users generating $T_{\\text{out}}$ tokens with average input $T_{\\text{in}}$:

$$\\text{Required Throughput (Tokens/sec)} = \\frac{U \\times (T_{\\text{in}} + T_{\\text{out}})}{\\text{Target Latency Window (s)}}$$

**Example Scenario**:
- 200 concurrent active users.
- Average prompt = 1,000 tokens, output = 200 tokens. Total = 1,200 tokens.
- Max acceptable round-trip response time = 5 seconds.
- $\\text{Target TPS} = \\frac{200 \\times 1,200}{5} = \\mathbf{48,000\\text{ tokens/sec}}$.
- A single 8x H100 node running vLLM delivers ~3,000–5,000 TPS on 70B models.
- **Infrastructure required**: 10–12 nodes of 8x H100 GPUs behind an AI load balancer.`
  }
];

