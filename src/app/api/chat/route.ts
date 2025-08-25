import { NextRequest, NextResponse } from 'next/server';
import { embed, chat } from '@/lib/llm';
import { search } from '@/lib/vector';

export async function POST(req: NextRequest) {
    const { question } = await req.json();
    const [qv] = await embed([question]);
    const hits = await search(qv, 5);
    const context = hits
        .map(
            (h, i) =>
                `[#${i + 1}] ${
                    (h.payload as Record<string, unknown>)?.text || ''
                }`
        )
        .join('\n\n');

    const answer = await chat([
        {
            role: 'user',
            content: `Kamu adalah asisten untuk tanya-jawab dokumen. Gunakan konteks berikut se-selektif mungkin.\n\nKONTEXT:\n${context}\n\nPERTANYAAN: ${question}\n\nJawab ringkas dalam Bahasa Indonesia.`,
        },
    ]);

    return NextResponse.json({
        answer,
        refs: hits.map((h) => ({
            file:
                ((h.payload as Record<string, unknown>)?.file as string) || '',
            idx: ((h.payload as Record<string, unknown>)?.idx as number) || 0,
        })),
    });
}
