import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "Data Benchmark");
const outputPath = path.join(dataDir, "thesis_db_embedding_comparison.json");

const sourceFiles = [
  "benchmark_full_20260506_171446.json",
  "benchmark_full_20260506_114940.json",
];

const rows = sourceFiles.flatMap((sourceFile) => {
  const data = readJson(sourceFile);
  const embeddingModel = data.metadata.embedding_model;
  const qualityData = data.answerable_retrieval_quality ?? data.retrieval_quality ?? {};
  const winnerDatabase = data.speed_test.winner?.database;

  return (data.speed_test.summary ?? []).map((speedRow) => {
    const quality = qualityData[speedRow.database] ?? {};

    return {
      embedding_model: embeddingModel,
      database: speedRow.database,
      retrieval_median_ms: medianRetrievalTime(data, speedRow.database),
      retrieval_mean_ms: speedRow.mean_retrieval_ms,
      total_median_ms: speedRow.median_total_ms,
      total_mean_ms: speedRow.mean_total_ms,
      avg_precision: quality.avg_precision ?? null,
      avg_hit_at_k: quality.avg_hit_at_k ?? quality.avg_recall ?? null,
      avg_f1_score: quality.avg_f1_score ?? null,
      is_retrieval_winner: speedRow.database === winnerDatabase,
      source_file: sourceFile,
    };
  });
});

rows.sort((a, b) => {
  const embeddingCompare = String(a.embedding_model).localeCompare(String(b.embedding_model));
  if (embeddingCompare !== 0) return embeddingCompare;
  return Number(a.retrieval_mean_ms) - Number(b.retrieval_mean_ms);
});

writeFileSync(outputPath, `${JSON.stringify(rows, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.basename(outputPath)}`);

function readJson(fileName) {
  return JSON.parse(readFileSync(path.join(dataDir, fileName), "utf8"));
}

function medianRetrievalTime(data, database) {
  const values = (data.speed_test.raw_results ?? [])
    .filter((row) => row.database === database && Number.isFinite(row.retrieval_time) && row.retrieval_time >= 0)
    .map((row) => row.retrieval_time)
    .sort((a, b) => a - b);

  if (values.length === 0) return null;

  const midpoint = Math.floor(values.length / 2);
  if (values.length % 2 === 1) return round(values[midpoint]);

  return round((values[midpoint - 1] + values[midpoint]) / 2);
}

function round(value) {
  return Number(value.toFixed(2));
}
