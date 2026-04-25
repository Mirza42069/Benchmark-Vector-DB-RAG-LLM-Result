---
title: Benchmark Results For Paper
purpose: Source document for AI-assisted paper drafting and editing
generator: export-benchmark-results.mjs
generated_at: 2026-04-25T04:20:38.386Z
datasets:
  - Data Benchmark/benchmark result.json
  - Data Benchmark/benchmark result 2.json
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
| Dataset 1 | qwen3-embedding:8b | 2026-04-23T04:06:32.656114 | 120 | 5 | 5 | 0.75 | Data Benchmark/benchmark result.json | benchmark_full_20260423_040633.json |
| Dataset 2 | mxbai-embed-large | 2026-04-22T16:00:43.032992 | 120 | 5 | 5 | 0.75 | Data Benchmark/benchmark result 2.json | benchmark_full_20260422_160043.json |

## Paper-Ready Findings

- Across all three databases, `mxbai-embed-large` is between 7.8x and 76.7x faster than `qwen3-embedding:8b` on mean retrieval latency.
- Across all three databases, `qwen3-embedding:8b` has higher answerable-query retrieval quality than `mxbai-embed-large`, improving F1 by 21.78 to 21.78 percentage points and Hit@K by 25.00 to 25.00 percentage points.
- Dataset 1 (qwen3-embedding:8b) has its fastest retrieval on ChromaDB at 2024.71 ms mean retrieval time.
- Dataset 1 (qwen3-embedding:8b) has its lowest median total latency on PostgreSQL at 7312.58 ms.
- Dataset 2 (mxbai-embed-large) has its fastest retrieval on ChromaDB at 26.41 ms mean retrieval time.
- Dataset 2 (mxbai-embed-large) has its lowest median total latency on ChromaDB at 3984.45 ms.

## Cross-Embedding Comparison

| Embedding | Database | Retrieval Median (ms) | Retrieval Mean (ms) | Total Median (ms) | Total Mean (ms) | Precision | Hit@K | F1 | Retrieval Winner | Source File |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| mxbai-embed-large | ChromaDB | 24.21 | 26.41 | 3984.45 | 4479.85 | 32.33% | 68.33% | 41.42% | Yes | benchmark_full_20260422_160043.json |
| mxbai-embed-large | PostgreSQL | 77.70 | 78.74 | 4027.63 | 5483.39 | 32.33% | 68.33% | 41.42% | No | benchmark_full_20260422_160043.json |
| mxbai-embed-large | Pinecone | 282.75 | 300.81 | 4375.13 | 5096.38 | 32.33% | 68.33% | 41.42% | No | benchmark_full_20260422_160043.json |
| qwen3-embedding:8b | ChromaDB | 2015.01 | 2024.71 | 7317.50 | 9753.06 | 52.67% | 93.33% | 63.20% | Yes | benchmark_full_20260423_040633.json |
| qwen3-embedding:8b | PostgreSQL | 2036.55 | 2046.69 | 7312.58 | 8833.51 | 52.67% | 93.33% | 63.20% | No | benchmark_full_20260423_040633.json |
| qwen3-embedding:8b | Pinecone | 2284.02 | 2337.67 | 7617.72 | 9581.10 | 52.67% | 93.33% | 63.20% | No | benchmark_full_20260423_040633.json |

### mxbai-embed-large

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 26.41 | 3984.45 | 32.33% | 68.33% | 41.42% |
| PostgreSQL | 78.74 | 4027.63 | 32.33% | 68.33% | 41.42% |
| Pinecone | 300.81 | 4375.13 | 32.33% | 68.33% | 41.42% |

### qwen3-embedding:8b

| Database | Retrieval Mean (ms) | Total Median (ms) | Precision | Hit@K | F1 |
| --- | --- | --- | --- | --- | --- |
| ChromaDB | 2024.71 | 7317.50 | 52.67% | 93.33% | 63.20% |
| PostgreSQL | 2046.69 | 7312.58 | 52.67% | 93.33% | 63.20% |
| Pinecone | 2337.67 | 7617.72 | 52.67% | 93.33% | 63.20% |

## Dataset 1 - qwen3-embedding:8b

Source of record: `Data Benchmark/benchmark result.json`

Matching raw source files: `benchmark_full_20260423_040633.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-04-23T04:06:32.656114 |
| llm_model | qwen3:8b |
| embedding_model | qwen3-embedding:8b |
| num_queries | 120 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | 0.75 |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 15 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (2024.71 ms mean retrieval), while Pinecone is the slowest (2337.67 ms).
- PostgreSQL has the lowest median end-to-end latency at 7312.58 ms.
- PostgreSQL has the highest p95 total latency at 13154.36 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 63.20%.
- PostgreSQL has the highest no-answer abstention accuracy at 100.00%.
- Answerable queries are slower than no-answer queries on average (11138.65 ms vs 7639.79 ms mean total latency across databases).

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 2337.67 | 2542.49 | 9581.10 | 7617.72 | 12459.52 | 5954.84 | 464581.12 | 7243.43 |
| PostgreSQL | 2046.69 | 2102.45 | 8833.51 | 7312.58 | 13154.36 | 5679.56 | 410402.32 | 6786.82 |
| ChromaDB | 2024.71 | 2057.20 | 9753.06 | 7317.50 | 12461.15 | 5484.76 | 469382.01 | 7728.35 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 300 | 2336.02 | 11310.35 |
| Pinecone | no_answer | 300 | 2339.32 | 7851.84 |
| PostgreSQL | answerable | 300 | 2044.37 | 10096.98 |
| PostgreSQL | no_answer | 300 | 2049.00 | 7570.04 |
| ChromaDB | answerable | 300 | 2028.39 | 12008.63 |
| ChromaDB | no_answer | 300 | 2021.02 | 7497.48 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 52.67% | 93.33% | 63.20% | 60 |
| PostgreSQL | 52.67% | 93.33% | 63.20% | 60 |
| ChromaDB | 52.67% | 93.33% | 63.20% | 60 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 20.00% | 80.00% | 3.6167 | 60 |
| PostgreSQL | 100.00% | 0.00% | 0.0000 | 60 |
| ChromaDB | 100.00% | 0.00% | 0.0000 | 60 |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 2344.13 | 2551.82 | 9668.40 | 14817.04 |
| Pinecone | 2 | 2312.59 | 2523.89 | 8566.82 | 11833.25 |
| Pinecone | 3 | 2363.12 | 2628.50 | 9196.38 | 10926.48 |
| Pinecone | 4 | 2320.35 | 2512.26 | 8411.90 | 12459.52 |
| Pinecone | 5 | 2348.15 | 2538.93 | 12061.99 | 11897.30 |
| PostgreSQL | 1 | 2049.28 | 2098.10 | 8176.23 | 11587.26 |
| PostgreSQL | 2 | 2040.89 | 2068.04 | 8220.12 | 15569.44 |
| PostgreSQL | 3 | 2060.43 | 2290.70 | 8098.81 | 12187.17 |
| PostgreSQL | 4 | 2035.63 | 2066.23 | 8117.23 | 12159.02 |
| PostgreSQL | 5 | 2047.20 | 2243.11 | 11555.16 | 12932.42 |
| ChromaDB | 1 | 2041.58 | 2254.90 | 13546.51 | 12149.13 |
| ChromaDB | 2 | 2017.13 | 2040.67 | 8102.18 | 12574.53 |
| ChromaDB | 3 | 2024.31 | 2078.56 | 8048.36 | 11896.08 |
| ChromaDB | 4 | 2019.96 | 2049.00 | 8238.45 | 12470.41 |
| ChromaDB | 5 | 2020.55 | 2046.98 | 10829.78 | 12227.93 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 391.49 | 391.49 | 391.49 | 88.69 | 343.32 | 568.67 | 10 |
| Pinecone | 2 | 5 | 347.53 | 347.53 | 347.53 | 9.08 | 340.29 | 365.14 | 10 |
| Pinecone | 3 | 5 | 352.23 | 352.23 | 352.23 | 12.62 | 342.72 | 375.31 | 10 |
| Pinecone | 5 | 5 | 348.61 | 348.61 | 348.61 | 4.14 | 345.52 | 356.35 | 10 |
| Pinecone | 8 | 5 | 348.21 | 348.21 | 348.21 | 3.34 | 343.97 | 353.93 | 10 |
| Pinecone | 10 | 5 | 353.79 | 353.79 | 353.79 | 15.53 | 345.00 | 384.82 | 10 |
| Pinecone | 15 | 5 | 360.66 | 360.66 | 360.66 | 7.37 | 350.83 | 373.35 | 10 |
| Pinecone | 20 | 5 | 357.76 | 357.76 | 357.76 | 12.34 | 349.75 | 382.28 | 10 |
| PostgreSQL | 1 | 5 | 90.64 | 90.64 | 90.64 | 2.16 | 87.20 | 94.03 | 10 |
| PostgreSQL | 2 | 5 | 91.77 | 91.77 | 91.77 | 0.70 | 90.81 | 92.85 | 10 |
| PostgreSQL | 3 | 5 | 93.13 | 93.13 | 93.13 | 2.08 | 91.57 | 97.24 | 10 |
| PostgreSQL | 5 | 5 | 93.46 | 93.46 | 93.46 | 0.26 | 93.16 | 93.85 | 10 |
| PostgreSQL | 8 | 5 | 95.88 | 95.88 | 95.88 | 0.65 | 95.31 | 96.89 | 10 |
| PostgreSQL | 10 | 5 | 97.68 | 97.68 | 97.68 | 0.99 | 95.98 | 98.69 | 10 |
| PostgreSQL | 15 | 5 | 101.65 | 101.65 | 101.65 | 1.62 | 100.01 | 104.19 | 10 |
| PostgreSQL | 20 | 5 | 103.90 | 103.90 | 103.90 | 0.54 | 103.01 | 104.57 | 10 |
| ChromaDB | 1 | 5 | 71.16 | 71.16 | 71.16 | 0.39 | 70.79 | 71.92 | 10 |
| ChromaDB | 2 | 5 | 71.10 | 71.10 | 71.10 | 0.27 | 70.64 | 71.37 | 10 |
| ChromaDB | 3 | 5 | 71.41 | 71.41 | 71.41 | 0.46 | 70.87 | 71.98 | 10 |
| ChromaDB | 5 | 5 | 71.36 | 71.36 | 71.36 | 0.33 | 70.88 | 71.92 | 10 |
| ChromaDB | 8 | 5 | 71.65 | 71.65 | 71.65 | 0.58 | 71.04 | 72.75 | 10 |
| ChromaDB | 10 | 5 | 71.38 | 71.38 | 71.38 | 0.41 | 71.00 | 72.13 | 10 |
| ChromaDB | 15 | 5 | 72.03 | 72.03 | 72.03 | 0.59 | 71.32 | 72.96 | 10 |
| ChromaDB | 20 | 5 | 72.44 | 72.44 | 72.44 | 0.31 | 71.98 | 72.85 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 366.24 | 340.85 | 461.08 | 50.30 | 338.82 | 466.79 | 15 |
| Pinecone | 10 | 5 | 360.25 | 341.39 | 434.21 | 40.85 | 339.62 | 441.95 | 15 |
| Pinecone | 15 | 5 | 446.43 | 343.16 | 845.79 | 142.99 | 343.42 | 721.80 | 15 |
| Pinecone | 20 | 5 | 362.93 | 342.90 | 442.28 | 42.62 | 339.68 | 448.11 | 15 |
| PostgreSQL | 5 | 5 | 79.03 | 75.74 | 91.69 | 5.91 | 75.72 | 90.85 | 15 |
| PostgreSQL | 10 | 5 | 78.47 | 74.93 | 92.59 | 4.47 | 76.01 | 87.42 | 15 |
| PostgreSQL | 15 | 5 | 79.14 | 75.95 | 93.03 | 4.90 | 76.04 | 88.86 | 15 |
| PostgreSQL | 20 | 5 | 79.51 | 74.91 | 91.65 | 6.60 | 75.27 | 92.68 | 15 |
| ChromaDB | 5 | 5 | 70.31 | 70.24 | 73.75 | 0.42 | 69.87 | 70.92 | 15 |
| ChromaDB | 10 | 5 | 74.31 | 70.63 | 90.44 | 7.82 | 69.71 | 89.94 | 15 |
| ChromaDB | 15 | 5 | 75.56 | 70.29 | 97.35 | 9.10 | 70.63 | 93.75 | 15 |
| ChromaDB | 20 | 5 | 72.57 | 70.02 | 85.43 | 1.92 | 71.21 | 76.34 | 15 |

## Dataset 2 - mxbai-embed-large

Source of record: `Data Benchmark/benchmark result 2.json`

Matching raw source files: `benchmark_full_20260422_160043.json`

### Metadata

| Field | Value |
| --- | --- |
| benchmark_date | 2026-04-22T16:00:43.032992 |
| llm_model | qwen3:8b |
| embedding_model | mxbai-embed-large |
| num_queries | 120 |
| repetitions | 5 |
| top_k | 5 |
| score_threshold | 0.75 |
| scalability_doc_counts | 5, 10, 15, 20 |
| scalability_query_count | 15 |
| databases_tested | Pinecone, PostgreSQL, ChromaDB |

### Paper-Ready Findings

- ChromaDB is the fastest retrieval backend (26.41 ms mean retrieval), while Pinecone is the slowest (300.81 ms).
- ChromaDB has the lowest median end-to-end latency at 3984.45 ms.
- Pinecone has the highest p95 total latency at 8311.57 ms, which is the most conservative tail-latency figure in this dataset.
- Answerable-query retrieval quality is effectively tied across all three databases, with max F1 = 41.42%.
- ChromaDB has the highest no-answer abstention accuracy at 86.67%.
- Answerable queries are slower than no-answer queries on average (5743.44 ms vs 4296.31 ms mean total latency across databases).

### Speed Summary

| Database | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total Median (ms) | Total P95 (ms) | Min Total (ms) | Max Total (ms) | LLM Mean (ms) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 300.81 | 302.42 | 5096.38 | 4375.13 | 8311.57 | 2162.48 | 173358.85 | 4795.57 |
| PostgreSQL | 78.74 | 87.84 | 5483.39 | 4027.63 | 7940.45 | 1803.83 | 392090.70 | 5404.65 |
| ChromaDB | 26.41 | 34.06 | 4479.85 | 3984.45 | 8117.57 | 1751.01 | 17044.13 | 4453.43 |

### Query-Type Breakdown

| Database | Query Type | Queries Tested | Mean Retrieval (ms) | Mean Total (ms) |
| --- | --- | --- | --- | --- |
| Pinecone | answerable | 300 | 287.94 | 5667.64 |
| Pinecone | no_answer | 300 | 313.68 | 4525.12 |
| PostgreSQL | answerable | 300 | 78.65 | 6757.22 |
| PostgreSQL | no_answer | 300 | 78.82 | 4209.55 |
| ChromaDB | answerable | 300 | 27.54 | 4805.45 |
| ChromaDB | no_answer | 300 | 25.29 | 4154.25 |

### Answerable Retrieval Quality

| Database | Precision | Hit@K | F1 | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 32.33% | 68.33% | 41.42% | 60 |
| PostgreSQL | 32.33% | 68.33% | 41.42% | 60 |
| ChromaDB | 32.33% | 68.33% | 41.42% | 60 |

### No-Answer Evaluation

| Database | Abstention Accuracy | False Positive Rate | Average Docs Returned | Per-Query Rows |
| --- | --- | --- | --- | --- |
| Pinecone | 0.00% | 100.00% | 5.0000 | 60 |
| PostgreSQL | 28.33% | 71.67% | 3.2000 | 60 |
| ChromaDB | 86.67% | 13.33% | 0.3500 | 60 |

### Per-Repetition Stability

| Database | Repetition | Retrieval Mean (ms) | Retrieval P95 (ms) | Total Mean (ms) | Total P95 (ms) |
| --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 301.90 | 293.18 | 6040.61 | 7265.24 |
| Pinecone | 2 | 301.14 | 331.78 | 4787.58 | 7962.67 |
| Pinecone | 3 | 285.87 | 292.76 | 4996.06 | 8966.54 |
| Pinecone | 4 | 309.12 | 300.83 | 4746.89 | 8496.00 |
| Pinecone | 5 | 306.01 | 300.30 | 4910.77 | 8681.48 |
| PostgreSQL | 1 | 77.98 | 87.92 | 4415.46 | 7678.14 |
| PostgreSQL | 2 | 78.14 | 86.61 | 7877.54 | 9231.53 |
| PostgreSQL | 3 | 79.23 | 89.68 | 4484.91 | 7372.38 |
| PostgreSQL | 4 | 78.91 | 86.58 | 4731.81 | 7795.48 |
| PostgreSQL | 5 | 79.42 | 88.61 | 5907.21 | 8439.84 |
| ChromaDB | 1 | 24.91 | 32.36 | 4415.85 | 8068.31 |
| ChromaDB | 2 | 30.57 | 35.17 | 4574.28 | 8790.69 |
| ChromaDB | 3 | 24.96 | 31.88 | 4368.26 | 7017.32 |
| ChromaDB | 4 | 25.21 | 33.73 | 4514.13 | 8411.99 |
| ChromaDB | 5 | 26.42 | 34.96 | 4526.71 | 8118.19 |

### Top-K Sensitivity Summary

| Database | top_k | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 1 | 5 | 310.65 | 310.65 | 310.65 | 57.55 | 281.09 | 425.75 | 10 |
| Pinecone | 2 | 5 | 284.43 | 284.43 | 284.43 | 1.36 | 282.03 | 285.78 | 10 |
| Pinecone | 3 | 5 | 285.22 | 285.22 | 285.22 | 1.40 | 283.36 | 287.22 | 10 |
| Pinecone | 5 | 5 | 299.23 | 299.23 | 299.23 | 23.57 | 283.15 | 345.52 | 10 |
| Pinecone | 8 | 5 | 288.86 | 288.86 | 288.86 | 3.34 | 285.04 | 294.13 | 10 |
| Pinecone | 10 | 5 | 294.62 | 294.62 | 294.62 | 16.22 | 284.51 | 326.78 | 10 |
| Pinecone | 15 | 5 | 300.49 | 300.49 | 300.49 | 25.24 | 286.62 | 350.95 | 10 |
| Pinecone | 20 | 5 | 289.87 | 289.87 | 289.87 | 2.08 | 287.99 | 293.83 | 10 |
| PostgreSQL | 1 | 5 | 77.27 | 77.27 | 77.27 | 1.27 | 75.37 | 79.00 | 10 |
| PostgreSQL | 2 | 5 | 76.48 | 76.48 | 76.48 | 1.21 | 74.87 | 77.77 | 10 |
| PostgreSQL | 3 | 5 | 77.53 | 77.53 | 77.53 | 2.13 | 75.58 | 81.49 | 10 |
| PostgreSQL | 5 | 5 | 78.84 | 78.84 | 78.84 | 1.58 | 75.83 | 80.12 | 10 |
| PostgreSQL | 8 | 5 | 78.28 | 78.28 | 78.28 | 2.06 | 76.56 | 82.11 | 10 |
| PostgreSQL | 10 | 5 | 78.00 | 78.00 | 78.00 | 1.14 | 76.81 | 79.73 | 10 |
| PostgreSQL | 15 | 5 | 79.25 | 79.25 | 79.25 | 1.75 | 76.81 | 80.93 | 10 |
| PostgreSQL | 20 | 5 | 80.31 | 80.31 | 80.31 | 1.12 | 78.87 | 81.92 | 10 |
| ChromaDB | 1 | 5 | 24.65 | 24.65 | 24.65 | 1.09 | 23.77 | 26.76 | 10 |
| ChromaDB | 2 | 5 | 24.79 | 24.79 | 24.79 | 0.82 | 23.63 | 26.16 | 10 |
| ChromaDB | 3 | 5 | 24.20 | 24.20 | 24.20 | 1.21 | 21.96 | 25.21 | 10 |
| ChromaDB | 5 | 5 | 24.87 | 24.87 | 24.87 | 1.52 | 23.48 | 27.20 | 10 |
| ChromaDB | 8 | 5 | 24.38 | 24.38 | 24.38 | 1.09 | 23.48 | 26.41 | 10 |
| ChromaDB | 10 | 5 | 25.24 | 25.24 | 25.24 | 1.67 | 23.60 | 28.20 | 10 |
| ChromaDB | 15 | 5 | 24.55 | 24.55 | 24.55 | 2.03 | 23.41 | 28.60 | 10 |
| ChromaDB | 20 | 5 | 24.77 | 24.77 | 24.77 | 1.03 | 23.28 | 26.11 | 10 |

### Corpus-Size Scalability Summary

| Database | Doc Count | Runs | Mean Avg Time (ms) | Mean Median Time (ms) | Mean P95 Time (ms) | Std Avg Time (ms) | Min Avg Time (ms) | Max Avg Time (ms) | Query Count |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Pinecone | 5 | 5 | 301.02 | 278.68 | 382.91 | 35.71 | 277.23 | 371.07 | 15 |
| Pinecone | 10 | 5 | 292.57 | 279.07 | 347.10 | 26.81 | 277.36 | 346.12 | 15 |
| Pinecone | 15 | 5 | 312.68 | 288.31 | 415.81 | 31.98 | 286.44 | 360.49 | 15 |
| Pinecone | 20 | 5 | 298.60 | 281.56 | 362.22 | 29.86 | 280.52 | 358.13 | 15 |
| PostgreSQL | 5 | 5 | 70.70 | 68.88 | 81.65 | 2.32 | 67.95 | 74.32 | 15 |
| PostgreSQL | 10 | 5 | 70.43 | 68.96 | 79.63 | 1.18 | 69.03 | 71.92 | 15 |
| PostgreSQL | 15 | 5 | 71.05 | 69.43 | 82.86 | 1.95 | 68.63 | 73.56 | 15 |
| PostgreSQL | 20 | 5 | 69.21 | 68.42 | 75.79 | 1.31 | 67.18 | 70.85 | 15 |
| ChromaDB | 5 | 5 | 23.64 | 22.83 | 29.65 | 1.33 | 21.68 | 25.60 | 15 |
| ChromaDB | 10 | 5 | 24.87 | 22.54 | 35.53 | 2.74 | 22.38 | 30.19 | 15 |
| ChromaDB | 15 | 5 | 24.61 | 23.24 | 33.16 | 2.04 | 22.01 | 27.45 | 15 |
| ChromaDB | 20 | 5 | 24.01 | 22.74 | 31.30 | 1.46 | 22.23 | 26.37 | 15 |

## Interpretation Guardrails

- `Hit@K` and `avg_f1_score` in these files come from `answerable_retrieval_quality`, so they describe answerable-query retrieval behavior rather than the no-answer task.
- `no_answer_evaluation` should be cited separately from retrieval quality, because it measures abstention behavior rather than document relevance quality.
- Total latency is influenced by LLM generation variability and extreme outliers, so paper claims should usually anchor on retrieval mean, retrieval p95, total median, and total p95 together.
- The canonical site files and the matching `benchmark_full_*.json` files represent the same underlying benchmark runs in this workspace.

