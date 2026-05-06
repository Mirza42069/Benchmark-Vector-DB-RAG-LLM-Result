---
title: Benchmark Results For Paper
purpose: Source document for AI-assisted paper drafting and editing
generator: export-benchmark-results.mjs
generated_at: 2026-05-06T10:22:48.423Z
datasets:
  - Data Benchmark/benchmark_full_20260506_171446.json
  - Data Benchmark/benchmark_full_20260506_114940.json
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
| Dataset 1 | qwen3-embedding:8b | 2026-05-06T17:14:46.586577 | 100 | 5 | 5 | N/A | Data Benchmark/benchmark_full_20260506_171446.json | benchmark_full_20260506_171446.json |
| Dataset 2 | mxbai-embed-large | 2026-05-06T11:49:40.256343 | 100 | 5 | 5 | N/A | Data Benchmark/benchmark_full_20260506_114940.json | benchmark_full_20260506_114940.json |

## Paper-Ready Findings

- Across all three databases, `mxbai-embed-large` is between 7.0x and 83.5x faster than `qwen3-embedding:8b` on mean retrieval latency.
- Across all three databases, `qwen3-embedding:8b` has higher answerable-query retrieval quality than `mxbai-embed-large`, improving F1 by 20.74 to 20.74 percentage points and Hit@K by 26.00 to 26.00 percentage points.
- Dataset 1 (qwen3-embedding:8b) has its fastest retrieval on ChromaDB at 2054.40 ms mean retrieval time.
- Dataset 1 (qwen3-embedding:8b) has its lowest median total latency on ChromaDB at 10022.94 ms.
- Dataset 2 (mxbai-embed-large) has its fastest retrieval on ChromaDB at 24.60 ms mean retrieval time.
- Dataset 2 (mxbai-embed-large) has its lowest median total latency on ChromaDB at 4488.43 ms.

## Cross-Embedding Comparison

| Embedding | Database | Retrieval Median (ms) | Retrieval Mean (ms) | Total Median (ms) | Total Mean (ms) | Precision | Hit@K | F1 | Retrieval Winner | Source File |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mxbai-embed-large | ChromaDB | 23.41 | 24.60 | 4488.43 | 4959.45 | 30.40% | 67.00% | 39.42% | Yes | benchmark_full_20260506_114940.json |
| mxbai-embed-large | PostgreSQL | 75.95 | 76.81 | 4490.15 | 5023.10 | 30.40% | 67.00% | 39.42% | No | benchmark_full_20260506_114940.json |
| mxbai-embed-large | Pinecone | 282.93 | 336.53 | 4939.84 | 5696.68 | 30.40% | 67.00% | 39.42% | No | benchmark_full_20260506_114940.json |
| qwen3-embedding:8b | ChromaDB | 2040.17 | 2054.40 | 10022.94 | 10544.27 | 49.00% | 93.00% | 60.16% | Yes | benchmark_full_20260506_171446.json |
| qwen3-embedding:8b | PostgreSQL | 2060.06 | 2072.25 | 10214.05 | 10642.66 | 49.00% | 93.00% | 60.16% | No | benchmark_full_20260506_171446.json |
| qwen3-embedding:8b | Pinecone | 2309.22 | 2364.41 | 10487.88 | 10850.46 | 49.00% | 93.00% | 60.16% | No | benchmark_full_20260506_171446.json |

### mxbai-embed-large

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 24.60 | 4488.43 | 30.40% | 67.00% | 39.42% |
| PostgreSQL | 76.81 | 4490.15 | 30.40% | 67.00% | 39.42% |
| Pinecone | 336.53 | 4939.84 | 30.40% | 67.00% | 39.42% |

### qwen3-embedding:8b

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 2054.40 | 10022.94 | 49.00% | 93.00% | 60.16% |
| PostgreSQL | 2072.25 | 10214.05 | 49.00% | 93.00% | 60.16% |
| Pinecone | 2364.41 | 10487.88 | 49.00% | 93.00% | 60.16% |

## Dataset 1 - qwen3-embedding:8b

Source of record: `Data Benchmark/benchmark_full_20260506_171446.json`

Matching raw source files: `benchmark_full_20260506_171446.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-05-06T17:14:46.586577 |
| llm_model | gemma4:e4b |
| embedding_model | qwen3-embedding:8b |
| num_queries | 100 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | N/A |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 25 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (2054.40 ms mean retrieval), while Pinecone is the slowest (2364.41 ms).
- ChromaDB has the lowest median end-to-end latency at 10022.94 ms.
- Pinecone has the highest p95 total latency at 14037.07 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 60.16%.

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 2364.41 | 2589.46 | 10850.46 | 10487.88 | 14037.07 | 7299.83 | 18153.12 | 8486.05 |
| PostgreSQL | 2072.25 | 2288.90 | 10642.66 | 10214.05 | 14005.87 | 8000.49 | 18235.54 | 8570.41 |
| ChromaDB | 2054.40 | 2279.15 | 10544.27 | 10022.94 | 13843.27 | 7028.99 | 19509.54 | 8489.88 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 500 | 2364.41 | 10850.46 |
| PostgreSQL | answerable | 500 | 2072.25 | 10642.66 |
| ChromaDB | answerable | 500 | 2054.40 | 10544.27 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 49.00% | 93.00% | 60.16% | 100 |
| PostgreSQL | 49.00% | 93.00% | 60.16% | 100 |
| ChromaDB | 49.00% | 93.00% | 60.16% | 100 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 2338.02 | 2561.86 | 10838.21 | 14229.66 |
| Pinecone | 2 | 2365.43 | 2619.00 | 10827.44 | 14361.29 |
| Pinecone | 3 | 2375.38 | 2564.40 | 10882.40 | 13721.50 |
| Pinecone | 4 | 2351.91 | 2570.13 | 10780.30 | 13914.63 |
| Pinecone | 5 | 2391.32 | 2607.05 | 10923.96 | 14043.25 |
| PostgreSQL | 1 | 2062.80 | 2100.55 | 10734.62 | 14178.04 |
| PostgreSQL | 2 | 2054.57 | 2084.22 | 10684.57 | 14412.40 |
| PostgreSQL | 3 | 2081.32 | 2306.20 | 10636.15 | 13729.72 |
| PostgreSQL | 4 | 2072.62 | 2113.37 | 10511.14 | 13541.84 |
| PostgreSQL | 5 | 2089.92 | 2307.08 | 10646.81 | 13787.30 |
| ChromaDB | 1 | 2053.17 | 2287.70 | 10551.50 | 13858.17 |
| ChromaDB | 2 | 2045.14 | 2071.90 | 10565.11 | 13774.64 |
| ChromaDB | 3 | 2060.40 | 2296.22 | 10592.26 | 14002.52 |
| ChromaDB | 4 | 2057.48 | 2289.54 | 10570.26 | 13616.30 |
| ChromaDB | 5 | 2055.81 | 2252.44 | 10442.25 | 13868.13 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 400.18 | 400.18 | 400.18 | 83.37 | 336.59 | 561.80 | 10 |
| Pinecone | 2 | 5 | 368.66 | 368.66 | 368.66 | 28.48 | 340.45 | 413.79 | 10 |
| Pinecone | 3 | 5 | 388.86 | 388.86 | 388.86 | 32.98 | 358.42 | 443.39 | 10 |
| Pinecone | 5 | 5 | 362.47 | 362.47 | 362.47 | 20.90 | 339.53 | 395.13 | 10 |
| Pinecone | 8 | 5 | 377.10 | 377.10 | 377.10 | 39.49 | 342.31 | 443.03 | 10 |
| Pinecone | 10 | 5 | 387.96 | 387.96 | 387.96 | 30.29 | 342.66 | 427.24 | 10 |
| Pinecone | 15 | 5 | 394.49 | 394.49 | 394.49 | 35.39 | 361.53 | 458.26 | 10 |
| Pinecone | 20 | 5 | 387.99 | 387.99 | 387.99 | 46.43 | 348.30 | 470.44 | 10 |
| PostgreSQL | 1 | 5 | 90.36 | 90.36 | 90.36 | 1.22 | 88.16 | 91.83 | 10 |
| PostgreSQL | 2 | 5 | 91.07 | 91.07 | 91.07 | 0.64 | 89.94 | 91.77 | 10 |
| PostgreSQL | 3 | 5 | 92.15 | 92.15 | 92.15 | 1.82 | 89.92 | 95.49 | 10 |
| PostgreSQL | 5 | 5 | 93.67 | 93.67 | 93.67 | 0.50 | 92.89 | 94.21 | 10 |
| PostgreSQL | 8 | 5 | 95.61 | 95.61 | 95.61 | 0.78 | 94.76 | 97.09 | 10 |
| PostgreSQL | 10 | 5 | 97.53 | 97.53 | 97.53 | 1.06 | 96.15 | 98.51 | 10 |
| PostgreSQL | 15 | 5 | 100.80 | 100.80 | 100.80 | 1.24 | 99.30 | 102.66 | 10 |
| PostgreSQL | 20 | 5 | 103.65 | 103.65 | 103.65 | 1.30 | 102.07 | 105.22 | 10 |
| ChromaDB | 1 | 5 | 70.84 | 70.84 | 70.84 | 0.38 | 70.29 | 71.49 | 10 |
| ChromaDB | 2 | 5 | 71.02 | 71.02 | 71.02 | 0.82 | 69.89 | 72.31 | 10 |
| ChromaDB | 3 | 5 | 71.97 | 71.97 | 71.97 | 1.10 | 70.75 | 73.63 | 10 |
| ChromaDB | 5 | 5 | 71.62 | 71.62 | 71.62 | 0.99 | 70.60 | 73.42 | 10 |
| ChromaDB | 8 | 5 | 71.10 | 71.10 | 71.10 | 0.26 | 70.69 | 71.43 | 10 |
| ChromaDB | 10 | 5 | 71.40 | 71.40 | 71.40 | 0.74 | 70.49 | 72.34 | 10 |
| ChromaDB | 15 | 5 | 71.82 | 71.82 | 71.82 | 0.47 | 71.21 | 72.37 | 10 |
| ChromaDB | 20 | 5 | 71.57 | 71.57 | 71.57 | 0.53 | 70.98 | 72.40 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 388.03 | 345.41 | 587.18 | 37.13 | 349.30 | 450.85 | 25 |
| Pinecone | 10 | 5 | 363.61 | 339.87 | 426.56 | 31.88 | 338.99 | 426.63 | 25 |
| Pinecone | 15 | 5 | 372.28 | 336.33 | 591.91 | 38.08 | 344.05 | 446.93 | 25 |
| Pinecone | 20 | 5 | 379.73 | 336.60 | 557.41 | 45.65 | 343.20 | 469.71 | 25 |
| PostgreSQL | 5 | 5 | 76.35 | 74.28 | 90.71 | 2.01 | 74.57 | 80.25 | 25 |
| PostgreSQL | 10 | 5 | 76.69 | 74.01 | 90.64 | 3.63 | 74.39 | 83.92 | 25 |
| PostgreSQL | 15 | 5 | 76.06 | 74.16 | 89.63 | 2.21 | 74.47 | 80.42 | 25 |
| PostgreSQL | 20 | 5 | 76.57 | 73.93 | 90.49 | 3.41 | 74.61 | 83.37 | 25 |
| ChromaDB | 5 | 5 | 70.16 | 69.94 | 73.62 | 0.37 | 69.78 | 70.74 | 25 |
| ChromaDB | 10 | 5 | 71.37 | 69.78 | 74.44 | 2.88 | 69.29 | 77.08 | 25 |
| ChromaDB | 15 | 5 | 71.78 | 69.98 | 76.06 | 2.29 | 69.81 | 76.22 | 25 |
| ChromaDB | 20 | 5 | 71.50 | 70.00 | 76.51 | 1.32 | 70.73 | 74.14 | 25 |

## Dataset 2 - mxbai-embed-large

Source of record: `Data Benchmark/benchmark_full_20260506_114940.json`

Matching raw source files: `benchmark_full_20260506_114940.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-05-06T11:49:40.256343 |
| llm_model | gemma4:e4b |
| embedding_model | mxbai-embed-large |
| num_queries | 100 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | N/A |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 25 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (24.60 ms mean retrieval), while Pinecone is the slowest (336.53 ms).
- ChromaDB has the lowest median end-to-end latency at 4488.43 ms.
- Pinecone has the highest p95 total latency at 10839.80 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 39.42%.

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 336.53 | 527.62 | 5696.68 | 4939.84 | 10839.80 | 736.48 | 67573.19 | 5360.15 |
| PostgreSQL | 76.81 | 84.82 | 5023.10 | 4490.15 | 9478.59 | 426.68 | 16856.68 | 4946.28 |
| ChromaDB | 24.60 | 32.21 | 4959.45 | 4488.43 | 9516.51 | 372.74 | 16629.14 | 4934.85 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 500 | 336.53 | 5696.68 |
| PostgreSQL | answerable | 500 | 76.81 | 5023.10 |
| ChromaDB | answerable | 500 | 24.60 | 4959.45 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 30.40% | 67.00% | 39.42% | 100 |
| PostgreSQL | 30.40% | 67.00% | 39.42% | 100 |
| ChromaDB | 30.40% | 67.00% | 39.42% | 100 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 400.51 | 742.07 | 5172.90 | 7748.69 |
| Pinecone | 2 | 314.99 | 469.59 | 4227.42 | 6494.81 |
| Pinecone | 3 | 338.44 | 561.73 | 5224.64 | 7977.72 |
| Pinecone | 4 | 323.60 | 601.19 | 6880.45 | 11613.51 |
| Pinecone | 5 | 305.12 | 339.04 | 6978.00 | 12823.21 |
| PostgreSQL | 1 | 75.91 | 81.56 | 3936.42 | 7405.64 |
| PostgreSQL | 2 | 76.29 | 84.50 | 3858.83 | 6766.11 |
| PostgreSQL | 3 | 76.46 | 84.89 | 4356.89 | 7894.09 |
| PostgreSQL | 4 | 77.94 | 86.34 | 6554.56 | 11715.65 |
| PostgreSQL | 5 | 77.46 | 83.48 | 6408.77 | 11958.19 |
| ChromaDB | 1 | 24.56 | 32.64 | 3841.66 | 6826.92 |
| ChromaDB | 2 | 23.87 | 32.20 | 3775.49 | 6858.87 |
| ChromaDB | 3 | 23.72 | 31.27 | 4381.07 | 8937.15 |
| ChromaDB | 4 | 25.23 | 31.76 | 6397.97 | 10869.49 |
| ChromaDB | 5 | 25.62 | 32.24 | 6401.06 | 11958.99 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 295.42 | 295.42 | 295.42 | 13.47 | 282.78 | 318.53 | 10 |
| Pinecone | 2 | 5 | 293.12 | 293.12 | 293.12 | 9.87 | 284.19 | 310.64 | 10 |
| Pinecone | 3 | 5 | 312.23 | 312.23 | 312.23 | 20.01 | 286.43 | 336.73 | 10 |
| Pinecone | 5 | 5 | 306.93 | 306.93 | 306.93 | 17.20 | 291.86 | 335.49 | 10 |
| Pinecone | 8 | 5 | 344.10 | 344.10 | 344.10 | 75.40 | 290.95 | 490.10 | 10 |
| Pinecone | 10 | 5 | 298.57 | 298.57 | 298.57 | 11.06 | 288.93 | 312.84 | 10 |
| Pinecone | 15 | 5 | 301.97 | 301.97 | 301.97 | 11.51 | 289.84 | 320.85 | 10 |
| Pinecone | 20 | 5 | 311.24 | 311.24 | 311.24 | 24.88 | 290.25 | 355.16 | 10 |
| PostgreSQL | 1 | 5 | 76.72 | 76.72 | 76.72 | 2.54 | 72.58 | 79.96 | 10 |
| PostgreSQL | 2 | 5 | 74.20 | 74.20 | 74.20 | 1.48 | 72.39 | 76.83 | 10 |
| PostgreSQL | 3 | 5 | 79.94 | 79.94 | 79.94 | 4.51 | 74.41 | 87.92 | 10 |
| PostgreSQL | 5 | 5 | 76.43 | 76.43 | 76.43 | 1.62 | 74.32 | 77.98 | 10 |
| PostgreSQL | 8 | 5 | 78.97 | 78.97 | 78.97 | 1.65 | 75.96 | 80.48 | 10 |
| PostgreSQL | 10 | 5 | 78.89 | 78.89 | 78.89 | 2.52 | 75.64 | 81.09 | 10 |
| PostgreSQL | 15 | 5 | 80.87 | 80.87 | 80.87 | 2.16 | 77.30 | 84.07 | 10 |
| PostgreSQL | 20 | 5 | 80.26 | 80.26 | 80.26 | 2.83 | 78.32 | 85.85 | 10 |
| ChromaDB | 1 | 5 | 22.37 | 22.37 | 22.37 | 1.14 | 21.21 | 23.85 | 10 |
| ChromaDB | 2 | 5 | 21.90 | 21.90 | 21.90 | 1.03 | 20.76 | 23.58 | 10 |
| ChromaDB | 3 | 5 | 22.45 | 22.45 | 22.45 | 1.87 | 20.43 | 25.74 | 10 |
| ChromaDB | 5 | 5 | 22.92 | 22.92 | 22.92 | 1.83 | 21.20 | 25.91 | 10 |
| ChromaDB | 8 | 5 | 23.33 | 23.33 | 23.33 | 0.98 | 22.29 | 25.07 | 10 |
| ChromaDB | 10 | 5 | 23.51 | 23.51 | 23.51 | 1.07 | 21.96 | 24.74 | 10 |
| ChromaDB | 15 | 5 | 23.82 | 23.82 | 23.82 | 2.25 | 21.39 | 26.79 | 10 |
| ChromaDB | 20 | 5 | 23.39 | 23.39 | 23.39 | 2.45 | 21.56 | 28.14 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 335.26 | 300.35 | 483.56 | 40.90 | 305.19 | 416.23 | 25 |
| Pinecone | 10 | 5 | 319.38 | 293.98 | 415.45 | 23.85 | 297.85 | 357.63 | 25 |
| Pinecone | 15 | 5 | 338.17 | 304.29 | 459.07 | 27.27 | 303.04 | 377.43 | 25 |
| Pinecone | 20 | 5 | 320.33 | 297.52 | 403.73 | 21.54 | 297.70 | 359.71 | 25 |
| PostgreSQL | 5 | 5 | 72.06 | 67.22 | 105.73 | 0.78 | 71.13 | 73.46 | 25 |
| PostgreSQL | 10 | 5 | 72.51 | 68.01 | 107.61 | 0.88 | 71.40 | 73.84 | 25 |
| PostgreSQL | 15 | 5 | 71.19 | 67.69 | 100.84 | 0.41 | 70.45 | 71.56 | 25 |
| PostgreSQL | 20 | 5 | 71.17 | 66.44 | 104.61 | 1.52 | 69.79 | 74.06 | 25 |
| ChromaDB | 5 | 5 | 23.07 | 21.48 | 30.65 | 0.67 | 22.26 | 24.01 | 25 |
| ChromaDB | 10 | 5 | 24.57 | 21.85 | 31.40 | 3.44 | 21.81 | 31.11 | 25 |
| ChromaDB | 15 | 5 | 24.30 | 21.46 | 31.47 | 2.73 | 22.34 | 29.72 | 25 |
| ChromaDB | 20 | 5 | 23.02 | 21.17 | 29.87 | 1.80 | 21.42 | 26.51 | 25 |

## Interpretation Guardrails

- `Hit@K` and `avg_f1_score` in these files come from `answerable_retrieval_quality`, so they describe answerable-query retrieval behavior rather than the no-answer task.
- `no_answer_evaluation` should be cited separately from retrieval quality, because it measures abstention behavior rather than document relevance quality.
- Total latency is influenced by LLM generation variability and extreme outliers, so paper claims should usually anchor on retrieval mean, retrieval p95, total median, and total p95 together.
- The canonical site files and the matching `benchmark_full_*.json` files represent the same underlying benchmark runs in this workspace.

