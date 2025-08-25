# 🚀 KERIS-lite Quick Start

## ⚡ Get Running in 5 Minutes

### 1. Start Services

```bash
# Start Qdrant and Ollama
docker-compose up -d
```

### 2. Pull Models (First Time Only)

```bash
# Download required AI models
docker exec -it ollama ollama pull qwen2.5:7b-instruct
docker exec -it ollama ollama pull nomic-embed-text
```

### 3. Index Documents

```bash
# Process documents in data/raw/
pnpm ingest
```

### 4. Start App

```bash
# Launch web interface
pnpm dev
```

### 5. Start Chatting! 🎉

Open http://localhost:3000 and ask questions about your documents.

---

## 📝 Example Questions

Try these to test the system:

-   "Apa itu KERIS?"
-   "Bagaimana cara kerja sistem RAG?"
-   "Teknologi apa yang digunakan?"

## 🔧 Troubleshooting

**Ports in use?** Check if 3000, 6333, or 11434 are available  
**Docker issues?** Run `docker ps` to check container status  
**Build errors?** Run `pnpm build` to verify compilation

## 📚 Full Documentation

-   `README.md` - Complete setup guide
-   `test-setup.md` - Detailed testing instructions
-   `PROJECT_SUMMARY.md` - Technical overview

---

**Status**: ✅ Ready to use!  
**Next**: Add more documents and start asking questions!
