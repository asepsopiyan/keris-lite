Write-Host "Starting KERIS-lite system..." -ForegroundColor Green
Write-Host ""

Write-Host "1. Starting Docker containers..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "2. Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "3. Pulling Ollama models (this may take a while on first run)..." -ForegroundColor Yellow
docker exec -it ollama ollama pull qwen2.5:7b-instruct
docker exec -it ollama ollama pull nomic-embed-text

Write-Host ""
Write-Host "4. Starting Next.js development server..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Cyan
Write-Host ""
pnpm dev
