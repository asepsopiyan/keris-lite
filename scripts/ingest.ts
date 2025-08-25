#!/usr/bin/env tsx
import fs from 'node:fs';
import path from 'node:path';
import pdf from 'pdf-parse';
import crypto from 'node:crypto';
import { embed } from '../src/lib/llm';
import { ensureCollection, upsert } from '../src/lib/vector';

const RAW = path.join(process.cwd(), 'data', 'raw');

function chunk(text: string, size = 800, overlap = 120) {
    const out: string[] = [];
    for (let i = 0; i < text.length; i += size - overlap) {
        out.push(text.slice(i, i + size));
    }
    return out.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
}

export async function ingestFile(file: string) {
    const buf = fs.readFileSync(file);
    const text = file.endsWith('.pdf')
        ? (await pdf(buf)).text
        : buf.toString('utf8');
    const chunks = chunk(text);

    // Enhanced: Generate individual embeddings for each chunk
    console.log(
        `Processing ${chunks.length} chunks for ${path.basename(file)}...`
    );
    const vectors = await embed(chunks);

    // Ensure collection exists before upserting
    await ensureCollection(vectors[0].length);

    // Prepare chunks with individual vectors
    const chunksWithVectors = chunks.map((t, i) => ({
        id: crypto
            .createHash('md5')
            .update(file + ':' + i)
            .digest('hex'),
        text: t,
        vector: vectors[i], // Fixed: Use individual vector for each chunk
        meta: { file: path.basename(file), idx: i, chunk_size: t.length },
    }));

    // Debug: Check vectors
    console.log(`Vector dimensions: ${vectors[0]?.length || 'undefined'}`);
    console.log(
        `First vector sample: ${vectors[0]?.slice(0, 3).join(', ')}...`
    );
    console.log(
        `Chunks to upsert:`,
        chunksWithVectors.map((c) => ({
            id: c.id,
            vectorLength: c.vector?.length,
        }))
    );

    console.log(`Upserting ${chunksWithVectors.length} chunks...`);
    await upsert(chunksWithVectors);

    console.log(
        `✅ Indexed ${chunks.length} chunks with individual embeddings`
    );
}

(async () => {
    const files = fs.readdirSync(RAW).filter((f) => /\.(pdf|txt)$/i.test(f));
    console.log(`Found ${files.length} files to process...`);

    for (const f of files) {
        console.log(`\n📄 Processing: ${f}`);
        await ingestFile(path.join(RAW, f));
    }

    console.log('\n🎉 All files processed successfully!');
    console.log(
        '💡 Enhanced chunking with per-chunk embeddings is now active!'
    );
})();
