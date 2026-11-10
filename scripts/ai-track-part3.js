module.exports = [
  {
    number: 21,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "The ReAct Pattern (Reason + Act): Thought-Action-Observation Loop & Production Trade-Offs",
    content: `### 1. The ReAct (Reasoning + Acting) Paradigm

Introduced by Yao et al. (Google Research / Princeton), **ReAct** interleaves reasoning traces ("Thoughts") with task-specific actions ("Tool Calls") and real-world feedback ("Observations"):

\`\`\`
                                  User Goal / Prompt
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Thought: Formulate hypothesis & │
                         │ next action step                │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Action: Call tool (Search, SQL, │
                         │ Calculator, API)                │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                         ┌─────────────────────────────────┐
                         │ Observation: Receive real-world │
                         │ tool output / error             │
                         └────────────────┬────────────────┘
                                          │
                                          ▼
                    Is goal achieved or max steps reached?
                         ├─────────► YES ──► Final Answer to User
                         └─────────► NO  ──► Loop back to Thought
\`\`\`

---

### 2. Failure Modes & Mitigations in Production ReAct Agents

| Failure Mode | Manifestation | Production Mitigation |
| :--- | :--- | :--- |
| **Action Parsing Failure** | The model outputs invalid JSON or malformed tool call syntax. | Use native constrained JSON decoding (Grammars) instead of regex string parsing. |
| **Infinite Feedback Loop** | The model repeats the exact same failing tool call with identical arguments. | Cycle detection in memory state: terminate loop if action signature repeats 3x. |
| **Context Window Bloat** | Each tool observation adds 1,000+ tokens, rapidly exhausting context limits. | Summarize or truncate large observation outputs before appending to the scratchpad. |
| **Cascading Error Propagation**| An early hallucinated thought causes subsequent actions to drift off-track. | Implement intermediate reflection or verification steps before irreversible writes. |

---

### 3. Production ReAct Execution Engine in Python

\`\`\`python
from typing import Dict, Any, Callable

class ReActAgent:
    def __init__(self, llm_client, tools: Dict[str, Callable]):
        self.llm = llm_client
        self.tools = tools
        self.max_steps = 5

    async def run(self, query: str) -> str:
        scratchpad = f"User Query: {query}\\n"

        for step in range(self.max_steps):
            prompt = f"{scratchpad}\\nThink step-by-step. Output in format:\\nThought: <reasoning>\\nAction: <tool_name>[<args>] OR Final Answer: <response>"
            response = await self.llm.generate(prompt)
            scratchpad += f"\\n{response}"

            if "Final Answer:" in response:
                return response.split("Final Answer:")[1].strip()

            # Parse action and execute tool
            action, args = self._parse_action(response)
            if action in self.tools:
                try:
                    observation = await self.tools[action](args)
                except Exception as err:
                    observation = f"Error executing {action}: {str(err)}"
            else:
                observation = f"Tool {action} does not exist."

            scratchpad += f"\\nObservation: {observation}"

        return "Agent reached maximum step limit without resolving query."
\`\`\``
  },
  {
    number: 22,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Structured Outputs & Function Calling: Constrained Decoding (CFG Grammars) vs. Pydantic",
    content: `### 1. The Challenge of Unconstrained Generation

When integrating LLMs into software pipelines (e.g., triggering a database write or calling a payment gateway), the model's output must adhere strictly to a deterministic schema (JSON, Protocol Buffers, SQL).
- **Prompt Engineering ("Output valid JSON")**: Fragile. Models frequently add markdown backticks (\`\`\`json\`), trailing commas, or explanatory preamble text.
- **Retry Loops**: Incurs latency and cost penalties when regenerating failing payloads.

---

### 2. Constrained Decoding via Context-Free Grammars (CFG)

Modern production frameworks (OpenAI Structured Outputs, Outlines, llama.cpp, Guidance) enforce JSON schemas at the **token generation level**:

\`\`\`
                        Next Token Logits from Transformer
                                        │
                                        ▼
                  ┌───────────────────────────────────────────┐
                  │   CFG Grammar Mask (JSON Schema DFA)      │
                  │   • Disallow all tokens that violate      │
                  │     valid JSON schema syntax              │
                  │   • Set forbidden token logits to -inf    │
                  └─────────────────────┬─────────────────────┘
                                        │
                                        ▼
                   100% Mathematically Guaranteed Valid JSON
\`\`\`

---

### 3. Production Pydantic & Instructor Implementation

\`\`\`python
from pydantic import BaseModel, Field
from typing import List, Optional

class CustomerSupportTicket(BaseModel):
    ticket_id: str = Field(description="Unique UUID string")
    urgency_level: str = Field(description="Must be LOW, MEDIUM, or CRITICAL")
    category: str = Field(description="Billing, Bug, Feature, or Security")
    action_items: List[str] = Field(description="Concrete bullet points to resolve")
    sentiment_score: float = Field(ge=-1.0, le=1.0, description="Sentiment between -1 and 1")

# With OpenAI Structured Outputs (json_schema enforcement)
completion = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract structured ticket metadata."},
        {"role": "user", "content": "The production database is down and charging users twice!"}
    ],
    response_format=CustomerSupportTicket,
)

ticket: CustomerSupportTicket = completion.choices[0].message.parsed
assert ticket.urgency_level == "CRITICAL"
\`\`\``
  },
  {
    number: 23,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Model Context Protocol (MCP): Client-Host-Server Architecture & Dynamic Tool Discovery",
    content: `### 1. What is the Model Context Protocol (MCP)?

Created by Anthropic and established as an open standard, the **Model Context Protocol (MCP)** provides a universal, open standard for connecting AI assistants and agents to external data sources, business tools, and developer environments.
Prior to MCP, every LLM provider and tool developer wrote custom, proprietary plugins (OpenAI Plugins, LangChain custom tools, Claude artifacts).

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        MCP Architecture                                │
└────────────────────────────────────────────────────────────────────────┘
  Host Application (Claude Desktop, IDE, Agent Framework)
        │
        ├── Client (Manages protocol lifecycle, auth, & tool routing)
        │      │
        │      ├─► Transport (stdio / SSE / WebSocket)
        │      │
        ▼      ▼
  MCP Servers (Isolated Processes / Microservices)
  ┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
  │ GitHub MCP Server │    │ Postgres Server   │    │ FileSystem Server │
  │ Tools: PRs, Issues│    │ Tools: Run Query  │    │ Tools: Read, Edit │
  └───────────────────┘    └───────────────────┘    └───────────────────┘
\`\`\`

---

### 2. Core Primitives of the Protocol

| Primitive | Initiator | Purpose | Example |
| :--- | :--- | :--- | :--- |
| **Tools** | Model-controlled | Executable functions that cause external side-effects or fetch data. | \`query_sales_db(sql)\`, \`create_jira_issue()\` |
| **Resources** | Application-controlled | File-like read-only data that provide context to the model. | \`postgres://db/schema\`, \`file:///docs/spec.md\` |
| **Prompts** | User-controlled | Pre-defined, interactive prompt templates surfaced in the UI. | \`debug_incident_template\`, \`code_review_prompt\` |

---

### 3. Writing an Enterprise MCP Tool in TypeScript

\`\`\`typescript
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server({ name: 'enterprise-ops', version: '1.0.0' }, { capabilities: { tools: {} } });

// Register available tools
server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'get_service_health',
      description: 'Checks Kubernetes cluster health and active incident count',
      inputSchema: {
        type: 'object',
        properties: { serviceName: { type: 'string' } },
        required: ['serviceName']
      }
    }
  ]
}));

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === 'get_service_health') {
    const { serviceName } = request.params.arguments as { serviceName: string };
    return { content: [{ type: 'text', text: JSON.stringify({ service: serviceName, status: 'healthy', replicas: 5 }) }] };
  }
  throw new Error('Tool not found');
});

const transport = new StdioServerTransport();
await server.connect(transport);
\`\`\``
  },
  {
    number: 24,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Multi-Agent Orchestration & State Machines: LangGraph vs. CrewAI & Cyclical Execution",
    content: `### 1. Directed Acyclic Graphs (DAGs) vs. Cyclical State Machines

Early agent frameworks (LangChain chains, AutoGPT) ran simple linear DAGs. Real-world enterprise workflows are inherently **cyclical**:
- Write code $\\rightarrow$ Run test $\\rightarrow$ Test fails $\\rightarrow$ Loop back to fix code $\\rightarrow$ Re-test $\\rightarrow$ Pass $\\rightarrow$ Deploy.

\`\`\`
                ┌──────────────────────────────────────────────┐
                │        LangGraph Cyclical State Machine      │
                └──────────────────────┬───────────────────────┘
                                       │
                                       ▼
                              [ Architect Node ]
                                       │
                                       ▼
                               [ Developer Node ] ◄────────┐
                                       │                   │
                                       ▼                   │ (Iterative fix)
                              [ Code Tester Node ] ────────┘
                                       │
                         Did all unit tests pass?
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
                  YES: [ Deployer ]             NO: Max Retries?
\`\`\`

---

### 2. Framework Comparison: LangGraph vs. CrewAI

| Dimension | LangGraph | CrewAI |
| :--- | :--- | :--- |
| **Core Abstraction** | Stateful Graph (Nodes = functions, Edges = conditional routing) | Role-playing Agents with assigned Tasks and Crews |
| **Control Granularity** | Low-level, deterministic, complete state control | High-level, persona-driven, autonomous delegation |
| **State Persistence** | First-class checkpointers (PostgreSQL, Redis, SQLite) | In-memory task context |
| **Human-in-the-Loop** | Native interrupt and resume tokens at any graph node | Custom hook callbacks |
| **Best Used In** | Production enterprise systems with strict governance | Rapid prototyping, exploratory content generation |

---

### 3. Production Cyclical Graph Pattern in LangGraph

\`\`\`python
from typing import TypedDict, Annotated
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    code: str
    test_output: str
    attempts: int

def developer_node(state: AgentState) -> AgentState:
    # LLM writes or fixes code based on test_output
    return {"code": "def solve(): return 42", "attempts": state["attempts"] + 1}

def tester_node(state: AgentState) -> AgentState:
    # Run test suite in sandbox
    passed = state["attempts"] >= 2 # Simulating test pass on attempt 2
    return {"test_output": "PASSED" if passed else "AssertionError: expected 42"}

def should_continue(state: AgentState) -> str:
    if state["test_output"] == "PASSED":
        return END
    if state["attempts"] >= 3:
        return END # Give up
    return "developer"

workflow = StateGraph(AgentState)
workflow.add_node("developer", developer_node)
workflow.add_node("tester", tester_node)
workflow.set_entry_point("developer")
workflow.add_edge("developer", "tester")
workflow.add_conditional_edges("tester", should_continue)
app = workflow.compile()
\`\`\``
  },
  {
    number: 25,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Plan-and-Solve / Least-to-Most Prompting: Decoupling Planning from Execution",
    content: `### 1. Why Reactive Agents Stumble on Complex Tasks

Standard ReAct agents decide their next action greedily at each step. On complex, multi-stage workflows (e.g., *"Migrate this database schema, refactor the ORM models, update test suites, and generate a changelog"*), greedy step-by-step agents suffer from:
- **Myopic Planning**: Getting stuck in rabbit holes.
- **Lost Sight of the North Star**: Forgetting the high-level objective after 10 sub-tool calls.
- **Cascading Cost**: Exploring dead-end tool paths.

---

### 2. Plan-and-Solve Architecture

Pioneered by Wang et al., **Plan-and-Solve** decouples strategy from execution:

\`\`\`
   User Request: "Conduct security audit and refactor authentication service"
                         │
                         ▼
             [ Planner LLM (High Reasoning) ]
             Generates static, DAG-based plan:
             1. Fetch current auth middleware
             2. Inspect JWT signature algorithm
             3. Replace HS256 with RS256 / EdDSA
             4. Verify unit tests pass
                         │
                         ▼
             [ Plan Executor Engine ]
             Executes steps sequentially; updates status:
             [✓ Step 1] ──► [✓ Step 2] ──► [In Progress Step 3] ──► [Pending Step 4]
                         │
                         ▼ (If execution fails)
             [ Re-Planning Loop: Modify remaining steps without restarting ]
\`\`\`

---

### 3. Production Benefits
1. **Explainability**: The user inspects the proposed execution plan *before* any state-changing actions execute.
2. **Deterministic Checkpointing**: If Step 3 fails, the system retries Step 3 rather than restarting from Step 1.
3. **Model Tiering**: Use an expensive reasoning model (e.g., Claude 3.5 Sonnet / o1) for the **Planner**, and a fast, cheap model (e.g., Haiku / Flash) for the **Executor**.`
  },
  {
    number: 26,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Agent Memory Architecture: Short-Term Scratchpads, Semantic Long-Term & Episodic Memory",
    content: `### 1. The Multi-Tiered Memory Hierarchy for AI Agents

Human cognitive systems maintain sensory memory, working memory, and long-term memory. Enterprise AI agents adopt a parallel multi-tiered memory architecture:

\`\`\`
┌────────────────────────────────────────────────────────────────────────┐
│                        Agent Memory Hierarchy                          │
└────────────────────────────────────────────────────────────────────────┘
  1. Working Memory (Ephemeral Scratchpad)
     • Current prompt, active thought-action loop, immediate tool output.
     • Stored in active context window; discarded upon task completion.
        │
        ├── Syncs key entities & state changes
        ▼
  2. Episodic Memory (Experience & History)
     • Past user interaction logs, previous task outcomes, error post-mortems.
     • Stored in relational / document DB (PostgreSQL, MongoDB).
        │
        ├── Embeds semantic concepts
        ▼
  3. Semantic Long-Term Memory (Knowledge Base)
     • Vector database (Pinecone, Qdrant) storing user preferences, corporate rules,
       and historical solutions across months of interactions.
\`\`\`

---

### 2. Memory Tier Comparison

| Memory Tier | Storage Medium | Eviction Policy | Latency | Example Stored Data |
| :--- | :--- | :--- | :--- | :--- |
| **Working (Short-Term)** | LLM Context Window (RAM) | Cleared at end of session / FIFO | 0ms | Current sub-task tool outputs, active code snippet |
| **Episodic** | Relational DB (Postgres/Redis) | LRU or time-based TTL | < 10ms | *"User rejected PR #42 yesterday due to missing unit tests"* |
| **Semantic (Long-Term)** | Vector Store + Embeddings | Cosine similarity top-$K$ lookup | 20–50ms | *"User prefers TypeScript over JavaScript and strict null checks"* |

---

### 3. Production Entity Extraction for Memory Updates

\`\`\`python
async def extract_and_store_user_preferences(llm, user_chat: str, memory_db):
    prompt = f"""Extract any durable user preferences, tech stack constraints, or 
architectural rules stated in this chat. Output JSON array of strings only.
Chat: {user_chat}"""

    facts = await llm.generate_json(prompt)
    for fact in facts:
        # Upsert into semantic vector store for future session recall
        embedding = await embed_text(fact)
        await memory_db.upsert(vector=embedding, metadata={"fact": fact, "user_id": "usr_123"})
\`\`\``
  },
  {
    number: 27,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Tool Execution Resilience: Timeout Budgets, Exponential Backoff & Circuit Breakers",
    content: `### 1. Flaky Real-World Tooling in Autonomous Agents

When autonomous agents interact with external tools (GitHub API, Slack webhooks, Cloud APIs, databases), tools will inevitably fail:
- Rate limiting (\`HTTP 429 Too Many Requests\`).
- Transient 5xx server gateway errors.
- Network timeouts and hangs.

If an agent has no error resilience, an uncaught API timeout either crashes the entire agent loop or causes the LLM to hallucinate that the operation succeeded!

---

### 2. The Agent Circuit Breaker Pattern

\`\`\`
   [ Tool Call Request ]
             │
             ▼
      [ Circuit State ]
      ┌────────────────────────────────────────────────────────┐
      │ CLOSED (Normal): Pass through to external API          │
      │ OPEN (Tripped): Fail fast! Return synthetic fallback   │
      │ HALF-OPEN: Send canary test probe to verify recovery   │
      └────────────────────────────────────────────────────────┘
\`\`\`

---

### 3. Resilient Tool Execution Implementation in Python

\`\`\`python
import asyncio
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

class ToolTimeoutError(Exception): pass

class ResilientToolWrapper:
    def __init__(self, tool_func, timeout_seconds: float = 10.0):
        self.tool_func = tool_func
        self.timeout_seconds = timeout_seconds

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        retry=retry_if_exception_type((TimeoutError, ConnectionError))
    )
    async def execute(self, *args, **kwargs):
        try:
            return await asyncio.wait_for(
                self.tool_func(*args, **kwargs), 
                timeout=self.timeout_seconds
            )
        except asyncio.TimeoutError:
            raise ToolTimeoutError(f"Tool execution timed out after {self.timeout_seconds}s")

# In agent scratchpad: Return clean error message so the LLM can self-correct!
async def safe_agent_tool_caller(tool_wrapper, *args):
    try:
        return await tool_wrapper.execute(*args)
    except Exception as e:
        return f"Tool Execution Failed: {str(e)}. Try an alternative approach."
\`\`\``
  },
  {
    number: 28,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Human-in-the-Loop (HITL) Workflows: Checkpoints, State Serialization & Resumption Tokens",
    content: `### 1. Why Full Autonomy is Dangerous in Production

Autonomous agents must not execute destructive actions without human authorization:
- Dropping production database tables or running schema migrations.
- Executing financial payments or fund transfers.
- Sending external customer-facing emails.
- Merging PRs to main production branches.

A **Human-in-the-Loop (HITL)** architecture pauses agent execution, serializes state, alerts a human operator, and waits for cryptographic approval before proceeding.

\`\`\`
   Agent Plan ──► Step 1 (Read Repo) ──► Step 2 (Run Tests) ──► Step 3: [DROP DATABASE]
                                                                        │
                                                         ┌──────────────┴──────────────┐
                                                         ▼                             ▼
                                                [ Pause & Checkpoint ]        [ Send Slack Alert ]
                                                State saved to DB             "Approve / Reject?"
                                                         │                             │
                                                         ▼                             ▼
                                                Wait for Webhook ◄────────── Human Clicks "APPROVE"
                                                         │
                                                         ▼
                                                Resume Execution from exact checkpoint!
\`\`\`

---

### 2. State Checkpointing & Resumption Architecture

\`\`\`python
from langgraph.checkpoint.sqlite import SqliteSaver
from langgraph.graph import StateGraph

# LangGraph native interrupt pattern
def critical_action_node(state):
    # This node triggers an interrupt before irreversible execution
    return {"status": "Database migration executed."}

memory = SqliteSaver.from_conn_string(":memory:")
workflow = StateGraph(...)
# Interrupt the graph immediately BEFORE executing critical_action
app = workflow.compile(checkpointer=memory, interrupt_before=["critical_action"])

# 1. Run until human approval required
config = {"configurable": {"thread_id": "thread-42"}}
for event in app.stream({"input": "Upgrade database schema"}, config):
    print(event) # Pauses before critical_action

# 2. Human reviews state, approves, and resumes execution
app.stream(None, config) # Resumes seamlessly from saved thread_id!
\`\`\``
  },
  {
    number: 29,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Autonomous Agent Guardrails: Runaway Loop Prevention, Quotas & Recursion Limits",
    content: `### 1. The Multi-Thousand Dollar Runaway Loop Incident

Without strict safeguards, autonomous agents can enter runaway loops:
- An agent encounters an unexpected error and attempts 10,000 continuous retries overnight.
- Two collaborating agents get stuck in recursive conversational ping-pong.
- An agent loops continuously over a 5,000-file directory, burning hundreds of dollars in API tokens per hour.

---

### 2. Enterprise Safeguard Layers

\`\`\`
                              Agent Request
                                    │
    ┌───────────────────────────────┴───────────────────────────────┐
    ▼                               ▼                               ▼
[ Max Step Guard ]          [ Cost Budget Guard ]         [ Loop Cycle Detector ]
Max 15 iterations / task    Max $2.00 token spend / task  Identifies repetitive
Hard termination on breach  Hard termination on breach    action signatures
\`\`\`

---

### 3. Production Multi-Layer Guardrail Implementation

\`\`\`python
class AgentBudgetGuard:
    def __init__(self, max_steps: int = 15, max_cost_usd: float = 2.00):
        self.max_steps = max_steps
        self.max_cost_usd = max_cost_usd
        self.current_steps = 0
        self.current_cost_usd = 0.0
        self.action_history = []

    def record_step(self, action_signature: str, token_cost_usd: float):
        self.current_steps += 1
        self.current_cost_usd += token_cost_usd
        self.action_history.append(action_signature)

        # 1. Step Quota Check
        if self.current_steps > self.max_steps:
            raise RuntimeError(f"Terminated: Exceeded maximum allowed step limit ({self.max_steps}).")

        # 2. Budget Quota Check
        if self.current_cost_usd > self.max_cost_usd:
            raise RuntimeError(f"Terminated: Exceeded financial cost budget (\${self.max_cost_usd:.2f}).")

        # 3. Cycle Detection: Check if the last 3 actions are identical
        if len(self.action_history) >= 3 and len(set(self.action_history[-3:])) == 1:
            raise RuntimeError("Terminated: Detected infinite cyclic tool invocation loop.")
\`\`\``
  },
  {
    number: 30,
    part: "Part 3: Agentic Workflows, Function Calling & MCP",
    title: "Code Execution Sandboxes for Coding Agents: gVisor, Firecracker & Docker Isolation",
    content: `### 1. The Danger of Local Code Execution

Coding agents (Claude Engineer, SWE-bench agents, OpenCodeInterpreter) routinely generate and execute shell commands and Python code.
**Executing untrusted LLM-generated code directly on host servers or developer laptops is a critical security vulnerability**:
- Malicious prompt injections can execute \`rm -rf /\`, exfiltrate \`~/.ssh/id_rsa\` keys, or install cryptominers.
- Accidental bugs can launch local fork-bombs or saturate network ports.

---

### 2. Isolation Technologies Comparison

| Technology | Startup Latency | Isolation Boundary | Resource Overhead | Production Example |
| :--- | :--- | :--- | :--- | :--- |
| **Standard Docker Container** | ~1 second | Shared Linux Kernel (namespaces/cgroups) | Very Low | Vulnerable to kernel privilege escalation CVEs |
| **gVisor (Google)** | ~100–200 ms | User-space virtualized kernel intercepting syscalls | Low | **Google Cloud Run**, production agent code runners |
| **Firecracker MicroVMs (AWS)**| ~5–20 ms | Hardware-level KVM virtualization per sandbox | Extremely Low | **AWS Lambda**, **Modal**, **Fly.io** |
| **WebAssembly (WASM)** | < 1 ms | Memory-safe bytecode runtime | Minimal | Client-side or edge compute (limited language support) |

---

### 3. Production MicroVM Sandbox Architecture

\`\`\`
   Agent Host (Untrusted LLM Output)
             │
             ├── Sends code payload: "import os; os.system('cat /etc/passwd')"
             │
             ▼
   [ Firecracker MicroVM / gVisor Sandbox ]
   ┌────────────────────────────────────────────────────────┐
   │ • Ephemeral Guest Kernel (KVM / Isolated System Calls) │
   │ • Network: Egress blocked to internal 10.0.0.0/8 VPC   │
   │ • Filesystem: Copy-on-Write tmpfs (destroyed on exit)  │
   │ • CPU / RAM Quotas: Max 1 Core, 512 MB                 │
   │ • Wall-Clock Timeout: 5.0 seconds                      │
   └────────────────────────────────────────────────────────┘
             │
             ▼
      Returns stdout/stderr safely to Agent without host exposure
\`\`\``
  }
];

