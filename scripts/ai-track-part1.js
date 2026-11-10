module.exports = [
  {
    number: 1,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "RAG vs. In-Context Learning vs. Fine-Tuning: Architectural Trade-Offs & Decision Matrix",
    content: `### 1. High-Level Architectural Comparison

When designing enterprise AI systems, engineering teams must choose between three distinct paradigms for injecting domain knowledge and specialized behavior into Large Language Models (LLMs):

\`\`\`
                    ┌────────────────────────────────────────────────────────┐
                    │       Enterprise Domain Problem Evaluation             │
                    └───────────────────────────┬────────────────────────────┘
                                                │
                 ┌──────────────────────────────┼─────────────────────────────┐
                 ▼                              ▼                             ▼
       ┌───────────────────┐          ┌───────────────────┐         ┌───────────────────┐
       │ In-Context (ICL)  │          │   Retrieval-Aug   │         │    Fine-Tuning    │
       │ Few-Shot Prompt   │          │  Generation (RAG) │          │    (PEFT / LoRA)  │
       └─────────┬─────────┘          └─────────┬─────────┘         └─────────┬─────────┘
                 │                              │                             │
    • Dynamic, short-lived         • Large, evolving corpus       • Static specialized style/
    • Zero training cost           • Real-time factual sync       • Domain vocabulary / syntax
    • Bounded by context window    • Verifiable source attribution• High training & eval cost
\`\`\`

---

### 2. Deep-Dive Comparative Matrix

| Vector | In-Context Learning (Few-Shot) | Retrieval-Augmented Generation (RAG) | Fine-Tuning (LoRA / QLoRA / Full) |
| :--- | :--- | :--- | :--- |
| **Primary Purpose** | Guiding response format & immediate instructions | Grounding responses in dynamic, proprietary facts | Adapting tone, vocabulary, structured syntax, or reasoning style |
| **Knowledge Freshness** | Session-only (dynamic per prompt) | Real-time (immediate updates via vector DB sync) | Static snapshot at training cutoff (requires re-tuning) |
| **Hallucination Rate** | Moderate to High (relies on parametric memory) | Low (anchored in retrieved chunks with citations) | Moderate (does not reliably eliminate hallucinations) |
| **Compute / Training Cost** | Zero training cost | Zero model training; moderate vector indexing cost | High GPU training compute ($10s to $1,000s) |
| **Inference Cost (Tokens)** | High (examples consume context window tokens) | Moderate (retrieved chunks add 500–2,000 prompt tokens) | Low (short prompts; weights encode domain behavior) |
| **Source Attribution** | None | Native citations (document chunk IDs, page numbers) | Impossible (knowledge is diffused across billions of weights) |
| **Best Used When** | Ad-hoc formatting, quick prototyping | Customer support, internal knowledge bases, regulatory docs | Custom code generation, legal drafting style, classification |

---

### 3. Decision Framework & Production Heuristic

A production decision tree follows three critical questions:
1. **Does the knowledge change frequently (daily/hourly)?** $\\rightarrow$ **RAG** is mandatory.
2. **Is strict source verifiability or audit compliance required?** $\\rightarrow$ **RAG** is mandatory (citations to ground truth documents).
3. **Is the task focused on style, rigid output schema, or specialized syntax rather than novel facts?** $\\rightarrow$ **Fine-Tuning** is superior.

\`\`\`python
def choose_llm_strategy(frequently_changing_data: bool, strict_citations_required: bool, custom_syntax_or_style: bool) -> str:
    if frequently_changing_data or strict_citations_required:
        if custom_syntax_or_style:
            return "Hybrid: Fine-Tune for style/schema + RAG for ground-truth retrieval"
        return "RAG (Retrieval-Augmented Generation)"
    if custom_syntax_or_style:
        return "Fine-Tuning (LoRA/QLoRA)"
    return "In-Context Learning (Few-Shot Prompt Engineering)"
\`\`\``
  },
  {
    number: 2,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Document Chunking Strategies: Fixed-Size, Recursive, Semantic & Late Chunking",
    content: `### 1. The Chunking Dilemma

In RAG systems, the quality of retrieved context is strictly bounded by document chunking:
- **Too small**: Destroys context and semantic meaning.
- **Too large**: Ingests noise, exceeds context limits, and dilutes vector similarity scores.

\`\`\`
Raw PDF/Doc ──► [ Chunking Engine ] ──► [ Embeddings ] ──► [ Vector Store ]
                      │
  ┌───────────────────┼───────────────────┬───────────────────┐
  ▼                   ▼                   ▼                   ▼
Fixed-Size         Recursive           Semantic           Late Chunking
(Fixed token/char) (Paragraph/Header)  (Embedding shifts) (Whole-doc attention)
\`\`\`

---

### 2. Chunking Methodologies

| Strategy | Mechanics | Pros | Cons | Ideal Use Case |
| :--- | :--- | :--- | :--- | :--- |
| **Fixed-Size with Overlap** | Splitting every $N$ tokens with $M$ token overlap (e.g., 512 tokens, 50 overlap). | Fast, trivial to implement, constant memory. | Splits sentences across boundaries, ignores semantic flow. | Baseline prototypes, uniform unstructured logs. |
| **Recursive Character Splitting** | Splits hierarchically by paragraph (\`\\n\\n\`), sentence (\`\\n\`), then space (\` \`). | Preserves sentence and paragraph boundaries cleanly. | Heuristic; does not detect semantic topic shifts. | General prose, technical documentation, articles. |
| **Semantic Chunking** | Computes cosine similarity between consecutive sentences; splits where similarity drops below a threshold. | High semantic cohesion within every chunk. | Requires $N$ embedding calls per document during ingestion. | Complex whitepapers, multi-topic meeting transcripts. |
| **Late Chunking** | Passes the entire document through long-context embedding model; pools token embeddings into chunks *after* attention. | Every chunk retains global document attention context. | Requires long-context embedding models (e.g., 8k tokens). | Legal contracts, financial reports where definitions span pages. |

---

### 3. Production Recursive Chunking Implementation

\`\`\`python
from typing import List

class RecursiveTextChunker:
    def __init__(self, chunk_size: int = 500, chunk_overlap: int = 50, separators: List[str] = None):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.separators = separators or ["\\n\\n", "\\n", ". ", " "]

    def split_text(self, text: str) -> List[str]:
        final_chunks: List[str] = []
        # Recursive splitting logic preserving semantic paragraphs
        splits = self._split(text, self.separators)
        
        current_chunk = ""
        for s in splits:
            if len(current_chunk) + len(s) <= self.chunk_size:
                current_chunk += s
            else:
                if current_chunk:
                    final_chunks.append(current_chunk.strip())
                # Overlap logic
                current_chunk = current_chunk[-self.chunk_overlap:] + s if self.chunk_overlap < len(current_chunk) else s
        
        if current_chunk:
            final_chunks.append(current_chunk.strip())
        return final_chunks

    def _split(self, text: str, separators: List[str]) -> List[str]:
        if not separators:
            return list(text)
        sep = separators[0]
        splits = text.split(sep)
        result = []
        for s in splits:
            if len(s) > self.chunk_size and len(separators) > 1:
                result.extend(self._split(s, separators[1:]))
            else:
                result.append(s + sep)
        return result
\`\`\``
  },
  {
    number: 3,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Embedding Models & Distance Metrics: Cosine Similarity, Dot Product & Euclidean Distance",
    content: `### 1. Vector Distance Metrics in Semantic Retrieval

Semantic search maps textual chunks into high-dimensional vector spaces (e.g., 768 or 1536 dimensions). Similarity is determined by geometric distance metrics:

\`\`\`
   Cosine Similarity (Angle θ)        Euclidean Distance (L2)           Dot Product (Magnitude + Angle)
              B                                  B                                  B
             /                                  /|                                 /
            /                                  / |                                /
           / θ                                /  | d                             /
          /──────── A                        /___| A                            /──────── A
      cos(θ) = (A·B)/(||A|| ||B||)      d = sqrt(sum((Ai - Bi)^2))            A·B = sum(Ai * Bi)
\`\`\`

---

### 2. Mathematical Comparison & Selection Matrix

| Metric | Formula | Range | Normalization Dependency | Best Used In |
| :--- | :--- | :--- | :--- | :--- |
| **Cosine Similarity** | $\\cos(\\theta) = \\frac{u \\cdot v}{\\|u\\| \\|v\\|}$ | $[-1.0, 1.0]$ | Invariant to vector length / magnitude | General semantic search where text length varies |
| **Dot Product (Inner Product)** | $\\langle u, v \\rangle = \\sum_{i=1}^{n} u_i v_i$ | $(-\\infty, \\infty)$ | Highly sensitive to vector length | Normalized embeddings (unit vectors $\\|u\\|=1$) where Dot Product $\\equiv$ Cosine |
| **Euclidean Distance ($L_2$)** | $\\|u - v\\|_2 = \\sqrt{\\sum (u_i - v_i)^2}$ | $[0, \\infty)$ | Sensitive to vector length | Coordinate-based systems, image embeddings, clustering |

> [!IMPORTANT]
> **Performance Optimization**: Computing cosine similarity requires two vector norm divisions per comparison. In production vector databases (Milvus, Pinecone, Qdrant), always **L2-normalize embeddings at ingestion time**. Once normalized ($\\|v\\|=1$), **Cosine Similarity is identical to Dot Product**, which runs significantly faster via hardware SIMD/AVX instructions.

---

### 3. Python Implementation of Metric Equivalence

\`\`\`python
import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def l2_normalize(vec: np.ndarray) -> np.ndarray:
    norm = np.linalg.norm(vec)
    return vec if norm == 0 else vec / norm

# Proof of equivalence
v1 = np.array([0.4, 0.8, 0.2])
v2 = np.array([0.1, 0.9, 0.5])

# Standard cosine
cos_score = cosine_similarity(v1, v2)

# Fast Dot Product on normalized vectors
norm_v1 = l2_normalize(v1)
norm_v2 = l2_normalize(v2)
dot_score = np.dot(norm_v1, norm_v2)

assert np.isclose(cos_score, dot_score), "Normalized dot product must match cosine similarity!"
\`\`\``
  },
  {
    number: 4,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Vector Database Indexing Internals: HNSW vs. IVF-PQ Trade-Offs",
    content: `### 1. Approximate Nearest Neighbor (ANN) vs. Exact Search

Exact k-Nearest Neighbors ($k$-NN) computes distance against every vector in the database, yielding $O(N \\cdot D)$ complexity. For millions of vectors, exact search introduces hundreds of milliseconds of latency. Production vector databases use **Approximate Nearest Neighbor (ANN)** indexing:

\`\`\`
                        ┌───────────────────────────────────────────┐
                        │        ANN Indexing Architectural Trade   │
                        └─────────────────────┬─────────────────────┘
                                              │
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │          HNSW           │                       │         IVF-PQ          │
        │ Hierarchical Navigable  │                       │ Inverted File with      │
        │      Small World        │                       │ Product Quantization    │
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │                                                 │
        • Multi-layer graph skip-list                     • Voronoi cluster partitions
        • Top-tier recall (95–99%)                        • 80–90% RAM reduction (compression)
        • Heavy RAM memory usage                          • Lower recall, higher build time
\`\`\`

---

### 2. Comprehensive Index Comparison

| Feature | Flat (Exact k-NN) | HNSW (Hierarchical Graph) | IVF-PQ (Quantized Inverted File) |
| :--- | :--- | :--- | :--- |
| **Search Complexity** | $O(N)$ | $O(\\log N)$ | $O(\\text{nprobe} \\cdot \\frac{N}{K})$ |
| **Recall / Accuracy** | 100% (Ground Truth) | 95% – 99% (State-of-the-art) | 80% – 92% |
| **Query Latency** | Very High (100–1000ms) | Ultra Low (< 5ms) | Low (< 15ms) |
| **RAM Consumption** | High (raw vectors) | Very High (raw vectors + graph edges) | Extremely Low (8x to 32x compressed) |
| **Index Build Speed** | Instant (no index) | Slow ($O(N \\log N)$ graph construction) | Medium (K-Means training + centroid assignment) |
| **Dynamic Updates** | Instant | Supported (node insertions) | Expensive (requires periodic retraining of centroids) |

---

### 3. Production Recommendation Rule
- Choose **HNSW** for systems with < 10 million vectors where recall accuracy and sub-10ms query latency are paramount and RAM budget is flexible.
- Choose **IVF-PQ** for large-scale enterprise deployments (> 50 million vectors) where fitting the entire vector index into server RAM without exceeding cloud infrastructure budgets is the primary constraint.`
  },
  {
    number: 5,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Cross-Encoder Re-Ranking: Architecture, Late Interaction (ColBERT) & Two-Stage Retrieval",
    content: `### 1. The Two-Stage Retrieval Funnel

Bi-encoders (e.g., text-embedding-3-small, BGE) encode query and documents independently into fixed-length vectors. Because tokens cannot interact across query and document during embedding generation, bi-encoders sacrifice subtle semantic nuance for retrieval speed:

\`\`\`
   [ 10,000,000 Document Chunks ]
                 │
                 ▼  Stage 1: Bi-Encoder (Dense Vector Search / BM25)
   [ Top 50–100 Candidate Chunks ]  ──► (Fast ANN search: < 10ms)
                 │
                 ▼  Stage 2: Cross-Encoder Re-Ranker (Full Attention)
   [ Top 3–5 Pristine Chunks ]      ──► (Deep cross-attention: ~50ms)
                 │
                 ▼
        [ LLM Prompt Context ]
\`\`\`

---

### 2. Bi-Encoder vs. Cross-Encoder Architecture

\`\`\`
Bi-Encoder: Independent Feed-Forward
Query ──► [ Transformer ] ──► Vector Q ──┐
                                         ├─► Cosine Sim (Fast!)
Doc   ──► [ Transformer ] ──► Vector D ──┘

Cross-Encoder: Joint Multi-Head Attention
[CLS] Query [SEP] Document [SEP] ──► [ Full Transformer Attention ] ──► Relevance Score [0, 1]
\`\`\`

---

### 3. Production Two-Stage Retrieval Implementation

\`\`\`python
from typing import List, Dict
import numpy as np

# Conceptual implementation of Stage 1 + Stage 2 Funnel
class TwoStageRAGPipeline:
    def __init__(self, vector_store, reranker_model):
        self.vector_store = vector_store
        self.reranker = reranker_model

    def retrieve(self, query: str, top_k: int = 5) -> List[Dict]:
        # Stage 1: Fast candidate retrieval (retrieve 50 candidates)
        candidates = self.vector_store.search(query, k=50)

        # Stage 2: Cross-Encoder Re-ranking
        # Pair query with each candidate for joint cross-attention
        pairs = [[query, doc["content"]] for doc in candidates]
        scores = self.reranker.predict(pairs)

        for i, doc in enumerate(candidates):
            doc["rerank_score"] = float(scores[i])

        # Sort descending by re-rank score and return top K
        ranked_docs = sorted(candidates, key=lambda x: x["rerank_score"], reverse=True)
        return ranked_docs[:top_k]
\`\`\``
  },
  {
    number: 6,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Hybrid Search (Dense + Sparse) & Reciprocal Rank Fusion (RRF)",
    content: `### 1. Why Pure Vector Search Fails in Production

Pure dense vector embeddings excel at semantic similarity (e.g., matching "automobile malfunction" with "car broken down"), but frequently fail on:
1. Exact keyword queries, part numbers, SKUs (e.g., \`CVE-2024-38077\`, \`ERR_CONN_REFUSED\`).
2. Rare domain terms and acronyms.
3. Specific identifiers (e.g., user IDs, function names).

**Hybrid Search** combines Sparse Lexical Search (BM25 / SPLADE) with Dense Vector Retrieval (HNSW).

---

### 2. Reciprocal Rank Fusion (RRF) Algorithm

Rather than trying to normalize and blend fundamentally incomparable score scales (e.g., cosine similarity $[0, 1]$ vs. unbounded BM25 scores $[0, \\infty)$), **Reciprocal Rank Fusion (RRF)** scores documents strictly by their ordinal ranking position in each result list:

$$\\text{RRF Score}(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}$$

Where:
- $M$ is the set of retrieval systems (Dense and Sparse).
- $r_m(d)$ is the 1-based rank position of document $d$ in system $m$.
- $k$ is a smoothing constant (standard production default: $k = 60$).

---

### 3. Python Implementation of Hybrid Search with RRF

\`\`\`python
from typing import List, Dict

def reciprocal_rank_fusion(dense_results: List[str], sparse_results: List[str], k: int = 60, top_n: int = 5) -> List[Dict]:
    rrf_scores: Dict[str, float] = {}

    # Accumulate dense ranks
    for rank, doc_id in enumerate(dense_results, start=1):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank))

    # Accumulate sparse ranks
    for rank, doc_id in enumerate(sparse_results, start=1):
        rrf_scores[doc_id] = rrf_scores.get(doc_id, 0.0) + (1.0 / (k + rank))

    # Sort documents by accumulated RRF score
    sorted_docs = sorted(rrf_scores.items(), key=lambda item: item[1], reverse=True)
    return [{"doc_id": doc_id, "score": score} for doc_id, score in sorted_docs[:top_n]]

# Example test
dense_hits = ["doc_A", "doc_B", "doc_C"]
sparse_hits = ["doc_C", "doc_A", "doc_D"]

final_top = reciprocal_rank_fusion(dense_hits, sparse_hits, k=60, top_n=3)
# doc_A and doc_C appear in both lists and receive elevated fused ranking
\`\`\``
  },
  {
    number: 7,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Advanced Query Transformation: HyDE (Hypothetical Document Embeddings) & Multi-Query Decomposition",
    content: `### 1. The Query-Document Asymmetry Problem

In standard RAG, short, informal user queries (e.g., *"Why did my pod crash with 137?"*) are compared against lengthy, formal documentation chunks (e.g., *"Kubernetes OOMKilled SIGKILL Exit Code 137 occurs when cgroup memory limits are breached..."*). Because the user query and document chunk have completely different lengths, linguistic structures, and vocabulary distributions, standard vector cosine similarity often performs poorly.

\`\`\`
User Query: "Why did my pod crash with 137?"
    │
    ▼ (LLM generates hypothetical answer)
Hypothetical Document (HyDE): 
"Exit code 137 indicates that a Linux process received SIGKILL, typically triggered 
by the Kubernetes OOM (Out Of Memory) killer when the container exceeded memory limit..."
    │
    ▼ (Embed the hypothetical answer instead of the query!)
Dense Vector ──► Vector Database Search ──► Accurate Production Docs Retrieved
\`\`\`

---

### 2. Multi-Query Expansion & Sub-Question Decomposition

For complex queries requiring multi-step reasoning (e.g., *"Compare Stripe and PayPal transaction fees for cross-border SaaS companies"*):
1. **Multi-Query Expansion**: An LLM generates 3–5 linguistic variations of the query to broaden search recall.
2. **Sub-Question Decomposition**: Breaks multi-part queries into atomic single-intent questions:
   - Query 1: *"Stripe cross-border international transaction fees"*
   - Query 2: *"PayPal international merchant payment processing rates"*
   - Query 3: *"SaaS recurring billing payment gateway fee comparison"*

---

### 3. Production Query Decomposition Implementation

\`\`\`python
from typing import List

async def decompose_complex_query(llm_client, user_query: str) -> List[str]:
    prompt = f"""Break down the following complex user query into 2 to 4 atomic sub-questions 
suitable for vector search retrieval. Output one question per line without numbering.

User Query: {user_query}"""

    response = await llm_client.generate(prompt)
    sub_queries = [line.strip() for line in response.split("\\n") if line.strip()]
    return sub_queries or [user_query]
\`\`\``
  },
  {
    number: 8,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Context Window Stuffing & The Lost-in-the-Middle Phenomenon",
    content: `### 1. The "Lost in the Middle" Effect in Modern LLMs

Research by Liu et al. revealed that LLMs do not process long contexts uniformly. Even in models supporting 128k–1M context windows (GPT-4o, Claude 3.5 Sonnet, Gemini 1.5 Pro), retrieval accuracy degrades sharply when critical ground-truth facts are located in the middle of a massive context prompt:

\`\`\`
Attention Accuracy U-Curve:
100% ──┐                                             ┌── 100%
       │                                             │
       │                                             │
 50% ──┤                                             ├── 50%
       │        "Lost in the Middle" Valley          │
  0% ──┴───────────────────────▼─────────────────────┴── 0%
    Prompt Start                                  Prompt End
    (High Attention)       (Degraded Attention)   (High Attention)
\`\`\`

---

### 2. Root Causes of Attention Attenuation
- **Rotary Position Embeddings (RoPE) Decay**: Relative positional encodings prioritize tokens placed near the system prompt (beginning) or near the generation target (end).
- **Causal Masking**: Autoregressive transformers attend backwards; information placed immediately before the final generation request is fresher in working attention memory.

---

### 3. Architectural Mitigation Strategies

| Mitigation Technique | Implementation | Benefit |
| :--- | :--- | :--- |
| **Primacy/Recency Rerank Sorting** | Place the top #1 and #2 most relevant chunks at the very end and beginning of the context block; middle holds lower-scoring chunks. | Overcomes U-shaped attention valley. |
| **Context Compression / Summarization** | Run small summarizers (e.g., flash models) over chunks before injection. | Reduces total token volume by 60–80%. |
| **Targeted Chunk Filtering** | Use strict re-ranker thresholds (e.g., score $> 0.75$) to discard irrelevant candidates rather than stuffing up to token limits. | Maximizes signal-to-noise ratio. |

\`\`\`python
def arrange_chunks_avoid_lost_in_middle(chunks: list) -> list:
    """Sorts chunks alternating between the ends of the prompt to maximize attention."""
    # Assumes chunks are sorted descending by relevance score
    sorted_chunks = sorted(chunks, key=lambda x: x["score"], reverse=True)
    reordered = [None] * len(sorted_chunks)
    left, right = 0, len(sorted_chunks) - 1

    for i, chunk in enumerate(sorted_chunks):
        if i % 2 == 0:
            reordered[right] = chunk
            right -= 1
        else:
            reordered[left] = chunk
            left += 1

    return reordered
\`\`\``
  },
  {
    number: 9,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Automated RAG Evaluation: The RAGAS Triad & Synthetic Benchmark Generation",
    content: `### 1. The RAG Triad of Evaluation

Evaluating RAG pipelines cannot rely solely on traditional NLP metrics like BLEU or ROUGE, which measure surface n-gram overlap. The industry-standard **RAGAS (Retrieval Augmented Generation Assessment)** framework decomposes evaluation into three core orthogonal dimensions:

\`\`\`
                     ┌───────────────────────┐
                     │      User Query       │
                     └──────────┬────────────┘
                                │
               Context Relevance │ Answer Relevance
                                ▼
  ┌───────────────────┐                  ┌───────────────────┐
  │ Retrieved Context │◄─────────────────┤ Generated Answer  │
  └───────────────────┘   Faithfulness   └───────────────────┘
\`\`\`

---

### 2. The Core RAG Metrics Explained

| Metric | Measured Components | Failure Mode Detected |
| :--- | :--- | :--- |
| **Faithfulness (Grounding)** | $\\frac{\\text{Claims in Answer verifiable by Context}}{\\text{Total Claims in Answer}}$ | **Hallucination**: The LLM made up facts not present in retrieved context. |
| **Answer Relevance** | Semantic cosine similarity between generated answer and original query. | **Drift / Evasion**: The answer is truthful to context but failed to answer the user's question. |
| **Context Precision** | Signal-to-noise ratio of retrieved chunks (rank of relevant chunks). | **Retrieval Noise**: Irrelevant documents were retrieved ahead of relevant ones. |
| **Context Recall** | Extent to which retrieved context contains all facts needed to answer query. | **Retrieval Miss**: Critical ground truth was never retrieved from the vector store. |

---

### 3. Automated Faithfulness Verification Script

\`\`\`python
import json

async def evaluate_faithfulness(llm_evaluator, context: str, answer: str) -> float:
    prompt = f"""Given the context and answer below, extract all factual statements from the answer. 
Then, verify if each statement is directly supported by the context.

Context:
{context}

Answer:
{answer}

Output valid JSON only:
{{
  "statements": [
    {{"statement": "...", "supported": true}},
    {{"statement": "...", "supported": false}}
  ]
}}"""

    res = await llm_evaluator.generate(prompt)
    data = json.loads(res)
    statements = data.get("statements", [])
    if not statements:
        return 0.0

    supported_count = sum(1 for s in statements if s.get("supported") is True)
    return supported_count / len(statements)
\`\`\``
  },
  {
    number: 10,
    part: "Part 1: RAG Architecture, Chunking & Vector Search",
    title: "Multi-Tenant Vector DB Architecture: Tenant Isolation, Pre-Filtering & Partition Keys",
    content: `### 1. Enterprise Multi-Tenancy Patterns

In multi-tenant SaaS applications, ensuring that Customer A cannot retrieve Customer B's confidential vector chunks is a critical security and compliance requirement. There are three primary multi-tenant architectural patterns in vector stores:

\`\`\`
   Pattern 1: Database-per-Tenant         Pattern 2: Namespace-per-Tenant       Pattern 3: Metadata Pre-Filtering
   ┌────────────────────────────────┐    ┌────────────────────────────────┐    ┌────────────────────────────────┐
   │ Tenant A DB   │ Tenant B DB    │    │ Tenant A Index │ Tenant B Index│    │ Shared Global Vector Index     │
   │ [HNSW Graph]  │ [HNSW Graph]   │    │ [Namespace A]  │ [Namespace B] │    │ Chunks tagged: {"tenant": "A"} │
   └────────────────────────────────┘    └────────────────────────────────┘    └────────────────────────────────┘
    Maximum Security • High Cost          Balanced Security • Medium Scale      Low Cost • Strict Filter Logic Req.
\`\`\`

---

### 2. Multi-Tenant Architectural Comparison

| Architecture | Isolation Level | Resource Overhead | Scaling Limit | Best Used In |
| :--- | :--- | :--- | :--- | :--- |
| **Database per Tenant** | Physical (Dedicated DB process/instance) | Highest (idle memory overhead per tenant) | Hard limit on hundreds of tenants | Highly regulated banking, healthcare (HIPAA) |
| **Collection / Namespace per Tenant** | Logical (Separate HNSW graph in shared cluster) | Moderate | Supported up to 10,000 namespaces | B2B enterprise SaaS with distinct tenant boundaries |
| **Metadata Partitioning (Pre-Filtering)** | Shared graph with indexed metadata filter | Lowest | Unlimited tenants (millions) | High-volume B2C or multi-user consumer apps |

---

### 3. Pre-Filtering vs. Post-Filtering Pitfall

> [!CAUTION]
> **Never use Post-Filtering for multi-tenancy!**
> - **Post-Filtering**: Runs top-$K$ vector search across the entire database, then discards items where \`tenant_id != current_tenant\`. If Tenant A's documents only constitute 1% of the database, the top 100 vector hits may contain 0 items for Tenant A, returning an empty result!
> - **Pre-Filtering (Iterative Single-Stage)**: The vector index traverses the HNSW graph while restricting candidate nodes to those matching the tenant bitmap, guaranteeing $K$ results for the target tenant.

\`\`\`python
# Correct Production Pre-Filter Query (Qdrant / Pinecone style)
search_results = vector_client.search(
    collection_name="enterprise_documents",
    query_vector=query_embedding,
    query_filter={
        "must": [
            {"key": "tenant_id", "match": {"value": current_user.tenant_id}},
            {"key": "department", "match": {"value": current_user.department}},
            {"key": "is_confidential", "match": {"value": False}}
        ]
    },
    limit=5
)
\`\`\``
  }
];

