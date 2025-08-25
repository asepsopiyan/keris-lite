export const cfg = {
  provider: process.env.LLM_PROVIDER || "ollama",
  ollama: {
    baseURL: process.env.OLLAMA_BASE_URL || "http://localhost:11434",
    chatModel: process.env.OLLAMA_CHAT_MODEL || "qwen2.5:7b-instruct",
    embedModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text",
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    chatModel: process.env.GEMINI_CHAT_MODEL || "gemini-1.5-flash",
    embedModel: process.env.GEMINI_EMBED_MODEL || "text-embedding-004",
  },
  qdrant: {
    url: process.env.QDRANT_URL || "http://localhost:6333",
    collection: process.env.QDRANT_COLLECTION || "keris_docs",
  },
};
