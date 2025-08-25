#!/usr/bin/env tsx
import { deleteCollection, getCollectionStats } from '../src/lib/vector';
import { ingestFile } from './ingest';

const RAW = process.argv[2] || 'data/raw';

async function reindex() {
    console.log('🔄 Starting Enhanced Chunking Re-indexing Process...\n');

    try {
        // Check current collection status
        console.log('📊 Current Collection Status:');
        const stats = await getCollectionStats();
        if (stats) {
            console.log(`   Collection: ${stats.name}`);
            console.log(`   Vectors: ${stats.vectorCount || 0}`);
            console.log(`   Points: ${stats.pointsCount || 0}`);
            console.log(`   Status: ${stats.status}\n`);
        }

        // Confirm deletion
        console.log(
            '⚠️  This will delete the current collection and re-index all documents.'
        );
        console.log('   This process will:');
        console.log('   - Delete existing vectors');
        console.log('   - Re-process all documents with enhanced chunking');
        console.log('   - Generate individual embeddings for each chunk');
        console.log('   - Improve search accuracy significantly\n');

        // Delete existing collection
        console.log('🗑️  Deleting existing collection...');
        await deleteCollection();
        console.log('✅ Collection deleted successfully\n');

        // Re-index all documents
        console.log('📚 Starting re-indexing with enhanced chunking...');

        // Get all files in the RAW directory
        const fs = await import('node:fs');
        const path = await import('node:path');
        const files = fs
            .readdirSync(RAW)
            .filter((f) => /\.(pdf|txt)$/i.test(f));

        for (const f of files) {
            console.log(`\n📄 Processing: ${f}`);
            await ingestFile(path.join(RAW, f));
        }

        console.log('\n🎉 Enhanced Chunking Re-indexing Complete!');
        console.log('💡 Benefits of enhanced chunking:');
        console.log('   - Individual embeddings for each text chunk');
        console.log('   - Better search accuracy and relevance');
        console.log('   - Improved context retrieval');
        console.log('   - More precise answer generation');
    } catch (error) {
        console.error('❌ Error during re-indexing:', error);
        process.exit(1);
    }
}

// Run reindexing
reindex();
