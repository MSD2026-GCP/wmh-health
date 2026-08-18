# Wellness Tracker & Health Monitoring App (WMH)

Selamat datang di repositori resmi **Wellness Tracker & Health Monitoring App (WMH)**. Aplikasi ini dirancang sebagai pelacak kesehatan harian yang interaktif untuk membantu pengguna memantau target kalori harian, konsumsi makanan, pembakaran kalori dari olahraga, serta rasio asupan makronutrisi harian (Karbohidrat, Protein, Lemak) dengan antarmuka yang modern dan responsif.

Proyek ini dibangun khusus untuk memenuhi kebutuhan **Story 2.2: Ringkasan Nutrisi Harian (WMH-27)** pada ruang kerja digital **Workshop MSD - Health (WMH)**.

---

## Fitur Utama & Keunggulan

*   **Premium "Vibe Design" Aesthetic**:
    *   **Glassmorphism**: Desain kartu dengan efek transparansi murni (`backdrop-filter: blur(24px)`) di atas latar belakang gelap (*Slate Dark* `#0F172A`).
    *   **Mesh Glow Elements**: Pendaran efek cahaya beranimasi lembut di latar belakang yang memberikan kedalaman (*depth*) visual yang memukau.
*   **Visualisasi Sisa Kalori Dinamis**:
    *   Diagram sisa kalori harian melingkar berbasis **SVG Progress Ring** dengan transisi halus.
    *   Formula sisa kalori interaktif yang menyajikan kalkulasi real-time:
        $$\text{Sisa Kalori} = \text{Target Kalori} - \text{Kalori Makanan} + \text{Kalori Terbakar}$$
    *   Deteksi over-budget cerdas: jika kalori harian melebih batas target, lingkaran progress dan label sisa kalori otomatis bertransisi menjadi warna merah mawar (*danger rose* `#F43F5E`) dengan efek animasi getar yang memukau.
*   **Pelacak Makronutrisi Presisi**: Visualisasi progress bar dinamis dengan gradasi warna warna-warni yang menunjukkan persentase kecukupan gizi harian (Karbohidrat, Protein, dan Lemak).
*   **Sandbox Interactive Simulator**: Slider kontrol interaktif terintegrasi yang memungkinkan pengguna menyimulasikan perubahan data Target Kalori, Kalori Makanan, dan Kalori Terbakar untuk menguji keakuratan formula secara instan.
*   **Quick Log Simulation**: Tombol pencatatan cepat sekali klik untuk menambahkan asupan makanan (seperti 1 Porsi Nasi atau Dada Ayam) serta aktivitas olahraga (seperti Lari atau Berenang) secara instan.

---

## Struktur Berkas Proyek

```text
wmh-health/
├── .github/
│   └── workflows/
│       └── deploy.yml     # Workflow otomasi Build & Deploy ke GCP Cloud Run via GitHub Actions
├── index.html             # Struktur semantik layout utama aplikasi
├── index.css              # Aturan styling Vibe Design System & Glassmorphism
├── app.js                 # Pengolah logika state kalkulasi harian & interaksi visual
├── app.test.js            # Skrip pengujian otomatis (Unit Testing)
└── README.md              # Dokumentasi teknis proyek (berkas ini)
```

---

## Pengujian Unit (Unit Testing)

Aplikasi ini dilengkapi dengan pengujian unit otomatis mandiri untuk menjamin akurasi 100% dari logika matematika formula sisa kalori dan persentase makronutrisi.

Untuk menjalankan pengujian unit secara mandiri, gunakan perintah berikut di terminal lokal Anda:

```bash
node app.test.js
```

### Output Pengujian:
```text
=============================================================
  WELLNESS TRACKER UNIT TESTS - STORY 2.2 CALCULATOR CHECKS 
=============================================================

  ✅ PASSED: calculateRemaining: Should correctly calculate normal remaining calories
  ✅ PASSED: calculateRemaining: Should handle zero food and exercise cases
  ✅ PASSED: calculateRemaining: Should calculate negative remaining calories when over-budget
  ✅ PASSED: calculatePercentage: Should calculate remaining percentage correctly
  ...
  ✅ PASSED: Integration: Should verify default INITIAL_STATE matches requirements

=============================================================
                       TEST SUMMARY                          
=============================================================
  Total Tests : 12
  Passed      : 12
  Failed      : 0
=============================================================
 🎉 All tests passed successfully with 100% logic accuracy!
```

---

## Otomasi Alur Kerja (CI/CD GitHub Actions)

Repositori ini menyertakan konfigurasi deployment otomatis menggunakan GitHub Actions ([`deploy.yml`](.github/workflows/deploy.yml)) untuk melakukan build image Docker, melakukan push ke Google Artifact Registry, dan mendeploy aplikasi ke **Google Cloud Run** pada lingkungan Staging (`staging`) dan Production (`production`) secara dinamis berdasarkan trigger push cabang (`branch`):

*   **Cabang `development`** $\rightarrow$ Dideploy otomatis ke lingkungan **Staging** (`wmh-dashboard-dev`).
*   **Cabang `main`** $\rightarrow$ Dideploy otomatis ke lingkungan **Production** (`wmh-dashboard-prod`).

Workflow ini bersifat **fully reusable** dengan parameterisasi penuh tingkat tinggi; Anda hanya perlu menyesuaikan dua variabel lingkungan `PROJECT_KEY` dan `IMAGE_NAME` di bagian atas berkas untuk menggunakannya kembali di proyek lainnya.
