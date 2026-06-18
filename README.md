# DocAgent
# AI-Powered Document Q&A Assistant

## System Architecture Diagram

```text
┌─────────────────────┐
│ React Frontend      │
│ React Query         │
│ Zustand             │
└──────────┬──────────┘
           │ HTTPS
           ▼
┌─────────────────────┐
│ Express API         │
│ JWT Auth            │
│ Swagger             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ LangGraph Agent     │
└───────┬─────┬───────┘
        │     │
        ▼     ▼
   Tool Calls RAG
              │
              ▼
      pgvector Search
              │
              ▼
         PostgreSQL

Redis
 │
 ├─ BullMQ
 ├─ Cache
 └─ Queue State
```
## End-to-End RAG Flow

```text
PDF Upload
    │
    ▼
BullMQ Queue
    │
    ▼
Document Worker
    │
    ▼
PDF Parsing
    │
    ▼
Chunking
    │
    ▼
OpenAI Embeddings
    │
    ▼
pgvector Storage
    │
    ▼
READY
```

## Question Answering Flow

```text
User Question
      │
      ▼
Conversation Saved
      │
      ▼
LangGraph Agent
      │
      ▼
searchDocument Tool
      │
      ▼
Vector Similarity Search
      │
      ▼
Relevant Chunks
      │
      ▼
GPT-4o Mini
      │
      ▼
SSE Token Stream
      │
      ▼
Frontend Rendering
      │
      ▼
Assistant Message Saved
```

## Agent Workflow

```text
START
  │
  ▼
Analyze Question
  │
  ▼
Need Tool?
 ├──────── No ───────► Generate Answer
 │
 Yes
 │
 ▼
Execute Tool
 │
 ▼
Observe Result
 │
 ▼
Reason Again
 │
 ▼
Generate Answer
 │
 ▼
END
```

## Tool Calling Flow

```text
User Prompt
    │
    ▼
OpenAI Tool Calling
    │
    ├── searchDocument()
    │
    ├── summarizeDocument()
    │
    ├── getConversationHistory()
    │
    └── listUserDocuments()
    │
    ▼
Tool Result
    │
    ▼
LLM Final Response
```
## Database ER Diagram

```text
User
 ├── Document
 │      └── DocumentChunk
 │
 ├── Conversation
 │      └── Message
 │
 ├── RefreshToken
 │
 └── AuditLog
```

## Deployment Diagram

```text
            GitHub
               │
               ▼
      GitHub Actions CI
               │
      ┌────────┴────────┐
      ▼                 ▼
 Railway Backend     Vercel Frontend
      │                 │
      ▼                 ▼
 PostgreSQL         React App
      │
      ▼
 pgvector

 Redis
   │
   ├─ BullMQ
   └─ Cache
```

## SSE Streaming Flow

```text
Frontend
   │
POST /chat/stream
   │
   ▼
Express SSE Endpoint
   │
   ▼
OpenAI Stream
   │
   ▼
Token Chunks
   │
   ▼
res.write()
   │
   ▼
Browser ReadableStream
   │
   ▼
Live UI Update
```
