# KERIS-lite (Local-First)

A simple RAG (retrieve-and-generate) system that runs locally first, designed for easy migration to Huawei Cloud later.

## Architecture (Local)

-   **UI + API**: Next.js (App Router, TypeScript)
-   **Document Storage**: Local folder `./data/raw`
-   **Chunking + Embedding**: Ollama (default, on-device) or Gemini (optional, API)
-   **Vector Store**: Qdrant via Docker (1 container) — easy to swap to Milvus later

## Prerequisites

-   Node ≥ 20, pnpm
-   Docker Desktop / CLI

## Quick Start (10-15 minutes)

### 1. Setup Project

```bash
# Install dependencies
pnpm install

# Copy environment file
cp env.example .env.local
# Edit .env.local with your settings
```

### 2. Start Local Dependencies

#### Qdrant (Vector DB)

```bash
docker run -d --name qdrant -p 6333:6333 qdrant/qdrant:latest
```

#### Ollama (Optional, for full local setup)

```bash
docker run -d --name ollama -p 11434:11434 ollama/ollama:latest

# After container is up, pull models:
docker exec -it ollama ollama pull qwen2.5:7b-instruct
docker exec -it ollama ollama pull nomic-embed-text
```

### 3. Add Documents

Place your PDF/TXT files in the `data/raw/` folder.

### 4. Index Documents

```bash
pnpm tsx scripts/ingest.ts
```

### 5. Run Application

```bash
pnpm dev
```

Open http://localhost:3000 and start asking questions!

## Configuration

### Environment Variables

Copy `env.example` to `.env.local` and configure:

-   `LLM_PROVIDER`: Choose between `ollama` or `gemini`
-   `OLLAMA_*`: Ollama settings (default)
-   `GEMINI_*`: Gemini API settings
-   `QDRANT_*`: Qdrant connection settings

### LLM Providers

#### Ollama (Default)

-   Runs locally via Docker
-   Models: qwen2.5:7b-instruct, nomic-embed-text
-   No API key required

#### Gemini

-   Requires Google API key
-   Faster response times
-   Internet connection required

## Usage

1. **Add Documents**: Place PDF/TXT files in `data/raw/`
2. **Index**: Run `pnpm tsx scripts/ingest.ts`
3. **Query**: Use the web interface to ask questions
4. **Get Answers**: AI responds with context from your documents

## Project Structure

```
keris-lite/
├─ data/
│  └─ raw/                # Put your PDF/TXT files here
├─ src/
│  ├─ app/
│  │  ├─ api/
│  │  │  └─ chat/route.ts # Chat endpoint
│  │  └─ page.tsx         # Main UI
│  └─ lib/
│     ├─ config.ts        # Configuration
│     ├─ llm.ts           # LLM adapters
│     └─ vector.ts        # Qdrant helpers
├─ scripts/
│  └─ ingest.ts           # Document indexing CLI
└─ env.example            # Environment template
```

## Migration Roadmap → Huawei Cloud

### Phase 1: Local Development ✅

-   [x] Basic RAG functionality
-   [x] Local document storage
-   [x] Ollama + Qdrant integration

### Phase 2: Cloud Migration (Future)

-   **Storage**: `./data/raw` → OBS bucket
-   **Vector DB**: Qdrant Docker → CCE (or Milvus on CCE)
-   **LLM**: Ollama → ModelArts Studio / Pangu
-   **Deployment**: Next.js dev → CCE + CLB/WAF

### Phase 3: Production Features

-   Document upload via UI
-   Per-chunk embeddings (currently demo)
-   Reranking (BM25 + cosine)
-   Authentication & authorization
-   Monitoring & logging

## Development

### Adding Features

1. **Document Upload**: Create `src/app/api/ingest/route.ts`
2. **Better Embeddings**: Modify `scripts/ingest.ts` for per-chunk vectors
3. **Reranking**: Add BM25 scoring in `src/lib/vector.ts`

### Testing

-   Test with documents ≥ 5 pages
-   Verify answer accuracy and context usage
-   Check response times (< 2s for Gemini, variable for Ollama)

## Troubleshooting

### Common Issues

1. **Qdrant Connection Error**: Ensure Docker container is running
2. **Ollama Model Not Found**: Pull required models via Docker exec
3. **Embedding Errors**: Check API keys and model availability

### Debug Mode

Enable detailed logging by setting environment variables:

```bash
DEBUG=1
NODE_ENV=development
```

## License

MIT License - see LICENSE file for details.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Note**: This is a development version, not production-ready. Focus on functionality first, then refactor for production use.
