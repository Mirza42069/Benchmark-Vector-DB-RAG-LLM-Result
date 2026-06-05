---
title: Benchmark Results For Paper
purpose: Source document for AI-assisted paper drafting and editing
generator: export-benchmark-results.mjs
generated_at: 2026-06-05T07:07:33.261Z
datasets:
  - Data Benchmark/benchmark_final 5local db.json
comparison_file: Data Benchmark/thesis_db_embedding_comparison.json
primary_metrics:
  - mean_retrieval_ms
  - median_total_ms
  - p95_total_ms
  - avg_precision
  - avg_hit_at_k
  - avg_f1_score
---

# Benchmark Results For Paper

This file is the canonical benchmark digest for AI-assisted paper writing and editing. It keeps summary-level benchmark evidence in a stable structure so claims can be checked and reused reliably by other AI systems.

## Study Overview

| Dataset | Embedding | Benchmark Date | Queries | Repetitions | Top-K | Threshold | Canonical File | Raw Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dataset 1 | qwen3-embedding:8b | 2026-06-05T06:37:53.052666 | 100 | 5 | 5 | N/A | Data Benchmark/benchmark_final 5local db.json | benchmark_final 5local db.json |

## Paper-Ready Findings

- Dataset 1 (qwen3-embedding:8b) has its fastest retrieval on ChromaDB at 110.36 ms mean retrieval time.
- Dataset 1 (qwen3-embedding:8b) has its lowest median total latency on Qdrant at 3970.85 ms.

## Cross-Embedding Comparison

| Embedding | Database | Retrieval Median (ms) | Retrieval Mean (ms) | Total Median (ms) | Total Mean (ms) | Precision | Hit@K | F1 | Retrieval Winner | Source File |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| qwen3-embedding:8b | ChromaDB | 104.30 | 110.36 | 4023.32 | 4325.98 | 47.43% | 76.67% | 71.67% | Yes | benchmark_final 5local db.json |
| qwen3-embedding:8b | Qdrant | 122.41 | 121.74 | 3970.85 | 4317.22 | 44.04% | 66.67% | 90.00% | No | benchmark_final 5local db.json |
| qwen3-embedding:8b | LanceDB | 160.47 | 160.52 | 4040.94 | 4322.80 | 44.04% | 66.67% | 76.67% | No | benchmark_final 5local db.json |
| qwen3-embedding:8b | PostgreSQL | 257.17 | 260.24 | 4354.19 | 4684.84 | 50.42% | 66.67% | 78.33% | No | benchmark_final 5local db.json |
| qwen3-embedding:8b | SQLite | 523.89 | 530.52 | 4508.24 | 4797.94 | 46.32% | 66.67% | 80.00% | No | benchmark_final 5local db.json |

### qwen3-embedding:8b

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 110.36 | 4023.32 | 47.43% | 76.67% | 71.67% |
| Qdrant | 121.74 | 3970.85 | 44.04% | 66.67% | 90.00% |
| LanceDB | 160.52 | 4040.94 | 44.04% | 66.67% | 76.67% |
| PostgreSQL | 260.24 | 4354.19 | 50.42% | 66.67% | 78.33% |
| SQLite | 530.52 | 4508.24 | 46.32% | 66.67% | 80.00% |

## Dataset 1 - qwen3-embedding:8b

Source of record: `Data Benchmark/benchmark_final 5local db.json`

Matching raw source files: `benchmark_final 5local db.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-06-05T06:37:53.052666 |
| run_id | 20260605_063753 |
| status | completed |
| duration_seconds | 25932.28 |
| llm_model | gemma4:e4b |
| embedding_model | qwen3-embedding:8b |
| num_queries | 100 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | N/A |
| scalability_doc_counts | 20, 40, 60, 80, 100 |
| scalability_query_count | 100 |
| databases_tested | PostgreSQL, ChromaDB, SQLite, LanceDB, Qdrant |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (110.36 ms mean retrieval), while SQLite is the slowest (530.52 ms).
- Qdrant has the lowest median end-to-end latency at 3970.85 ms.
- PostgreSQL has the highest p95 total latency at 7563.70 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is highest on Qdrant, with max F1 = 90.00%.

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL | 260.24 | 278.20 | 4684.84 | 4354.19 | 7563.70 | 2102.21 | 13121.33 | 4424.59 |
| ChromaDB | 110.36 | 109.04 | 4325.98 | 4023.32 | 7164.28 | 1806.70 | 9665.42 | 4215.61 |
| SQLite | 530.52 | 581.52 | 4797.94 | 4508.24 | 7546.15 | 2319.52 | 9526.99 | 4267.43 |
| LanceDB | 160.52 | 166.94 | 4322.80 | 4040.94 | 6993.03 | 1839.83 | 11231.29 | 4162.27 |
| Qdrant | 121.74 | 132.68 | 4317.22 | 3970.85 | 7034.78 | 1786.99 | 10804.33 | 4195.48 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| PostgreSQL | answerable | 500 | 260.24 | 4684.84 |
| ChromaDB | answerable | 500 | 110.36 | 4325.98 |
| SQLite | answerable | 500 | 530.52 | 4797.94 |
| LanceDB | answerable | 500 | 160.52 | 4322.80 |
| Qdrant | answerable | 500 | 121.74 | 4317.22 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| PostgreSQL | 50.42% | 66.67% | 78.33% | 10 |
| ChromaDB | 47.43% | 76.67% | 71.67% | 10 |
| SQLite | 46.32% | 66.67% | 80.00% | 10 |
| LanceDB | 44.04% | 66.67% | 76.67% | 10 |
| Qdrant | 44.04% | 66.67% | 90.00% | 10 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| PostgreSQL | 1 | 263.10 | 302.55 | 4744.79 | 7713.90 |
| PostgreSQL | 2 | 262.22 | 273.36 | 4648.14 | 7588.92 |
| PostgreSQL | 3 | 258.43 | 265.03 | 4592.11 | 7320.27 |
| PostgreSQL | 4 | 259.11 | 267.28 | 4784.67 | 7501.23 |
| PostgreSQL | 5 | 258.34 | 267.34 | 4654.47 | 7738.81 |
| ChromaDB | 1 | 133.99 | 109.29 | 4360.38 | 6782.55 |
| ChromaDB | 2 | 104.37 | 109.28 | 4294.46 | 7091.78 |
| ChromaDB | 3 | 104.44 | 109.01 | 4321.17 | 6499.53 |
| ChromaDB | 4 | 104.51 | 108.62 | 4284.80 | 7190.08 |
| ChromaDB | 5 | 104.51 | 108.18 | 4369.09 | 7093.00 |
| SQLite | 1 | 565.12 | 605.95 | 4871.01 | 7687.08 |
| SQLite | 2 | 529.94 | 541.75 | 4816.82 | 7626.89 |
| SQLite | 3 | 520.92 | 538.82 | 4745.86 | 7044.45 |
| SQLite | 4 | 521.28 | 541.09 | 4812.97 | 7762.82 |
| SQLite | 5 | 515.34 | 534.26 | 4743.06 | 7033.64 |
| LanceDB | 1 | 157.70 | 163.11 | 4191.60 | 6647.80 |
| LanceDB | 2 | 157.81 | 163.21 | 4405.99 | 7280.34 |
| LanceDB | 3 | 161.39 | 167.14 | 4357.23 | 6734.90 |
| LanceDB | 4 | 161.88 | 165.37 | 4323.54 | 6978.30 |
| LanceDB | 5 | 163.84 | 170.09 | 4335.63 | 6839.19 |
| Qdrant | 1 | 126.23 | 149.67 | 4437.73 | 7266.96 |
| Qdrant | 2 | 121.12 | 130.73 | 4275.23 | 6853.75 |
| Qdrant | 3 | 121.38 | 131.33 | 4253.35 | 6844.92 |
| Qdrant | 4 | 120.05 | 131.16 | 4387.37 | 6840.07 |
| Qdrant | 5 | 119.93 | 129.91 | 4232.42 | 7276.09 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL | 1 | 5 | 263.35 | 263.35 | 263.35 | 2.44 | 260.36 | 267.28 | 100 |
| PostgreSQL | 2 | 5 | 265.16 | 265.16 | 265.16 | 5.15 | 260.79 | 274.00 | 100 |
| PostgreSQL | 3 | 5 | 267.77 | 267.77 | 267.77 | 7.49 | 261.26 | 281.65 | 100 |
| PostgreSQL | 5 | 5 | 270.45 | 270.45 | 270.45 | 8.66 | 263.22 | 287.03 | 100 |
| PostgreSQL | 8 | 5 | 271.72 | 271.72 | 271.72 | 8.17 | 266.86 | 288.04 | 100 |
| PostgreSQL | 10 | 5 | 269.01 | 269.01 | 269.01 | 0.29 | 268.70 | 269.53 | 100 |
| PostgreSQL | 15 | 5 | 273.20 | 273.20 | 273.20 | 0.93 | 271.47 | 274.18 | 100 |
| PostgreSQL | 20 | 5 | 276.53 | 276.53 | 276.53 | 1.37 | 274.97 | 278.91 | 100 |
| ChromaDB | 1 | 5 | 111.95 | 111.95 | 111.95 | 1.17 | 110.89 | 114.08 | 100 |
| ChromaDB | 2 | 5 | 111.80 | 111.80 | 111.80 | 0.98 | 110.69 | 113.58 | 100 |
| ChromaDB | 3 | 5 | 113.14 | 113.14 | 113.14 | 2.75 | 111.31 | 118.57 | 100 |
| ChromaDB | 5 | 5 | 113.69 | 113.69 | 113.69 | 4.18 | 111.29 | 122.01 | 100 |
| ChromaDB | 8 | 5 | 113.10 | 113.10 | 113.10 | 2.02 | 111.49 | 116.98 | 100 |
| ChromaDB | 10 | 5 | 112.56 | 112.56 | 112.56 | 0.68 | 111.75 | 113.71 | 100 |
| ChromaDB | 15 | 5 | 112.48 | 112.48 | 112.48 | 0.37 | 111.95 | 113.07 | 100 |
| ChromaDB | 20 | 5 | 113.00 | 113.00 | 113.00 | 0.86 | 112.45 | 114.71 | 100 |
| SQLite | 1 | 5 | 541.61 | 541.61 | 541.61 | 11.48 | 529.82 | 560.40 | 100 |
| SQLite | 2 | 5 | 542.71 | 542.71 | 542.71 | 17.54 | 522.47 | 564.23 | 100 |
| SQLite | 3 | 5 | 537.39 | 537.39 | 537.39 | 17.37 | 515.91 | 563.66 | 100 |
| SQLite | 5 | 5 | 531.96 | 531.96 | 531.96 | 11.54 | 515.25 | 545.22 | 100 |
| SQLite | 8 | 5 | 533.79 | 533.79 | 533.79 | 18.63 | 515.01 | 563.35 | 100 |
| SQLite | 10 | 5 | 532.63 | 532.63 | 532.63 | 9.98 | 515.34 | 544.41 | 100 |
| SQLite | 15 | 5 | 530.16 | 530.16 | 530.16 | 8.03 | 514.88 | 538.00 | 100 |
| SQLite | 20 | 5 | 528.25 | 528.25 | 528.25 | 9.07 | 510.40 | 535.21 | 100 |
| LanceDB | 1 | 5 | 188.88 | 188.88 | 188.88 | 6.68 | 175.88 | 194.25 | 100 |
| LanceDB | 2 | 5 | 189.74 | 189.74 | 189.74 | 7.08 | 179.36 | 198.79 | 100 |
| LanceDB | 3 | 5 | 193.94 | 193.94 | 193.94 | 8.32 | 181.58 | 206.87 | 100 |
| LanceDB | 5 | 5 | 198.05 | 198.05 | 198.05 | 7.49 | 187.86 | 209.43 | 100 |
| LanceDB | 8 | 5 | 201.00 | 201.00 | 201.00 | 4.72 | 194.30 | 206.26 | 100 |
| LanceDB | 10 | 5 | 197.85 | 197.85 | 197.85 | 7.21 | 187.03 | 209.54 | 100 |
| LanceDB | 15 | 5 | 204.23 | 204.23 | 204.23 | 8.39 | 192.13 | 217.51 | 100 |
| LanceDB | 20 | 5 | 212.39 | 212.39 | 212.39 | 12.63 | 202.69 | 237.22 | 100 |
| Qdrant | 1 | 5 | 129.01 | 129.01 | 129.01 | 1.58 | 127.21 | 130.88 | 100 |
| Qdrant | 2 | 5 | 129.91 | 129.91 | 129.91 | 1.04 | 128.19 | 131.31 | 100 |
| Qdrant | 3 | 5 | 129.20 | 129.20 | 129.20 | 0.77 | 128.34 | 130.58 | 100 |
| Qdrant | 5 | 5 | 130.09 | 130.09 | 130.09 | 1.16 | 128.04 | 131.17 | 100 |
| Qdrant | 8 | 5 | 129.56 | 129.56 | 129.56 | 0.72 | 128.48 | 130.61 | 100 |
| Qdrant | 10 | 5 | 129.04 | 129.04 | 129.04 | 1.32 | 126.99 | 131.12 | 100 |
| Qdrant | 15 | 5 | 129.98 | 129.98 | 129.98 | 0.61 | 129.29 | 131.10 | 100 |
| Qdrant | 20 | 5 | 130.56 | 130.56 | 130.56 | 1.60 | 128.96 | 133.45 | 100 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL | 20 | 5 | 142.96 | 140.82 | 157.15 | 1.48 | 141.01 | 145.56 | 100 |
| PostgreSQL | 40 | 5 | 169.13 | 165.14 | 191.01 | 2.70 | 165.35 | 172.28 | 100 |
| PostgreSQL | 60 | 5 | 203.39 | 200.72 | 216.29 | 1.61 | 201.34 | 205.56 | 100 |
| PostgreSQL | 80 | 5 | 246.25 | 241.75 | 253.37 | 2.25 | 243.31 | 249.85 | 100 |
| PostgreSQL | 100 | 5 | 265.01 | 261.12 | 277.49 | 2.18 | 262.11 | 268.72 | 100 |
| ChromaDB | 20 | 5 | 111.53 | 110.31 | 118.88 | 0.29 | 111.13 | 111.89 | 100 |
| ChromaDB | 40 | 5 | 112.09 | 110.99 | 119.10 | 0.70 | 111.12 | 112.84 | 100 |
| ChromaDB | 60 | 5 | 112.18 | 110.81 | 120.18 | 0.96 | 110.94 | 113.58 | 100 |
| ChromaDB | 80 | 5 | 112.58 | 111.39 | 119.59 | 0.33 | 112.02 | 112.91 | 100 |
| ChromaDB | 100 | 5 | 112.32 | 110.95 | 119.10 | 0.63 | 111.64 | 113.49 | 100 |
| SQLite | 20 | 5 | 130.95 | 130.92 | 137.57 | 0.47 | 130.16 | 131.52 | 100 |
| SQLite | 40 | 5 | 231.52 | 229.96 | 242.19 | 0.72 | 230.27 | 232.46 | 100 |
| SQLite | 60 | 5 | 283.80 | 279.83 | 306.65 | 1.92 | 281.69 | 287.17 | 100 |
| SQLite | 80 | 5 | 402.10 | 397.81 | 436.90 | 4.71 | 397.28 | 410.32 | 100 |
| SQLite | 100 | 5 | 461.74 | 468.57 | 497.55 | 7.06 | 454.97 | 474.51 | 100 |
| LanceDB | 20 | 5 | 122.97 | 122.00 | 130.99 | 0.65 | 122.19 | 123.86 | 100 |
| LanceDB | 40 | 5 | 144.82 | 144.72 | 152.53 | 2.22 | 140.75 | 147.47 | 100 |
| LanceDB | 60 | 5 | 156.73 | 156.64 | 164.17 | 3.34 | 150.80 | 159.99 | 100 |
| LanceDB | 80 | 5 | 178.72 | 177.68 | 185.73 | 4.67 | 170.54 | 183.76 | 100 |
| LanceDB | 100 | 5 | 190.63 | 189.55 | 196.77 | 3.90 | 185.70 | 196.97 | 100 |
| Qdrant | 20 | 5 | 129.43 | 127.29 | 141.77 | 0.77 | 127.99 | 130.12 | 100 |
| Qdrant | 40 | 5 | 128.35 | 125.45 | 141.87 | 0.88 | 127.17 | 129.72 | 100 |
| Qdrant | 60 | 5 | 131.13 | 133.57 | 143.03 | 0.54 | 130.60 | 131.95 | 100 |
| Qdrant | 80 | 5 | 131.55 | 133.58 | 143.24 | 2.07 | 128.41 | 133.96 | 100 |
| Qdrant | 100 | 5 | 131.74 | 130.11 | 146.90 | 2.83 | 129.43 | 137.31 | 100 |

### Concurrent User Scalability Summary

| Database | Users | Runs | Mean Latency (ms) | P95 Latency (ms) | P99 Latency (ms) | Throughput (rps) | Error Rate | Avg CPU | Avg RAM (MB) | Avg GPU |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL | 1 | 5 | 334.63 | 451.04 | 467.28 | 3.16 | 0.00% | 11.94% | 13839.21 | 11.87% |
| PostgreSQL | 3 | 5 | 334.67 | 392.62 | 397.84 | 8.61 | 0.00% | 26.86% | 13552.34 | 10.40% |
| PostgreSQL | 5 | 5 | 370.77 | 436.38 | 448.05 | 12.71 | 0.00% | 41.75% | 13592.54 | 20.92% |
| ChromaDB | 1 | 5 | 115.92 | 122.43 | 123.30 | 8.63 | 0.00% | 11.16% | 13871.19 | 6.40% |
| ChromaDB | 3 | 5 | 133.37 | 158.85 | 165.87 | 21.23 | 0.00% | 22.56% | 13510.76 | 18.10% |
| ChromaDB | 5 | 5 | 154.17 | 212.37 | 224.84 | 29.60 | 0.00% | 31.71% | 13602.80 | 0.00% |
| SQLite | 1 | 5 | 528.29 | 540.85 | 541.47 | 1.89 | 0.00% | 12.65% | 13984.31 | 8.03% |
| SQLite | 3 | 5 | 5981.67 | 10077.38 | 10329.25 | 0.43 | 0.00% | 18.70% | 14210.05 | 10.95% |
| SQLite | 5 | 5 | 18568.39 | 37008.39 | 41064.32 | 0.22 | 1.33% | 22.38% | 14542.37 | 5.84% |
| LanceDB | 1 | 5 | 209.87 | 216.20 | 216.95 | 4.77 | 0.00% | 15.43% | 13991.48 | 6.40% |
| LanceDB | 3 | 5 | 412.94 | 542.20 | 544.40 | 7.15 | 0.00% | 32.34% | 13707.66 | 16.43% |
| LanceDB | 5 | 5 | 538.18 | 749.61 | 753.38 | 8.55 | 0.00% | 42.90% | 13491.78 | 18.00% |
| Qdrant | 1 | 5 | 129.41 | 135.88 | 136.47 | 7.73 | 0.00% | 13.81% | 14075.18 | 2.50% |
| Qdrant | 3 | 5 | 150.00 | 173.08 | 176.32 | 18.94 | 0.00% | 21.34% | 13759.61 | 7.30% |
| Qdrant | 5 | 5 | 173.63 | 222.45 | 235.25 | 26.73 | 0.00% | 26.71% | 13523.19 | 10.50% |

### DeepEval Answer Quality Summary

| Database | Answer Relevancy | Faithfulness | Context Relevancy | Context Precision | Context Recall | Per-Query Rows |
| --- | --- | --- | --- | --- | --- | --- |
| PostgreSQL | 100.00% | 78.33% | 24.12% | 50.42% | 66.67% | 10 |
| ChromaDB | 90.00% | 71.67% | 27.30% | 47.43% | 76.67% | 10 |
| SQLite | 100.00% | 80.00% | 23.98% | 46.32% | 66.67% | 10 |
| LanceDB | 81.67% | 76.67% | 25.62% | 44.04% | 66.67% | 10 |
| Qdrant | 73.33% | 90.00% | 24.15% | 44.04% | 66.67% | 10 |

## Interpretation Guardrails

- When `answerable_retrieval_quality` is absent, quality summary fields are normalized from `deepeval_answer_quality`: contextual precision, contextual recall, and faithfulness.
- `deepeval_answer_quality` is based on a capped sample and should be cited separately from full retrieval speed/scalability measurements.
- Total latency is influenced by LLM generation variability and extreme outliers, so paper claims should usually anchor on retrieval mean, retrieval p95, total median, and total p95 together.
- Pinecone is intentionally absent from the active local-database benchmark until a matching Pinecone run is added.

