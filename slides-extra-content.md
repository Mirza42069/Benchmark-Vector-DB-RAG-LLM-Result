## Pengujian Kecepatan

Pengujian kecepatan mengukur waktu yang diperlukan sistem sejak pertanyaan diterima, dokumen dicari, hingga jawaban selesai dibuat. Satuan yang digunakan adalah milidetik (ms), dan nilai yang lebih rendah menunjukkan kinerja yang lebih cepat.

### Retrieval Time

- **Retrieval Time** = Waktu untuk mengubah pertanyaan menjadi embedding dan mencari dokumen yang paling mirip pada vector database.

- **Retrieval Mean** = Rata-rata waktu retrieval dari seluruh pertanyaan dan pengulangan. Nilai lebih rendah berarti proses pencarian dokumen lebih cepat.

- **Retrieval P95** = Batas waktu retrieval yang mencakup 95% permintaan. Sebanyak 5% permintaan dapat membutuhkan waktu lebih lama.

```text
Retrieval Mean = Jumlah seluruh retrieval time / Jumlah pengujian
```

### LLM Generation Time

- **LLM Time** = Waktu yang dibutuhkan model bahasa untuk menyusun jawaban berdasarkan dokumen hasil retrieval.

- **LLM Mean** = Rata-rata waktu pembuatan jawaban oleh LLM dari seluruh pertanyaan dan pengulangan.

### Total Response Time

- **Total Time** = Waktu keseluruhan dari pertanyaan diterima sampai jawaban selesai dibuat.

- **Total Mean** = Rata-rata total waktu respons dari seluruh pertanyaan dan pengulangan.

- **Total Median** = Nilai tengah total waktu respons. Median tidak terlalu dipengaruhi oleh respons yang sangat cepat atau sangat lambat.

- **Total P95** = Batas waktu yang mencakup 95% total respons. Metrik ini digunakan untuk melihat pengalaman pengguna pada kondisi lambat.

- **Minimum Total** = Total waktu respons tercepat yang tercatat selama pengujian.

- **Maximum Total** = Total waktu respons paling lambat yang tercatat selama pengujian.

- **Standard Deviation** = Tingkat variasi total waktu respons. Nilai rendah menunjukkan waktu respons yang lebih konsisten.

```text
Total Time = Retrieval Time + LLM Time

Total Mean = Jumlah seluruh total time / Jumlah pengujian
```

Pada DB Compare, database dengan Retrieval Mean paling rendah menjadi pemenang Retrieval, sedangkan database dengan Total Mean paling rendah menjadi pemenang Total.

### Reliability

- **Success Rate** = Persentase permintaan yang berhasil diselesaikan tanpa kegagalan.

- **Failed Rows** = Jumlah permintaan yang gagal diproses selama pengujian.

```text
Success Rate = (Jumlah permintaan berhasil / Total permintaan) x 100%
```

## Pengujian Skalabilitas

Pengujian skalabilitas mengukur kemampuan database mempertahankan kinerja ketika beban sistem bertambah. Beban ditingkatkan melalui jumlah dokumen yang diambil, ukuran corpus, dan jumlah pengguna bersamaan.

### Top-K Sensitivity

- **Top-K** = Jumlah dokumen paling relevan yang diambil untuk setiap pertanyaan. Pengujian menggunakan nilai `k = 1, 2, 3, 5, 8, 10, 15, dan 20`.

- **Average Time** = Rata-rata waktu retrieval pada nilai Top-K tertentu. Nilai lebih rendah berarti database lebih cepat.

- **Standard Deviation** = Variasi waktu retrieval antar-pengulangan. Nilai rendah menunjukkan kinerja yang lebih stabil.

- **Minimum Time** = Waktu rata-rata retrieval tercepat dari seluruh pengulangan.

- **Maximum Time** = Waktu rata-rata retrieval paling lambat dari seluruh pengulangan.

```text
Mean Average Time = Jumlah average time setiap run / Jumlah run

Top-K DB Compare = Mean Average Time pada max(k), yaitu k = 20
```

Database dengan waktu Top-K pada `k = 20` paling rendah menjadi pemenang Top-K.

### Corpus-Size Scalability

- **Corpus Size** = Tingkat ukuran koleksi dokumen yang digunakan dalam pengujian, yaitu 20, 40, 60, 80, dan 100.

- **Mean Average Time** = Rata-rata waktu retrieval dari seluruh pengulangan pada ukuran corpus tertentu.

- **Mean Median Time** = Rata-rata nilai tengah waktu retrieval dari seluruh pengulangan. Nilai ini tidak terlalu dipengaruhi oleh respons ekstrem.

- **Mean P95 Time** = Rata-rata batas waktu yang mencakup 95% proses retrieval pada setiap pengulangan.

- **Standard Average Time** = Variasi waktu rata-rata antar-pengulangan. Nilai rendah menunjukkan hasil pengujian yang konsisten.

- **Minimum Average Time** = Waktu rata-rata retrieval tercepat dari seluruh pengulangan.

- **Maximum Average Time** = Waktu rata-rata retrieval paling lambat dari seluruh pengulangan.

- **Query Count** = Jumlah pertanyaan yang dijalankan pada setiap tingkat ukuran corpus.

```text
Mean Average Time = Jumlah average time setiap run / Jumlah run

Corpus DB Compare = Mean Average Time pada max(corpus size), yaitu 100
```

Database dengan waktu retrieval pada ukuran corpus 100 paling rendah menjadi pemenang Corpus.

### Concurrent-User Scalability

- **Concurrent Users** = Jumlah pengguna yang mengirimkan permintaan secara bersamaan. Pengujian menggunakan 1, 3, dan 5 pengguna.

- **Runs** = Jumlah pengulangan pengujian pada setiap tingkat pengguna bersamaan.

- **Mean Latency** = Rata-rata waktu penyelesaian satu permintaan ketika beberapa pengguna mengakses sistem secara bersamaan. Nilai lebih rendah lebih baik.

- **P95 Latency** = Batas waktu yang dialami oleh 95% permintaan. Sebanyak 5% permintaan dapat lebih lambat.

- **P99 Latency** = Batas waktu yang dialami oleh 99% permintaan. Metrik ini menggambarkan kondisi latensi terburuk.

- **Throughput** = Jumlah permintaan yang dapat diselesaikan setiap detik, dinyatakan dalam request per second (RPS). Nilai lebih tinggi lebih baik.

- **Error Rate** = Persentase permintaan yang gagal dibandingkan dengan seluruh permintaan yang dikirimkan. Nilai lebih rendah lebih baik.

```text
Error Rate = (Jumlah permintaan gagal / Total permintaan) x 100%

Concurrent DB Compare = Mean Latency pada max(concurrent users), yaitu 5 pengguna
```

Database dengan Mean Latency pada lima pengguna paling rendah menjadi pemenang Concurrent.

### Resource Usage

- **Average CPU Usage** = Rata-rata persentase penggunaan prosesor selama pengujian.

- **Maximum CPU Usage** = Penggunaan prosesor tertinggi yang tercatat selama pengujian.

- **Average RAM Usage** = Rata-rata kapasitas memori utama yang digunakan selama pengujian.

- **Maximum RAM Usage** = Penggunaan memori utama tertinggi yang tercatat selama pengujian.

- **Average GPU Usage** = Rata-rata persentase penggunaan GPU selama pengujian.

- **Maximum GPU Usage** = Penggunaan GPU tertinggi yang tercatat selama pengujian.

- **Average VRAM Usage** = Rata-rata memori GPU yang digunakan selama pengujian.

- **Maximum VRAM Usage** = Penggunaan memori GPU tertinggi yang tercatat selama pengujian.

Catatan: CPU, RAM, GPU, dan VRAM diukur pada komputer yang menjalankan benchmark. Sumber daya server internal Pinecone tidak diukur secara langsung.

### Efficient

- **Efficient** = Skor gabungan dari latensi dan penggunaan sumber daya pada lima pengguna bersamaan. Nilai yang lebih tinggi menunjukkan efisiensi yang lebih baik.

- Semua komponen diperlakukan sebagai biaya. Karena itu, nilai latensi atau penggunaan sumber daya yang lebih rendah menghasilkan skor normalisasi yang lebih tinggi.

```text
NormalizedCost(x) = ((Nilai maksimum - x) / (Nilai maksimum - Nilai minimum)) x 100

Efficient = Jumlah(NormalizedMetric x Weight) / Jumlah bobot yang tersedia

Jika seluruh komponen tersedia:

Efficient =
  0.40 x NormalizedLatency +
  0.20 x NormalizedCPU +
  0.15 x NormalizedRAM +
  0.15 x NormalizedGPU +
  0.10 x NormalizedVRAM
```

Jika seluruh database memiliki nilai yang sama pada suatu komponen, skor normalisasi komponen tersebut adalah 100. Jika suatu komponen tidak tersedia, komponen dan bobotnya tidak digunakan, kemudian bobot yang tersisa dinormalisasi kembali.

Database dengan skor Efficient paling tinggi menjadi pemenang efisiensi.

## Pengujian Quality

Pengujian kualitas menggunakan DeepEval terhadap 10 pertanyaan yang sama untuk setiap database. Skor berada pada rentang 0 sampai 1 dan ditampilkan sebagai persentase pada website. Nilai lebih tinggi menunjukkan hasil yang lebih baik.

### Answer Relevancy

- **Answer Relevancy** = Mengukur apakah jawaban yang dihasilkan sesuai dan berhubungan langsung dengan pertanyaan pengguna.

- Nilai tinggi menunjukkan jawaban tetap membahas topik yang ditanyakan, tetapi tidak selalu menjamin fakta dalam jawaban sudah benar.

### Faithfulness

- **Faithfulness** = Mengukur apakah pernyataan dalam jawaban didukung oleh konteks dokumen hasil retrieval.

- Nilai tinggi menunjukkan jawaban tidak banyak menambahkan informasi yang tidak tersedia dalam konteks.

- Jawaban dapat memiliki Faithfulness tinggi tetapi tetap salah terhadap jawaban acuan apabila konteks yang ditemukan tidak tepat.

### Contextual Relevancy

- **Contextual Relevancy** = Mengukur seberapa relevan keseluruhan dokumen hasil retrieval terhadap pertanyaan.

- Nilai tinggi menunjukkan sebagian besar konteks yang ditemukan benar-benar membahas informasi yang ditanyakan.

### Contextual Precision

- **Contextual Precision** = Mengukur apakah dokumen yang relevan ditempatkan pada urutan atas hasil retrieval.

- Nilai tinggi menunjukkan dokumen yang paling berguna ditemukan lebih awal daripada dokumen yang tidak relevan.

### Contextual Recall

- **Contextual Recall** = Mengukur seberapa banyak fakta penting dari jawaban acuan berhasil ditemukan dalam konteks retrieval.

- Nilai tinggi menunjukkan informasi yang diperlukan untuk menjawab pertanyaan tersedia dalam dokumen yang diambil.

### Average Quality Score

- **Average Score** = Rata-rata skor suatu metrik dari 10 pertanyaan yang dievaluasi.

```text
Average Score = Jumlah skor 10 pertanyaan / 10
```

Istilah yang digunakan pada kartu utama Quality Metrics:

```text
P     = Contextual Precision
CR    = Contextual Recall
Faith = Faithfulness
```

DeepEval menggunakan penilaian berbasis model terhadap pertanyaan, konteks retrieval, jawaban aktual, dan jawaban yang diharapkan. Karena itu, skor quality bukan persentase pertanyaan yang dijawab benar dan bukan rumus TP/FP sederhana.

## Ringkasan Quality Metrics per Database

| Database | Answer Relevancy | Faithfulness | Contextual Relevancy | Contextual Precision | Contextual Recall |
|---|---:|---:|---:|---:|---:|
| PostgreSQL | **100.00%** | 78.33% | 24.12% | **50.42%** | 66.67% |
| ChromaDB | 90.00% | 71.67% | **27.30%** | 47.43% | 76.67% |
| SQLite | **100.00%** | 80.00% | 23.98% | 46.32% | 66.67% |
| LanceDB | 81.67% | 76.67% | 25.62% | 44.04% | 66.67% |
| Qdrant | 73.33% | **90.00%** | 24.15% | 44.04% | 66.67% |
| Pinecone | 80.00% | 76.67% | 26.38% | 47.38% | **80.00%** |

# PERTANYAAN, JAWABAN BENAR, DAN JAWABAN SETIAP DATABASE

Verdict pada bagian ini membandingkan isi jawaban dengan fakta pada `expected_output`. Verdict tidak diambil langsung dari skor DeepEval karena faithfulness atau relevancy yang tinggi tidak selalu berarti jawaban akhirnya benar.

## Pertanyaan 1

**Pertanyaan:** Kapan jadwal pengajuan Batch I insentif publikasi terindeks tahun 2026?

**Jawaban benar:** Batch I dibuka pada **17 Maret 2026 sampai 6 April 2026**.

**Dokumen acuan:** `PD-DRPM-ITS-005-Panduan-Insentif-Publikasi-Terindeks-Dana-ITS-Tahun-2026.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | 10 Maret sampai 4 April 2026. | Salah |
| ChromaDB | 10 Maret sampai 4 April 2026. | Salah |
| SQLite | 10 Maret sampai 4 April 2026. | Salah |
| LanceDB | 10 Maret sampai 4 April 2026. | Salah |
| Qdrant | 10 Maret sampai 4 April 2026. | Salah |
| Pinecone | Informasi insentif tidak ditemukan; memberikan jadwal proposal 10 Maret sampai 4 April 2026. | Salah |

Semua database mengambil jadwal kegiatan yang berbeda dari jadwal insentif publikasi yang ditanyakan.

## Pertanyaan 2

**Pertanyaan:** Berapa insentif untuk artikel Q1 dengan persentil minimal 90 dan co-author luar negeri?

**Jawaban benar:** Insentifnya adalah **Rp35.000.000** untuk artikel Q1 dengan persentil minimal 90 dan co-author luar negeri.

**Dokumen acuan:** `PD-DRPM-ITS-005-Panduan-Insentif-Publikasi-Terindeks-Dana-ITS-Tahun-2026.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Rp35.000.000. | Benar |
| ChromaDB | Rp35.000.000. | Benar |
| SQLite | Rp35.000.000. | Benar |
| LanceDB | Rp35.000.000. | Benar |
| Qdrant | Rp35.000.000. | Benar |
| Pinecone | Rp35.000.000. | Benar |

## Pertanyaan 3

**Pertanyaan:** Dua luaran publikasi apa yang wajib dihasilkan peserta Post-Doctoral 2026?

**Jawaban benar:** Satu artikel jurnal internasional **Scopus Q1 dengan persentil 90%** dan satu **artikel review minimal Scopus Q2**.

**Dokumen acuan:** `Post-Doctoral-2026-1-1.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Satu artikel Scopus Q1 90% dan satu artikel review minimal Scopus Q2. | Benar |
| ChromaDB | Satu artikel Scopus Q1 90% dan satu artikel review minimal Scopus Q2. | Benar |
| SQLite | Satu artikel Scopus Q1 90% dan satu artikel review minimal Scopus Q2. | Benar |
| LanceDB | Satu artikel Scopus Q1 dan satu artikel review minimal Scopus Q2, tanpa menyebut persentil 90%. | Sebagian benar |
| Qdrant | Satu artikel Scopus Q1 90% dan satu artikel review minimal Scopus Q2. | Benar |
| Pinecone | Satu artikel Scopus Q1 dan satu artikel review minimal Scopus Q2, tanpa menyebut persentil 90%. | Sebagian benar |

## Pertanyaan 4

**Pertanyaan:** Berapa periode maksimal histori saldo yang dapat dilihat pada menu balance history MCM 2.0?

**Jawaban benar:** Histori saldo dapat dilihat maksimal **12 bulan**, dengan periode setiap inquiry maksimal **1 bulan**.

**Dokumen acuan:** `Buku-Panduan-untuk-Corporate-User.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Informasi tidak terdapat dalam konteks. | Salah |
| ChromaDB | Informasi tidak terdapat dalam konteks. | Salah |
| SQLite | Informasi tidak terdapat dalam konteks. | Salah |
| LanceDB | Informasi tidak ditemukan; menambahkan informasi tidak terkait tentang rekening tiga bulan terakhir. | Salah |
| Qdrant | Informasi tidak terdapat dalam konteks. | Salah |
| Pinecone | Informasi tidak terdapat dalam konteks. | Salah |

## Pertanyaan 5

**Pertanyaan:** Opsi jadwal apa saja yang tersedia pada fitur Auto Report di Kopra by Mandiri?

**Jawaban benar:** Pilihan jadwalnya adalah **One Time, Daily, Weekly, dan Monthly**.

**Dokumen acuan:** `Panduan-Kopra-by-Mandiri-Reports-Cek-Saldo.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Informasi Auto Report tidak terdapat dalam konteks. | Salah |
| ChromaDB | Informasi Auto Report tidak terdapat dalam konteks. | Salah |
| SQLite | Informasi Auto Report tidak terdapat dalam konteks. | Salah |
| LanceDB | Informasi opsi jadwal tidak terdapat dalam konteks. | Salah |
| Qdrant | Informasi Auto Report tidak terdapat dalam konteks. | Salah |
| Pinecone | Informasi Auto Report tidak terdapat dalam konteks. | Salah |

## Pertanyaan 6

**Pertanyaan:** Berapa persentil Scopus yang digunakan untuk mendefinisikan publikasi Top Tier pada panduan EQUITY WCU 2026?

**Jawaban benar:** Publikasi Top Tier berada pada **top 10%**, yaitu **persentil Scopus minimal 90 atau >= 90%**.

**Dokumen acuan:** `PD-DRPM-ITS-026-Panduan-Insentif-Publikasi-Top-Tiers-Dana-EQUITY-WCU-Tahun-2026.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Persentil Scopus >= 90%. | Setara dan benar |
| ChromaDB | Persentil Scopus >= 90%. | Setara dan benar |
| SQLite | Persentil Scopus >= 90%. | Setara dan benar |
| LanceDB | Persentil Scopus >= 90%. | Setara dan benar |
| Qdrant | Scopus Q1 dengan persentil >= 90%. | Setara dan benar |
| Pinecone | Persentil Scopus >= 90%. | Setara dan benar |

`Top 10%` dan `persentil >= 90%` menyatakan ambang yang sama.

## Pertanyaan 7

**Pertanyaan:** Apa syarat H-index Scopus untuk pengusul SRG Tipe A?

**Jawaban benar:** Ketua pengusul harus merupakan dosen ITS dengan **H-index Scopus <= 4**.

**Dokumen acuan:** `2026_Panduan-Riset-Penugasan-ITS-SRG-1.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | H-index Scopus <= 4. | Benar |
| ChromaDB | Dosen ITS dengan H-index Scopus <= 4. | Benar |
| SQLite | Dosen ITS dengan H-index Scopus <= 4. | Benar |
| LanceDB | Dosen ITS dengan H-index Scopus <= 4. | Benar |
| Qdrant | Dosen ITS dengan H-index Scopus <= 4. | Benar |
| Pinecone | Dosen ITS dengan H-index Scopus <= 4. | Benar |

## Pertanyaan 8

**Pertanyaan:** Apa format email default mahasiswa ITS menurut panduan mahasiswa baru DPTSI 2025?

**Jawaban benar:** Format email default adalah **nrp@student.its.ac.id**.

**Dokumen acuan:** `Panduan-Mahasiswa-Baru-DPTSI-2025_revised-1.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | `nrp@student.its.ac.id` | Benar |
| ChromaDB | `nrp@student.its.ac.id` | Benar |
| SQLite | `nrp@student.its.ac.id` | Benar |
| LanceDB | `nrp@student.its.ac.id` | Benar |
| Qdrant | `nrp@student.its.ac.id` | Benar |
| Pinecone | `nrp@student.its.ac.id` | Benar |

## Pertanyaan 9

**Pertanyaan:** Jam berapa layanan kereta MRT Jakarta mulai beroperasi setiap hari?

**Jawaban benar:** Layanan MRT Jakarta mulai beroperasi setiap hari pukul **05.00**.

**Dokumen acuan:** `MAN 01 - Perjanjian Angkutan dengan Penumpang 2021.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Informasi jam operasional tidak terdapat dalam konteks. | Salah |
| ChromaDB | Informasi jam operasional tidak terdapat dalam konteks. | Salah |
| SQLite | Informasi jam operasional tidak terdapat dalam konteks. | Salah |
| LanceDB | Informasi jam operasional tidak terdapat dalam konteks. | Salah |
| Qdrant | Informasi jam operasional tidak terdapat dalam konteks. | Salah |
| Pinecone | Informasi jam operasional tidak terdapat dalam konteks. | Salah |

## Pertanyaan 10

**Pertanyaan:** Kapan periode penerimaan proposal PMKI 2026?

**Jawaban benar:** Periode penerimaan proposal PMKI adalah **13 Februari sampai 7 Maret 2026**.

**Dokumen acuan:** `Panduan-PMKI_ITS_2026-1.pdf`

| Database | Jawaban database | Verdict |
|---|---|---|
| PostgreSQL | Informasi periode PMKI tidak terdapat dalam konteks. | Salah |
| ChromaDB | Informasi periode PMKI tidak terdapat dalam konteks. | Salah |
| SQLite | Batch I 10 Maret sampai 4 April 2026 dan Batch II 20 April sampai 4 Mei 2026. | Salah |
| LanceDB | Informasi periode PMKI tidak terdapat dalam konteks. | Salah |
| Qdrant | Informasi periode PMKI tidak terdapat dalam konteks. | Salah |
| Pinecone | Informasi periode PMKI tidak terdapat dalam konteks. | Salah |

## Ringkasan Ketepatan Jawaban

| Pertanyaan | Hasil umum |
|---|---|
| 1 | Semua database salah karena mengambil jadwal kegiatan lain. |
| 2 | Semua database benar. |
| 3 | PostgreSQL, ChromaDB, SQLite, dan Qdrant benar; LanceDB dan Pinecone sebagian benar. |
| 4 | Semua database salah. |
| 5 | Semua database salah. |
| 6 | Semua database memberikan jawaban yang setara dan benar. |
| 7 | Semua database benar. |
| 8 | Semua database benar. |
| 9 | Semua database salah. |
| 10 | Semua database salah. |

Temuan ini menunjukkan bahwa skor quality metric harus dibaca bersama jawaban aktual. Sebagai contoh, jawaban yang menyatakan informasi tidak tersedia dapat memperoleh Answer Relevancy atau Faithfulness tinggi, tetapi tetap salah jika dibandingkan dengan jawaban yang diharapkan.
