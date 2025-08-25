import { cfg } from './config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ——— Chat ———
export async function chat(
    messages: { role: 'user' | 'assistant'; content: string }[]
) {
    if (cfg.provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(cfg.gemini.apiKey!);
        const model = genAI.getGenerativeModel({ model: cfg.gemini.chatModel });
        const prompt = messages
            .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
            .join('\n');
        const r = await model.generateContent(prompt);
        return r.response.text();
    }
    // default: ollama
    const r = await fetch(`${cfg.ollama.baseURL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: cfg.ollama.chatModel,
            messages: messages.map((m) => ({
                role: m.role,
                content: m.content,
            })),
            stream: false,
        }),
    });
    const data = await r.json();
    return data.message?.content || '';
}

// ——— Embedding ———
export async function embed(texts: string[]): Promise<number[][]> {
    if (cfg.provider === 'gemini') {
        const genAI = new GoogleGenerativeAI(cfg.gemini.apiKey!);
        const model = genAI.getGenerativeModel({
            model: cfg.gemini.embedModel,
        });
        const embeddings = await Promise.all(
            texts.map(async (text) => {
                const result = await model.embedContent(text);
                return result.embedding.values;
            })
        );
        return embeddings;
    }
    // ollama embeddings - Enhanced: Generate individual embeddings for each text
    const embeddings = await Promise.all(
        texts.map(async (text) => {
            const r = await fetch(`${cfg.ollama.baseURL}/api/embeddings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: cfg.ollama.embedModel,
                    prompt: text,
                }),
            });
            const data = await r.json();
            return data.embedding;
        })
    );
    return embeddings;
}
