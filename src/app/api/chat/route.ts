import { NextRequest, NextResponse } from 'next/server';
import { embed, chat } from '@/lib/llm';
import { search } from '@/lib/vector';

export async function POST(req: NextRequest) {
    const { question } = await req.json();

    // Enhanced: Generate question embedding
    const [qv] = await embed([question]);

    // Enhanced: Search with better scoring and filtering
    const hits = await search(qv, 5, 0.6); // Lower threshold for more relevant results

    if (hits.length === 0) {
        return NextResponse.json({
            answer: 'Maaf, saya tidak dapat menemukan informasi yang relevan untuk pertanyaan Anda. Silakan coba dengan pertanyaan yang berbeda atau pastikan dokumen sudah di-index.',
            refs: [],
        });
    }

    // Enhanced: Better context formatting with scores
    const context = hits
        .map(
            (h, i) =>
                `[#${i + 1}] Score: ${(h.score || 0).toFixed(3)}\n${
                    (h.payload as Record<string, unknown>)?.text || ''
                }`
        )
        .join('\n\n');

    // Enhanced: Better prompt engineering
    const answer = await chat([
        {
            role: 'user',
            content: `Kamu adalah asisten AI yang ahli dalam menganalisis dokumen. Gunakan konteks berikut untuk menjawab pertanyaan dengan akurat dan relevan.

KONTEXT (dengan score relevansi):
${context}

PERTANYAAN: ${question}

INSTRUKSI:
1. Jawab berdasarkan konteks yang diberikan
2. Jika informasi tidak cukup, katakan dengan jujur
3. Berikan jawaban yang ringkas dan jelas dalam Bahasa Indonesia
4. Gunakan score relevansi untuk memprioritaskan informasi

JAWABAN:`,
        },
    ]);

    return NextResponse.json({
        answer,
        refs: hits.map((h) => ({
            file:
                ((h.payload as Record<string, unknown>)?.file as string) || '',
            idx: ((h.payload as Record<string, unknown>)?.idx as number) || 0,
            score: h.score || 0,
            chunk_size:
                ((h.payload as Record<string, unknown>)
                    ?.chunk_size as number) || 0,
        })),
        search_metadata: {
            total_results: hits.length,
            avg_score:
                hits.reduce((sum, h) => sum + (h.score || 0), 0) / hits.length,
            top_score: Math.max(...hits.map((h) => h.score || 0)),
        },
    });
}
