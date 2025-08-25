#!/usr/bin/env tsx
import fs from "node:fs";
import path from "node:path";
import pdf from "pdf-parse";
import crypto from "node:crypto";
import { embed } from "../src/lib/llm";
import { ensureCollection, upsert } from "../src/lib/vector";

const RAW = path.join(process.cwd(), "data", "raw");

function chunk(text: string, size = 800, overlap = 120) {
  const out: string[] = [];
  for (let i = 0; i < text.length; i += size - overlap) {
    out.push(text.slice(i, i + size));
  }
  return out.map(t => t.replace(/\s+/g, " ").trim()).filter(Boolean);
}

async function ingestFile(file: string) {
  const buf = fs.readFileSync(file);
  const text = file.endsWith(".pdf") ? (await pdf(buf)).text : buf.toString("utf8");
  const chunks = chunk(text);
  const vectors = await embed(chunks);
  await ensureCollection(vectors[0].length);
  await upsert(
    chunks.map((t, i) => ({
      id: crypto.createHash("md5").update(file + ":" + i).digest("hex"),
      text: t,
      vector: vectors[Math.min(0, 0)], // demo: pakai vector gabungan (cukup untuk POC)
      meta: { file: path.basename(file), idx: i },
    }))
  );
}

(async () => {
  const files = fs.readdirSync(RAW).filter(f => /\.(pdf|txt)$/i.test(f));
  for (const f of files) {
    console.log("ingest:", f);
    await ingestFile(path.join(RAW, f));
  }
  console.log("done.");
})();
