# 🚀 Portfolio — Data Enthusiast

Website portofolio personal dibangun dengan **Next.js 14**, **Tailwind CSS**, dan **Framer Motion**.

---

## 📁 Struktur File

```
portfolio/
├── src/
│   ├── app/
│   │   ├── globals.css     ← Style global
│   │   ├── layout.tsx      ← Layout utama (title, meta)
│   │   └── page.tsx        ← Halaman utama
│   ├── components/
│   │   ├── Navbar.tsx      ← Navigasi atas
│   │   ├── Hero.tsx        ← Bagian pertama (intro)
│   │   ├── Skills.tsx      ← Skills & tools
│   │   ├── Projects.tsx    ← Proyek-proyek
│   │   └── Contact.tsx     ← Kontak & footer
│   └── data/
│       └── portfolio.ts    ← ⭐ EDIT FILE INI untuk data personal
├── public/
│   └── cv.pdf              ← Taruh CV kamu di sini
└── package.json
```

---

## ✏️ Cara Kustomisasi

Buka file `src/data/portfolio.ts` dan edit:
- Nama, email, bio
- Link GitHub dan LinkedIn
- Skills (nama, level 0-100, icon emoji)
- Daftar proyek
- Pendidikan & sertifikat

---

## 🛠️ Cara Menjalankan di VS Code

### 1. Install Node.js
Download dari [nodejs.org](https://nodejs.org) (pilih LTS)

### 2. Buka folder di VS Code
```bash
# Di terminal VS Code (Ctrl + `)
cd portfolio
```

### 3. Install dependencies
```bash
npm install
```

### 4. Jalankan di localhost
```bash
npm run dev
```

Buka browser: **http://localhost:3000**

---

## 🌐 Deploy ke Vercel (Gratis!)

1. Upload kode ke **GitHub** (buat repo baru)
2. Buka [vercel.com](https://vercel.com) → Sign in with GitHub
3. Klik **"New Project"** → pilih repo kamu
4. Klik **Deploy** — selesai! 🎉

Dapat domain gratis: `nama-kamu.vercel.app`

---

## 📦 Tech Stack

| Tech | Fungsi |
|---|---|
| **Next.js 14** | Framework React |
| **Tailwind CSS** | Styling utility-first |
| **Framer Motion** | Animasi smooth |
| **TypeScript** | Type safety |

---

*Semangat belajar! 🔥*
