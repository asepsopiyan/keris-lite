import { QdrantClient } from '@qdrant/js-client-rest';
import { cfg } from './config';

const client = new QdrantClient({ url: cfg.qdrant.url });

export async function ensureCollection(dim: number) {
    const name = cfg.qdrant.collection;
    const exists = await client
        .getCollections()
        .then((res) => res.collections?.some((c) => c.name === name));
    if (!exists) {
        await client.createCollection(name, {
            vectors: { size: dim, distance: 'Cosine' },
        });
    }
}

export async function upsert(
    chunks: {
        id: string;
        text: string;
        vector: number[];
        meta?: Record<string, unknown>;
    }[]
) {
    await client.upsert(cfg.qdrant.collection, {
        wait: true,
        points: chunks.map((c) => ({
            id: c.id,
            vector: c.vector,
            payload: { text: c.text, ...c.meta },
        })),
    });
}

export async function search(vector: number[], limit = 5) {
    const r = await client.search(cfg.qdrant.collection, {
        vector,
        limit,
        with_payload: true,
    });
    return r;
}
