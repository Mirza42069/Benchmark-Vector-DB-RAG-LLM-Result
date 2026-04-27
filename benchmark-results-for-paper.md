---
title: Benchmark Results For Paper
purpose: Source document for AI-assisted paper drafting and editing
generator: export-benchmark-results.mjs
generated_at: 2026-04-27T13:16:12.212Z
datasets:
  - Data Benchmark/benchmark_full_20260426_201137.json
  - Data Benchmark/benchmark_full_20260427_200941.json
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
| Dataset 1 | qwen3-embedding:8b | 2026-04-26T20:11:37.169821 | 100 | 5 | 5 | N/A | Data Benchmark/benchmark_full_20260426_201137.json | benchmark_full_20260426_201137.json |
| Dataset 2 | mxbai-embed-large | 2026-04-27T20:09:40.985535 | 100 | 5 | 5 | N/A | Data Benchmark/benchmark_full_20260427_200941.json | benchmark_full_20260427_200941.json |

## Paper-Ready Findings

- Across all three databases, `mxbai-embed-large` is between 7.1x and 85.1x faster than `qwen3-embedding:8b` on mean retrieval latency.
- Across all three databases, `qwen3-embedding:8b` has higher answerable-query retrieval quality than `mxbai-embed-large`, improving F1 by 21.78 to 21.78 percentage points and Hit@K by 25.00 to 25.00 percentage points.
- Dataset 1 (qwen3-embedding:8b) has its fastest retrieval on ChromaDB at 2017.26 ms mean retrieval time.
- Dataset 1 (qwen3-embedding:8b) has its lowest median total latency on PostgreSQL at 7428.89 ms.
- Dataset 2 (mxbai-embed-large) has its fastest retrieval on ChromaDB at 23.71 ms mean retrieval time.
- Dataset 2 (mxbai-embed-large) has its lowest median total latency on ChromaDB at 3180.87 ms.

## Cross-Embedding Comparison

| Embedding | Database | Retrieval Median (ms) | Retrieval Mean (ms) | Total Median (ms) | Total Mean (ms) | Precision | Hit@K | F1 | Retrieval Winner | Source File |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mxbai-embed-large | ChromaDB | 22.83 | 23.71 | 3180.87 | 3690.40 | 32.33% | 68.33% | 41.42% | Yes | benchmark_full_20260427_200941.json |
| mxbai-embed-large | PostgreSQL | 75.41 | 76.46 | 3247.85 | 3722.08 | 32.33% | 68.33% | 41.42% | No | benchmark_full_20260427_200941.json |
| mxbai-embed-large | Pinecone | 288.03 | 339.17 | 3577.19 | 4142.32 | 32.33% | 68.33% | 41.42% | No | benchmark_full_20260427_200941.json |
| qwen3-embedding:8b | ChromaDB | 2010.02 | 2017.26 | 7495.94 | 10134.85 | 52.67% | 93.33% | 63.20% | Yes | benchmark_full_20260426_201137.json |
| qwen3-embedding:8b | PostgreSQL | 2030.78 | 2047.04 | 7428.89 | 9244.96 | 52.67% | 93.33% | 63.20% | No | benchmark_full_20260426_201137.json |
| qwen3-embedding:8b | Pinecone | 2283.56 | 2408.71 | 7892.04 | 10355.21 | 52.67% | 93.33% | 63.20% | No | benchmark_full_20260426_201137.json |

### mxbai-embed-large

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 23.71 | 3180.87 | 32.33% | 68.33% | 41.42% |
| PostgreSQL | 76.46 | 3247.85 | 32.33% | 68.33% | 41.42% |
| Pinecone | 339.17 | 3577.19 | 32.33% | 68.33% | 41.42% |

### qwen3-embedding:8b

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 2017.26 | 7495.94 | 52.67% | 93.33% | 63.20% |
| PostgreSQL | 2047.04 | 7428.89 | 52.67% | 93.33% | 63.20% |
| Pinecone | 2408.71 | 7892.04 | 52.67% | 93.33% | 63.20% |

## Dataset 1 - qwen3-embedding:8b

Source of record: `Data Benchmark/benchmark_full_20260426_201137.json`

Matching raw source files: `benchmark_full_20260426_201137.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-04-26T20:11:37.169821 |
| llm_model | qwen3:8b |
| embedding_model | qwen3-embedding:8b |
| num_queries | 100 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | N/A |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 15 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (2017.26 ms mean retrieval), while Pinecone is the slowest (2408.71 ms).
- PostgreSQL has the lowest median end-to-end latency at 7428.89 ms.
- PostgreSQL has the highest p95 total latency at 17194.87 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 63.20%.

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 2408.71 | 3036.88 | 10355.21 | 7892.04 | 16916.00 | 5814.92 | 339711.12 | 7946.50 |
| PostgreSQL | 2047.04 | 2271.61 | 9244.96 | 7428.89 | 17194.87 | 5485.70 | 204454.37 | 7197.92 |
| ChromaDB | 2017.26 | 2246.65 | 10134.85 | 7495.94 | 16302.22 | 5555.89 | 433814.82 | 8117.60 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 500 | 2408.71 | 10355.21 |
| PostgreSQL | answerable | 500 | 2047.04 | 9244.96 |
| ChromaDB | answerable | 500 | 2017.26 | 10134.85 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 52.67% | 93.33% | 63.20% | 60 |
| PostgreSQL | 52.67% | 93.33% | 63.20% | 60 |
| ChromaDB | 52.67% | 93.33% | 63.20% | 60 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 2390.53 | 2755.32 | 9960.34 | 15902.53 |
| Pinecone | 2 | 2398.69 | 2808.60 | 11883.12 | 14290.35 |
| Pinecone | 3 | 2438.55 | 4027.18 | 11449.43 | 16915.62 |
| Pinecone | 4 | 2422.89 | 2918.40 | 9521.58 | 19587.71 |
| Pinecone | 5 | 2392.88 | 2684.13 | 8961.56 | 15656.66 |
| PostgreSQL | 1 | 2053.73 | 2274.00 | 8662.79 | 15321.06 |
| PostgreSQL | 2 | 2044.07 | 2084.22 | 8664.37 | 17209.54 |
| PostgreSQL | 3 | 2035.55 | 2055.31 | 11536.80 | 17760.93 |
| PostgreSQL | 4 | 2052.70 | 2297.58 | 8729.36 | 16889.08 |
| PostgreSQL | 5 | 2049.18 | 2270.73 | 8631.49 | 16742.66 |
| ChromaDB | 1 | 2026.08 | 2253.30 | 8493.33 | 16485.63 |
| ChromaDB | 2 | 2012.45 | 2037.88 | 8469.90 | 16008.52 |
| ChromaDB | 3 | 2022.41 | 2246.33 | 15406.75 | 16441.73 |
| ChromaDB | 4 | 2031.46 | 2241.28 | 8435.99 | 15779.56 |
| ChromaDB | 5 | 1993.89 | 2260.88 | 9868.28 | 17871.76 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 400.17 | 400.17 | 400.17 | 89.07 | 336.88 | 566.04 | 10 |
| Pinecone | 2 | 5 | 395.71 | 395.71 | 395.71 | 53.07 | 339.99 | 481.49 | 10 |
| Pinecone | 3 | 5 | 369.99 | 369.99 | 369.99 | 36.35 | 337.36 | 440.94 | 10 |
| Pinecone | 5 | 5 | 354.12 | 354.12 | 354.12 | 18.66 | 336.83 | 388.31 | 10 |
| Pinecone | 8 | 5 | 405.58 | 405.58 | 405.58 | 62.56 | 354.17 | 516.28 | 10 |
| Pinecone | 10 | 5 | 372.94 | 372.94 | 372.94 | 25.76 | 341.41 | 397.24 | 10 |
| Pinecone | 15 | 5 | 423.60 | 423.60 | 423.60 | 47.07 | 343.34 | 482.81 | 10 |
| Pinecone | 20 | 5 | 373.82 | 373.82 | 373.82 | 28.48 | 343.18 | 425.46 | 10 |
| PostgreSQL | 1 | 5 | 89.27 | 89.27 | 89.27 | 0.70 | 88.01 | 89.98 | 10 |
| PostgreSQL | 2 | 5 | 90.02 | 90.02 | 90.02 | 0.57 | 89.27 | 90.81 | 10 |
| PostgreSQL | 3 | 5 | 91.15 | 91.15 | 91.15 | 0.36 | 90.63 | 91.54 | 10 |
| PostgreSQL | 5 | 5 | 91.50 | 91.50 | 91.50 | 0.77 | 90.54 | 92.54 | 10 |
| PostgreSQL | 8 | 5 | 95.51 | 95.51 | 95.51 | 1.58 | 93.77 | 98.42 | 10 |
| PostgreSQL | 10 | 5 | 95.65 | 95.65 | 95.65 | 0.15 | 95.53 | 95.95 | 10 |
| PostgreSQL | 15 | 5 | 99.90 | 99.90 | 99.90 | 0.98 | 98.77 | 101.74 | 10 |
| PostgreSQL | 20 | 5 | 103.15 | 103.15 | 103.15 | 1.29 | 102.20 | 105.66 | 10 |
| ChromaDB | 1 | 5 | 69.96 | 69.96 | 69.96 | 0.31 | 69.57 | 70.47 | 10 |
| ChromaDB | 2 | 5 | 70.16 | 70.16 | 70.16 | 0.52 | 69.42 | 70.71 | 10 |
| ChromaDB | 3 | 5 | 70.12 | 70.12 | 70.12 | 0.48 | 69.73 | 71.03 | 10 |
| ChromaDB | 5 | 5 | 70.66 | 70.66 | 70.66 | 0.77 | 69.34 | 71.73 | 10 |
| ChromaDB | 8 | 5 | 70.30 | 70.30 | 70.30 | 0.21 | 70.06 | 70.66 | 10 |
| ChromaDB | 10 | 5 | 70.46 | 70.46 | 70.46 | 0.36 | 69.93 | 70.97 | 10 |
| ChromaDB | 15 | 5 | 71.09 | 71.09 | 71.09 | 0.35 | 70.47 | 71.47 | 10 |
| ChromaDB | 20 | 5 | 70.92 | 70.92 | 70.92 | 0.82 | 70.00 | 72.43 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 413.37 | 340.64 | 674.69 | 37.74 | 365.23 | 474.23 | 15 |
| Pinecone | 10 | 5 | 386.58 | 345.66 | 546.78 | 46.05 | 343.95 | 473.40 | 15 |
| Pinecone | 15 | 5 | 393.77 | 336.75 | 646.10 | 43.75 | 345.19 | 470.42 | 15 |
| Pinecone | 20 | 5 | 381.30 | 340.66 | 569.07 | 61.87 | 339.55 | 504.30 | 15 |
| PostgreSQL | 5 | 5 | 77.88 | 74.36 | 93.11 | 5.00 | 74.23 | 87.60 | 15 |
| PostgreSQL | 10 | 5 | 76.42 | 73.67 | 90.05 | 3.79 | 73.77 | 83.95 | 15 |
| PostgreSQL | 15 | 5 | 77.42 | 73.82 | 93.48 | 5.48 | 74.40 | 88.38 | 15 |
| PostgreSQL | 20 | 5 | 77.57 | 74.01 | 89.91 | 5.35 | 74.52 | 88.26 | 15 |
| ChromaDB | 5 | 5 | 69.50 | 68.93 | 73.95 | 1.41 | 68.50 | 72.27 | 15 |
| ChromaDB | 10 | 5 | 73.66 | 69.73 | 90.97 | 8.50 | 69.03 | 90.65 | 15 |
| ChromaDB | 15 | 5 | 73.92 | 69.26 | 93.48 | 9.62 | 69.04 | 93.16 | 15 |
| ChromaDB | 20 | 5 | 72.49 | 69.24 | 86.40 | 6.48 | 68.66 | 85.42 | 15 |

## Dataset 2 - mxbai-embed-large

Source of record: `Data Benchmark/benchmark_full_20260427_200941.json`

Matching raw source files: `benchmark_full_20260427_200941.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-04-27T20:09:40.985535 |
| llm_model | qwen3:8b |
| embedding_model | mxbai-embed-large |
| num_queries | 100 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | N/A |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 15 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (23.71 ms mean retrieval), while Pinecone is the slowest (339.17 ms).
- ChromaDB has the lowest median end-to-end latency at 3180.87 ms.
- Pinecone has the highest p95 total latency at 7275.97 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 41.42%.

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 339.17 | 663.03 | 4142.32 | 3577.19 | 7275.97 | 1770.87 | 20004.31 | 3803.15 |
| PostgreSQL | 76.46 | 84.48 | 3722.08 | 3247.85 | 6730.74 | 1478.02 | 9908.51 | 3645.63 |
| ChromaDB | 23.71 | 31.61 | 3690.40 | 3180.87 | 6629.15 | 1363.45 | 13192.99 | 3666.69 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 500 | 339.17 | 4142.32 |
| PostgreSQL | answerable | 500 | 76.46 | 3722.08 |
| ChromaDB | answerable | 500 | 23.71 | 3690.40 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 32.33% | 68.33% | 41.42% | 60 |
| PostgreSQL | 32.33% | 68.33% | 41.42% | 60 |
| ChromaDB | 32.33% | 68.33% | 41.42% | 60 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| N/A | N/A | N/A | N/A | N/A |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 338.97 | 679.34 | 4083.63 | 6822.19 |
| Pinecone | 2 | 344.10 | 517.11 | 4206.31 | 7376.49 |
| Pinecone | 3 | 317.38 | 453.95 | 4243.41 | 7278.83 |
| Pinecone | 4 | 383.75 | 897.64 | 4169.34 | 7332.57 |
| Pinecone | 5 | 311.64 | 336.41 | 4008.90 | 6940.44 |
| PostgreSQL | 1 | 77.02 | 85.84 | 3671.38 | 6021.27 |
| PostgreSQL | 2 | 75.89 | 81.55 | 3647.44 | 6666.16 |
| PostgreSQL | 3 | 77.04 | 84.32 | 3763.07 | 7464.15 |
| PostgreSQL | 4 | 77.02 | 85.09 | 3684.67 | 6605.25 |
| PostgreSQL | 5 | 75.31 | 80.82 | 3843.87 | 8118.31 |
| ChromaDB | 1 | 24.07 | 32.85 | 3841.89 | 7255.44 |
| ChromaDB | 2 | 22.83 | 29.39 | 3670.44 | 6713.87 |
| ChromaDB | 3 | 23.85 | 31.63 | 3668.29 | 6610.59 |
| ChromaDB | 4 | 24.56 | 31.69 | 3692.46 | 6476.76 |
| ChromaDB | 5 | 23.24 | 31.35 | 3578.92 | 6451.82 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 296.69 | 296.69 | 296.69 | 15.44 | 281.88 | 325.76 | 10 |
| Pinecone | 2 | 5 | 310.20 | 310.20 | 310.20 | 40.13 | 283.52 | 389.65 | 10 |
| Pinecone | 3 | 5 | 287.91 | 287.91 | 287.91 | 6.16 | 281.49 | 296.08 | 10 |
| Pinecone | 5 | 5 | 285.90 | 285.90 | 285.90 | 2.51 | 281.97 | 288.94 | 10 |
| Pinecone | 8 | 5 | 285.03 | 285.03 | 285.03 | 1.64 | 283.55 | 287.44 | 10 |
| Pinecone | 10 | 5 | 295.93 | 295.93 | 295.93 | 19.08 | 284.94 | 334.05 | 10 |
| Pinecone | 15 | 5 | 290.14 | 290.14 | 290.14 | 1.68 | 287.93 | 291.92 | 10 |
| Pinecone | 20 | 5 | 290.27 | 290.27 | 290.27 | 2.05 | 287.14 | 292.98 | 10 |
| PostgreSQL | 1 | 5 | 77.69 | 77.69 | 77.69 | 2.47 | 73.43 | 81.15 | 10 |
| PostgreSQL | 2 | 5 | 77.54 | 77.54 | 77.54 | 1.45 | 75.33 | 79.77 | 10 |
| PostgreSQL | 3 | 5 | 77.85 | 77.85 | 77.85 | 2.29 | 74.54 | 80.21 | 10 |
| PostgreSQL | 5 | 5 | 78.21 | 78.21 | 78.21 | 2.46 | 74.73 | 81.11 | 10 |
| PostgreSQL | 8 | 5 | 79.84 | 79.84 | 79.84 | 2.43 | 75.69 | 83.27 | 10 |
| PostgreSQL | 10 | 5 | 79.45 | 79.45 | 79.45 | 2.14 | 76.32 | 82.94 | 10 |
| PostgreSQL | 15 | 5 | 81.36 | 81.36 | 81.36 | 1.10 | 79.87 | 82.91 | 10 |
| PostgreSQL | 20 | 5 | 80.75 | 80.75 | 80.75 | 1.35 | 78.60 | 82.75 | 10 |
| ChromaDB | 1 | 5 | 23.90 | 23.90 | 23.90 | 0.93 | 22.89 | 25.32 | 10 |
| ChromaDB | 2 | 5 | 23.27 | 23.27 | 23.27 | 1.38 | 21.59 | 25.24 | 10 |
| ChromaDB | 3 | 5 | 24.15 | 24.15 | 24.15 | 1.33 | 22.55 | 25.91 | 10 |
| ChromaDB | 5 | 5 | 23.30 | 23.30 | 23.30 | 0.66 | 22.07 | 23.86 | 10 |
| ChromaDB | 8 | 5 | 24.41 | 24.41 | 24.41 | 0.85 | 23.35 | 25.41 | 10 |
| ChromaDB | 10 | 5 | 25.87 | 25.87 | 25.87 | 1.54 | 23.77 | 27.34 | 10 |
| ChromaDB | 15 | 5 | 25.30 | 25.30 | 25.30 | 1.40 | 23.44 | 27.62 | 10 |
| ChromaDB | 20 | 5 | 24.59 | 24.59 | 24.59 | 0.83 | 23.21 | 25.47 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 318.40 | 291.95 | 427.62 | 48.13 | 289.58 | 414.14 | 15 |
| Pinecone | 10 | 5 | 297.45 | 283.04 | 355.41 | 26.08 | 284.03 | 349.61 | 15 |
| Pinecone | 15 | 5 | 301.09 | 282.97 | 369.10 | 27.79 | 283.75 | 356.49 | 15 |
| Pinecone | 20 | 5 | 303.97 | 289.02 | 363.95 | 29.75 | 286.05 | 363.30 | 15 |
| PostgreSQL | 5 | 5 | 73.27 | 71.18 | 89.53 | 2.26 | 70.57 | 77.35 | 15 |
| PostgreSQL | 10 | 5 | 71.75 | 70.13 | 84.53 | 1.85 | 68.09 | 73.09 | 15 |
| PostgreSQL | 15 | 5 | 72.50 | 72.12 | 84.42 | 1.62 | 70.13 | 74.60 | 15 |
| PostgreSQL | 20 | 5 | 72.79 | 69.72 | 88.12 | 1.55 | 70.38 | 74.59 | 15 |
| ChromaDB | 5 | 5 | 23.76 | 22.52 | 29.64 | 1.58 | 21.46 | 25.18 | 15 |
| ChromaDB | 10 | 5 | 23.72 | 21.74 | 33.27 | 2.95 | 21.26 | 29.50 | 15 |
| ChromaDB | 15 | 5 | 24.76 | 22.43 | 35.37 | 1.66 | 22.58 | 27.47 | 15 |
| ChromaDB | 20 | 5 | 24.26 | 22.15 | 33.33 | 1.70 | 21.37 | 26.49 | 15 |

## Interpretation Guardrails

- `Hit@K` and `avg_f1_score` in these files come from `answerable_retrieval_quality`, so they describe answerable-query retrieval behavior rather than the no-answer task.
- `no_answer_evaluation` should be cited separately from retrieval quality, because it measures abstention behavior rather than document relevance quality.
- Total latency is influenced by LLM generation variability and extreme outliers, so paper claims should usually anchor on retrieval mean, retrieval p95, total median, and total p95 together.
- The canonical site files and the matching `benchmark_full_*.json` files represent the same underlying benchmark runs in this workspace.

