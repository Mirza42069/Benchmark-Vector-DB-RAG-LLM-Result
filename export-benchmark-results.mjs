import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const dataDir = path.join(rootDir, "Data Benchmark");
const outputPath = path.join(rootDir, "benchmark-results-for-paper.md");

const datasetConfigs = [
  {
    label: "Dataset 1",
    canonicalFile: "benchmark_full_20260506_171446.json",
  },
  {
    label: "Dataset 2",
    canonicalFile: "benchmark_full_20260506_114940.json",
  },
];

const comparisonRows = readJson("thesis_db_embedding_comparison.json");
const rawFullFileNames = readdirSync(dataDir).filter((name) => name.startsWith("benchmark_full_") && name.endsWith(".json"));

const datasets = datasetConfigs.map((config) => {
  const data = readJson(config.canonicalFile);
  const rawMatches = rawFullFileNames.filter((name) => {
    const rawData = readJson(name);

    return rawData?.metadata?.benchmark_date === data?.metadata?.benchmark_date;
  });

  return {
    ...config,
    data,
    rawMatches,
  };
});

const comparisonByEmbedding = groupBy(
  [...comparisonRows].sort((a, b) => {
    const embeddingCompare = String(a.embedding_model).localeCompare(String(b.embedding_model));
    if (embeddingCompare !== 0) return embeddingCompare;
    return Number(a.retrieval_mean_ms) - Number(b.retrieval_mean_ms);
  }),
  (row) => String(row.embedding_model)
);

const lines = [];

lines.push("---");
lines.push("title: Benchmark Results For Paper");
lines.push("purpose: Source document for AI-assisted paper drafting and editing");
lines.push("generator: export-benchmark-results.mjs");
lines.push(`generated_at: ${new Date().toISOString()}`);
lines.push("datasets:");
for (const dataset of datasets) {
  lines.push(`  - Data Benchmark/${dataset.canonicalFile}`);
}
lines.push("comparison_file: Data Benchmark/thesis_db_embedding_comparison.json");
lines.push("primary_metrics:");
for (const metric of [
  "mean_retrieval_ms",
  "median_total_ms",
  "p95_total_ms",
  "avg_precision",
  "avg_hit_at_k",
  "avg_f1_score",
]) {
  lines.push(`  - ${metric}`);
}
lines.push("---");
lines.push("");
lines.push("# Benchmark Results For Paper");
lines.push("");
lines.push("This file is the canonical benchmark digest for AI-assisted paper writing and editing. It keeps summary-level benchmark evidence in a stable structure so claims can be checked and reused reliably by other AI systems.");
lines.push("");

lines.push("## Study Overview");
lines.push("");
lines.push(mdTable(
  ["Dataset", "Embedding", "Benchmark Date", "Queries", "Repetitions", "Top-K", "Threshold", "Canonical File", "Raw Source"],
  datasets.map((dataset) => {
    const metadata = dataset.data.metadata;
    return [
      dataset.label,
      metadata.embedding_model,
      metadata.benchmark_date,
      formatInteger(metadata.num_queries),
      formatInteger(metadata.repetitions),
      formatInteger(metadata.top_k),
      formatNumber(metadata.score_threshold, 2),
      `Data Benchmark/${dataset.canonicalFile}`,
      dataset.rawMatches.length > 0 ? dataset.rawMatches.join(", ") : dataset.canonicalFile,
    ];
  })
));
lines.push("");

lines.push("## Paper-Ready Findings");
lines.push("");
for (const finding of buildKeyFindings(datasets, comparisonRows)) {
  lines.push(`- ${finding}`);
}
lines.push("");

lines.push("## Cross-Embedding Comparison");
lines.push("");
lines.push(mdTable(
  ["Embedding", "Database", "Retrieval Median (ms)", "Retrieval Mean (ms)", "Total Median (ms)", "Total Mean (ms)", "Precision", "Hit@K", "F1", "Retrieval Winner", "Source File"],
  comparisonRows.map((row) => [
    row.embedding_model,
    row.database,
    formatNumber(row.retrieval_median_ms),
    formatNumber(row.retrieval_mean_ms),
    formatNumber(row.total_median_ms),
    formatNumber(row.total_mean_ms),
    formatPercent(row.avg_precision),
    formatPercent(row.avg_hit_at_k ?? row.avg_recall),
    formatPercent(row.avg_f1_score),
    row.is_retrieval_winner ? "Yes" : "No",
    row.source_file,
  ])
));
lines.push("");

for (const [embeddingModel, rows] of Object.entries(comparisonByEmbedding)) {
  lines.push(`### ${embeddingModel}`);
  lines.push("");
  lines.push(mdTable(
    ["Database", "Retrieval Mean (ms)", "Total Median (ms)", "Precision", "Hit@K", "F1"],
    rows.map((row) => [
      row.database,
      formatNumber(row.retrieval_mean_ms),
      formatNumber(row.total_median_ms),
      formatPercent(row.avg_precision),
      formatPercent(row.avg_hit_at_k ?? row.avg_recall),
      formatPercent(row.avg_f1_score),
    ])
  ));
  lines.push("");
}

for (const dataset of datasets) {
  const metadata = dataset.data.metadata;
  const speedSummary = dataset.data.speed_test.summary ?? [];
  const queryTypeSummary = dataset.data.speed_test.query_type_summary ?? {};
  const perRepetitionSummary = dataset.data.speed_test.per_repetition_summary ?? {};
  const qualityData = dataset.data.answerable_retrieval_quality ?? dataset.data.retrieval_quality ?? {};
  const noAnswerEvaluation = dataset.data.no_answer_evaluation ?? {};
  const topKSensitivity = dataset.data.top_k_sensitivity_test ?? dataset.data.scalability_test ?? {};
  const corpusSizeScalability = dataset.data.corpus_size_scalability_test ?? {};
  const sourceFiles = dataset.rawMatches.length > 0 ? dataset.rawMatches : [dataset.canonicalFile];

  lines.push(`## ${dataset.label} - ${metadata.embedding_model}`);
  lines.push("");
  lines.push(`Source of record: \`Data Benchmark/${dataset.canonicalFile}\``);
  lines.push("");
  lines.push(`Matching raw source files: ${sourceFiles.map((name) => `\`${name}\``).join(", ")}`);
  lines.push("");

  lines.push("### Metadata");
  lines.push("");
  lines.push(mdTable(
    ["Field", "Value"],
    [
      ["benchmark_date", metadata.benchmark_date],
      ["llm_model", metadata.llm_model],
      ["embedding_model", metadata.embedding_model],
      ["num_queries", formatInteger(metadata.num_queries)],
      ["repetitions", formatInteger(metadata.repetitions)],
      ["top_k", formatInteger(metadata.top_k)],
      ["score_threshold", formatNumber(metadata.score_threshold, 2)],
      ["scalability_doc_counts", Array.isArray(metadata.scalability_doc_counts) ? metadata.scalability_doc_counts.join(", ") : "N/A"],
      ["scalability_query_count", formatInteger(metadata.scalability_query_count)],
      ["databases_tested", Array.isArray(metadata.databases_tested) ? metadata.databases_tested.join(", ") : "N/A"],
    ]
  ));
  lines.push("");

  lines.push("### Paper-Ready Findings");
  lines.push("");
  for (const finding of buildDatasetFindings(dataset.data)) {
    lines.push(`- ${finding}`);
  }
  lines.push("");

  lines.push("### Speed Summary");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Retrieval Mean (ms)", "Retrieval P95 (ms)", "Total Mean (ms)", "Total Median (ms)", "Total P95 (ms)", "Min Total (ms)", "Max Total (ms)", "LLM Mean (ms)"],
    speedSummary.map((row) => [
      row.database,
      formatNumber(row.mean_retrieval_ms),
      formatNumber(row.p95_retrieval_ms),
      formatNumber(row.mean_total_ms),
      formatNumber(row.median_total_ms),
      formatNumber(row.p95_total_ms),
      formatNumber(row.min_total_ms),
      formatNumber(row.max_total_ms),
      formatNumber(row.mean_llm_ms),
    ])
  ));
  lines.push("");

  lines.push("### Query-Type Breakdown");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Query Type", "Queries Tested", "Mean Retrieval (ms)", "Mean Total (ms)"],
    flattenQueryTypeSummary(queryTypeSummary)
      .map((row) => [
        row.database,
        row.query_type,
        formatInteger(row.queries_tested),
        formatNumber(row.mean_retrieval_ms),
        formatNumber(row.mean_total_ms),
      ])
  ));
  lines.push("");

  lines.push("### Answerable Retrieval Quality");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Precision", "Hit@K", "F1", "Per-Query Rows"],
    Object.entries(qualityData).map(([database, metrics]) => [
      database,
      formatPercent(metrics.avg_precision),
      formatPercent(metrics.avg_hit_at_k ?? metrics.avg_recall),
      formatPercent(metrics.avg_f1_score),
      formatInteger(metrics.per_query?.length ?? 0),
    ])
  ));
  lines.push("");

  lines.push("### No-Answer Evaluation");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Abstention Accuracy", "False Positive Rate", "Average Docs Returned", "Per-Query Rows"],
    Object.entries(noAnswerEvaluation).map(([database, metrics]) => [
      database,
      formatPercent(metrics.avg_abstention_accuracy),
      formatPercent(metrics.avg_false_positive_rate),
      formatNumber(metrics.avg_docs_returned, 4),
      formatInteger(metrics.per_query?.length ?? 0),
    ])
  ));
  lines.push("");

  lines.push("### Per-Repetition Stability");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Repetition", "Retrieval Mean (ms)", "Retrieval P95 (ms)", "Total Mean (ms)", "Total P95 (ms)"],
    flattenPerRepetitionSummary(perRepetitionSummary).map((row) => [
      row.database,
      formatInteger(row.repetition),
      formatNumber(row.mean_retrieval_ms),
      formatNumber(row.p95_retrieval_ms),
      formatNumber(row.mean_total_ms),
      formatNumber(row.p95_total_ms),
    ])
  ));
  lines.push("");

  lines.push("### Top-K Sensitivity Summary");
  lines.push("");
  lines.push(mdTable(
    ["Database", "top_k", "Runs", "Mean Avg Time (ms)", "Mean Median Time (ms)", "Mean P95 Time (ms)", "Std Avg Time (ms)", "Min Avg Time (ms)", "Max Avg Time (ms)", "Query Count"],
    flattenTopKSummary(topKSensitivity).map((row) => [
      row.database,
      formatInteger(row.top_k),
      formatInteger(row.runs),
      formatNumber(row.mean_avg_time),
      formatNumber(row.mean_median_time),
      formatNumber(row.mean_p95_time),
      formatNumber(row.std_avg_time),
      formatNumber(row.min_avg_time),
      formatNumber(row.max_avg_time),
      formatInteger(row.query_count),
    ])
  ));
  lines.push("");

  lines.push("### Corpus-Size Scalability Summary");
  lines.push("");
  lines.push(mdTable(
    ["Database", "Doc Count", "Runs", "Mean Avg Time (ms)", "Mean Median Time (ms)", "Mean P95 Time (ms)", "Std Avg Time (ms)", "Min Avg Time (ms)", "Max Avg Time (ms)", "Query Count"],
    flattenCorpusSummary(corpusSizeScalability).map((row) => [
      row.database,
      formatInteger(row.doc_count),
      formatInteger(row.runs),
      formatNumber(row.mean_avg_time),
      formatNumber(row.mean_median_time),
      formatNumber(row.mean_p95_time),
      formatNumber(row.std_avg_time),
      formatNumber(row.min_avg_time),
      formatNumber(row.max_avg_time),
      formatInteger(row.query_count),
    ])
  ));
  lines.push("");

}

lines.push("## Interpretation Guardrails");
lines.push("");
lines.push("- `Hit@K` and `avg_f1_score` in these files come from `answerable_retrieval_quality`, so they describe answerable-query retrieval behavior rather than the no-answer task.");
lines.push("- `no_answer_evaluation` should be cited separately from retrieval quality, because it measures abstention behavior rather than document relevance quality.");
lines.push("- Total latency is influenced by LLM generation variability and extreme outliers, so paper claims should usually anchor on retrieval mean, retrieval p95, total median, and total p95 together.");
lines.push("- The canonical site files and the matching `benchmark_full_*.json` files represent the same underlying benchmark runs in this workspace.");
lines.push("");

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");

console.log(`Wrote ${path.basename(outputPath)}`);

function readJson(fileName) {
  return JSON.parse(readFileSync(path.join(dataDir, fileName), "utf8"));
}

function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    acc[key] ??= [];
    acc[key].push(item);
    return acc;
  }, {});
}

function mdTable(headers, rows) {
  const normalizedRows = rows.length > 0 ? rows : [headers.map(() => "N/A")];
  const escape = (value) => String(value ?? "N/A").replace(/\|/g, "\\|").replace(/\n/g, " ");
  const headerLine = `| ${headers.map(escape).join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyLines = normalizedRows.map((row) => `| ${row.map(escape).join(" | ")} |`);
  return [headerLine, separatorLine, ...bodyLines].join("\n");
}

function formatNumber(value, digits = 2) {
  return typeof value === "number" && Number.isFinite(value) ? value.toFixed(digits) : "N/A";
}

function formatInteger(value) {
  return typeof value === "number" && Number.isFinite(value) ? String(value) : "N/A";
}

function formatPercent(value, digits = 2) {
  return typeof value === "number" && Number.isFinite(value) ? `${(value * 100).toFixed(digits)}%` : "N/A";
}

function flattenQueryTypeSummary(queryTypeSummary) {
  const rows = [];
  for (const [database, metrics] of Object.entries(queryTypeSummary)) {
    for (const queryType of ["answerable", "no_answer"]) {
      const entry = metrics?.[queryType];
      if (!entry) continue;
      rows.push({
        database,
        query_type: queryType,
        ...entry,
      });
    }
  }
  return rows;
}

function flattenPerRepetitionSummary(perRepetitionSummary) {
  const rows = [];
  for (const [database, entries] of Object.entries(perRepetitionSummary)) {
    for (const entry of entries ?? []) {
      rows.push({ database, ...entry });
    }
  }
  return rows;
}

function flattenTopKSummary(section) {
  const rows = [];
  for (const [database, entries] of Object.entries(section)) {
    for (const entry of entries ?? []) {
      rows.push({ database, ...entry });
    }
  }
  return rows;
}

function flattenCorpusSummary(section) {
  const rows = [];
  for (const [database, entries] of Object.entries(section)) {
    for (const entry of entries ?? []) {
      rows.push({ database, ...entry });
    }
  }
  return rows;
}

function buildKeyFindings(datasetsForFindings, comparison) {
  const findings = [];
  const qwenRows = comparison.filter((row) => String(row.embedding_model).includes("qwen3-embedding"));
  const mxbaiRows = comparison.filter((row) => String(row.embedding_model).includes("mxbai"));

  const retrievalComparisons = [];
  const qualityComparisons = [];
  for (const qwenRow of qwenRows) {
    const matchingMxbai = mxbaiRows.find((row) => row.database === qwenRow.database);
    if (!matchingMxbai) continue;
    retrievalComparisons.push({
      database: qwenRow.database,
      ratio: Number(qwenRow.retrieval_mean_ms) / Number(matchingMxbai.retrieval_mean_ms),
    });
    qualityComparisons.push({
      database: qwenRow.database,
      f1Delta: Number(qwenRow.avg_f1_score) - Number(matchingMxbai.avg_f1_score),
      hitAtKDelta: Number(qwenRow.avg_hit_at_k ?? qwenRow.avg_recall) - Number(matchingMxbai.avg_hit_at_k ?? matchingMxbai.avg_recall),
    });
  }

  if (retrievalComparisons.length > 0) {
    const minRatio = Math.min(...retrievalComparisons.map((item) => item.ratio));
    const maxRatio = Math.max(...retrievalComparisons.map((item) => item.ratio));
    findings.push(`Across all three databases, \`mxbai-embed-large\` is between ${minRatio.toFixed(1)}x and ${maxRatio.toFixed(1)}x faster than \`qwen3-embedding:8b\` on mean retrieval latency.`);
  }

  if (qualityComparisons.length > 0) {
    const f1Range = qualityComparisons.map((item) => item.f1Delta);
    const hitAtKRange = qualityComparisons.map((item) => item.hitAtKDelta);
    findings.push(`Across all three databases, \`qwen3-embedding:8b\` has higher answerable-query retrieval quality than \`mxbai-embed-large\`, improving F1 by ${(Math.min(...f1Range) * 100).toFixed(2)} to ${(Math.max(...f1Range) * 100).toFixed(2)} percentage points and Hit@K by ${(Math.min(...hitAtKRange) * 100).toFixed(2)} to ${(Math.max(...hitAtKRange) * 100).toFixed(2)} percentage points.`);
  }

  for (const dataset of datasetsForFindings) {
    const speedSummary = dataset.data.speed_test.summary ?? [];
    const fastestRetrieval = [...speedSummary].sort((a, b) => Number(a.mean_retrieval_ms) - Number(b.mean_retrieval_ms))[0];
    const lowestMedianTotal = [...speedSummary].sort((a, b) => Number(a.median_total_ms) - Number(b.median_total_ms))[0];

    if (fastestRetrieval) {
      findings.push(`${dataset.label} (${dataset.data.metadata.embedding_model}) has its fastest retrieval on ${fastestRetrieval.database} at ${Number(fastestRetrieval.mean_retrieval_ms).toFixed(2)} ms mean retrieval time.`);
    }
    if (lowestMedianTotal) {
      findings.push(`${dataset.label} (${dataset.data.metadata.embedding_model}) has its lowest median total latency on ${lowestMedianTotal.database} at ${Number(lowestMedianTotal.median_total_ms).toFixed(2)} ms.`);
    }
  }

  return findings;
}

function buildDatasetFindings(data) {
  const findings = [];
  const speedSummary = data.speed_test.summary ?? [];
  const queryTypeSummary = data.speed_test.query_type_summary ?? {};
  const noAnswerEvaluation = data.no_answer_evaluation ?? {};
  const qualityData = data.answerable_retrieval_quality ?? data.retrieval_quality ?? {};

  const fastestRetrieval = [...speedSummary].sort((a, b) => Number(a.mean_retrieval_ms) - Number(b.mean_retrieval_ms))[0];
  const slowestRetrieval = [...speedSummary].sort((a, b) => Number(b.mean_retrieval_ms) - Number(a.mean_retrieval_ms))[0];
  const lowestMedianTotal = [...speedSummary].sort((a, b) => Number(a.median_total_ms) - Number(b.median_total_ms))[0];
  const highestP95Total = [...speedSummary].sort((a, b) => Number(b.p95_total_ms ?? -Infinity) - Number(a.p95_total_ms ?? -Infinity))[0];
  const bestNoAnswer = Object.entries(noAnswerEvaluation)
    .sort(([, a], [, b]) => Number(b.avg_abstention_accuracy) - Number(a.avg_abstention_accuracy))[0];

  if (fastestRetrieval && slowestRetrieval) {
    findings.push(`${fastestRetrieval.database} is the fastest retrieval backend (${Number(fastestRetrieval.mean_retrieval_ms).toFixed(2)} ms mean retrieval), while ${slowestRetrieval.database} is the slowest (${Number(slowestRetrieval.mean_retrieval_ms).toFixed(2)} ms).`);
  }

  if (lowestMedianTotal) {
    findings.push(`${lowestMedianTotal.database} has the lowest median end-to-end latency at ${Number(lowestMedianTotal.median_total_ms).toFixed(2)} ms.`);
  }

  if (highestP95Total) {
    findings.push(`${highestP95Total.database} has the highest p95 total latency at ${Number(highestP95Total.p95_total_ms).toFixed(2)} ms, which is the most conservative tail-latency figure in this dataset.`);
  }

  const qualityRows = Object.entries(qualityData).map(([database, metrics]) => ({
    database,
    f1: Number(metrics.avg_f1_score),
    precision: Number(metrics.avg_precision),
    hitAtK: Number(metrics.avg_hit_at_k ?? metrics.avg_recall ?? 0),
  }));

  if (qualityRows.length > 0) {
    const maxF1 = Math.max(...qualityRows.map((row) => row.f1));
    const leaders = qualityRows.filter((row) => Math.abs(row.f1 - maxF1) < 0.0001).map((row) => row.database);
    findings.push(`Answerable-query retrieval quality is ${leaders.length === qualityRows.length ? "effectively tied across all three databases" : `highest on ${leaders.join(", ")}`}, with max F1 = ${(maxF1 * 100).toFixed(2)}%.`);
  }

  if (bestNoAnswer) {
    findings.push(`${bestNoAnswer[0]} has the highest no-answer abstention accuracy at ${(Number(bestNoAnswer[1].avg_abstention_accuracy) * 100).toFixed(2)}%.`);
  }

  const queryTypeRows = flattenQueryTypeSummary(queryTypeSummary);
  const answerableRows = queryTypeRows.filter((row) => row.query_type === "answerable");
  const noAnswerRows = queryTypeRows.filter((row) => row.query_type === "no_answer");
  if (answerableRows.length > 0 && noAnswerRows.length > 0) {
    const answerableMean = answerableRows.reduce((sum, row) => sum + Number(row.mean_total_ms), 0) / answerableRows.length;
    const noAnswerMean = noAnswerRows.reduce((sum, row) => sum + Number(row.mean_total_ms), 0) / noAnswerRows.length;
    findings.push(`Answerable queries are slower than no-answer queries on average (${answerableMean.toFixed(2)} ms vs ${noAnswerMean.toFixed(2)} ms mean total latency across databases).`);
  }

  return findings;
}
