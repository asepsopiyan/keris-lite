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

export async function search(
    vector: number[],
    limit = 5,
    scoreThreshold = 0.7,
    filters?: Record<string, unknown>
) {
    const searchParams = {
        vector,
        limit: limit * 2, // Get more results for filtering
        with_payload: true,
        with_vectors: false,
        score_threshold: scoreThreshold,
    };

    // Add filters if provided
    if (filters && Object.keys(filters).length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (searchParams as any).filter = {
            must: Object.entries(filters).map(([key, value]) => ({
                key,
                match: { value },
            })),
        };
    }

    const results = await client.search(cfg.qdrant.collection, searchParams);

    // Enhanced: Sort by score and apply additional filtering
    const filteredResults = results
        .filter((result) => result.score && result.score > scoreThreshold)
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, limit);

    return filteredResults;
}

// Enhanced: Get collection statistics
export async function getCollectionStats() {
    try {
        const info = await client.getCollection(cfg.qdrant.collection);
        return {
            name: cfg.qdrant.collection,
            vectorCount: info.vectors_count,
            pointsCount: info.points_count,
            status: info.status,
        };
    } catch (error) {
        console.error('Error getting collection stats:', error);
        return null;
    }
}

// Enhanced: Delete collection for re-indexing
export async function deleteCollection() {
    try {
        await client.deleteCollection(cfg.qdrant.collection);
        console.log(`Collection ${cfg.qdrant.collection} deleted successfully`);
        return true;
    } catch (error) {
        console.error('Error deleting collection:', error);
        return false;
    }
}
