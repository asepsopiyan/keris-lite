@echo off
echo Starting KERIS-lite system...
echo.

echo 1. Starting Docker containers...
docker-compose up -d

echo.
echo 2. Waiting for services to be ready...
timeout /t 10 /nobreak >nul

echo.
echo 3. Pulling Ollama models (this may take a while on first run)...
docker exec -it ollama ollama pull qwen2.5:7b-instruct
docker exec -it ollama ollama pull nomic-embed-text

echo.
echo 4. Starting Next.js development server...
echo Press Ctrl+C to stop the server
echo.
pnpm dev
