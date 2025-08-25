# KERIS-lite Test Setup Guide

## Prerequisites Check

Before running the system, ensure you have:

1. **Node.js ≥ 20** - Check with: `node --version`
2. **pnpm** - Check with: `pnpm --version`
3. **Docker** - Check with: `docker --version`
4. **Docker Compose** - Check with: `docker-compose --version`

## Step-by-Step Testing

### 1. Start Dependencies

```bash
# Start Qdrant and Ollama containers
docker-compose up -d

# Wait for services to be ready (check ports)
netstat -an | findstr "6333"  # Qdrant should be listening
netstat -an | findstr "11434" # Ollama should be listening
```

### 2. Pull Ollama Models

```bash
# Pull required models (first time only)
docker exec -it ollama ollama pull qwen2.5:7b-instruct
docker exec -it ollama ollama pull nomic-embed-text
```

### 3. Test Document Ingestion

```bash
# Run the ingest script
pnpm ingest

# Expected output:
# ingest: sample.txt
# done.
```

### 4. Start the Application

```bash
# Start Next.js development server
pnpm dev
```

### 5. Test the Web Interface

1. Open http://localhost:3000
2. You should see "KERIS‑lite (lokal)" title
3. Type a question like "Apa itu KERIS?" in the input field
4. Click "Tanya" button
5. Wait for response (may take 10-30 seconds with Ollama)

## Expected Results

### Successful Setup

-   ✅ Docker containers running (Qdrant on 6333, Ollama on 11434)
-   ✅ Models downloaded successfully
-   ✅ Document ingestion completes without errors
-   ✅ Web interface loads at localhost:3000
-   ✅ Chat API responds with relevant answers

### Common Issues & Solutions

#### Issue: Docker containers not starting

```bash
# Check Docker status
docker ps
# Restart if needed
docker-compose down && docker-compose up -d
```

#### Issue: Ollama models not found

```bash
# Check available models
docker exec -it ollama ollama list
# Pull missing models
docker exec -it ollama ollama pull qwen2.5:7b-instruct
```

#### Issue: Qdrant connection error

```bash
# Check Qdrant health
curl http://localhost:6333/health
# Restart container if needed
docker restart qdrant
```

#### Issue: Build errors

```bash
# Clean and rebuild
rm -rf .next
pnpm build
```

## Performance Expectations

-   **First run**: 2-5 minutes (model downloads)
-   **Subsequent runs**: 30 seconds to start
-   **Query response**: 10-30 seconds (Ollama), 2-5 seconds (Gemini)
-   **Memory usage**: ~4-8GB RAM (Ollama models)

## Next Steps

After successful testing:

1. **Add more documents** to `data/raw/` folder
2. **Test with PDF files** (ensure they're text-searchable)
3. **Experiment with different questions** to test RAG accuracy
4. **Consider switching to Gemini** for faster responses (requires API key)

## Troubleshooting

If you encounter issues:

1. Check the browser console for JavaScript errors
2. Check the terminal for build/run errors
3. Verify all services are running: `docker ps`
4. Check logs: `docker logs qdrant` or `docker logs ollama`
5. Ensure ports 3000, 6333, and 11434 are available
