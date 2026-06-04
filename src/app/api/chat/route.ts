import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

function getLangHint(text: string): string {
  const isObviouslyEnglish =
    /^[a-zA-Z0-9\s.,!?'"();:\-/]+$/.test(text.trim()) &&
    /\b(the|is|are|was|were|what|who|how|tell|show|give|can|will|would|should|could|have|has|do|does|did|my|your|their|this|that|these|those|about|with|from|for|not|and|or|but|please|hello|hi|hey|help|make|create|explain|describe|list|find|search|get|use|run|start|stop|open|close|go|come|take|put|set|let|try|need|want|like|know|think|see|look|feel|seem|become|include|provide|return|show|build|write|read|send|receive|check|add|remove|update|delete|change|move|copy|save|load|play|watch|listen)\b/i
    .test(text);

  return isObviouslyEnglish
    ? "\n\n[REMINDER: User is writing in ENGLISH → You MUST respond in ENGLISH only. Do NOT use Bahasa Indonesia.]"
    : "\n\n[REMINDER: Analisis bahasa pengguna menggunakan aturan di system prompt → ikuti bahasa yang digunakan pengguna.]";
}

function buildSystemPrompt(): string {
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
  );

  const todayFormatted = now.toLocaleDateString("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
    timeZone: "Asia/Jakarta",
  });

  const birthDate = new Date(2008, 4, 17);
  let age = now.getFullYear() - birthDate.getFullYear();
  const hasBirthdayPassed =
    now.getMonth() > birthDate.getMonth() ||
    (now.getMonth() === birthDate.getMonth() && now.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) age--;

  let monthsAfter =
    now.getMonth() - birthDate.getMonth() -
    (now.getDate() < birthDate.getDate() ? 1 : 0);
  if (monthsAfter < 0) monthsAfter += 12;

  const ageDetail = `${age} tahun ${monthsAfter} bulan`;

  return `Kamu adalah asisten AI pribadi bernama "Faiz AI" di portofolio FAIZ AFDIAN PRATAMA.

══════════════════════════════════════
ATURAN BAHASA — PALING UTAMA & WAJIB
══════════════════════════════════════
Sebelum menjawab, kamu WAJIB menganalisis bahasa yang digunakan pengguna
berdasarkan STRUKTUR KALIMAT dan KOSAKATA, bukan hanya kata kunci tertentu.

CARA MENENTUKAN BAHASA:

1. BAHASA INDONESIA → Jawab 100% Bahasa Indonesia
   Ciri-ciri:
   - Menggunakan kata/frasa Indonesia meskipun tanpa kata umum seperti "apa", "ini", dll
   - Pola kata berimbuhan: -kan, -an, -i, -nya, me-, ber-, ter-, pe-, di-, ke-
   - Contoh kalimat Indonesia tanpa kata umum:
     "foto profil" → Indonesia
     "warna biru" → Indonesia
     "harga murah" → Indonesia  
     "cuaca hari ini" → Indonesia
     "makan siang" → Indonesia
     "jalan kaki" → Indonesia
     "beli tiket" → Indonesia
     "kerja keras" → Indonesia
     "tidur siang" → Indonesia
     "main game" → Indonesia
     "nonton film" → Indonesia
     "baju baru" → Indonesia
     "pergi sekolah" → Indonesia
     "masak nasi" → Indonesia
     "minum kopi" → Indonesia

2. BAHASA INGGRIS → Jawab 100% Bahasa Inggris
   Ciri-ciri:
   - Struktur grammar English (subject + verb + object)
   - Kosakata English yang jelas
   - Contoh: "profile photo", "blue color", "cheap price", "today weather"

3. JIKA RAGU → Default ke BAHASA INDONESIA

LARANGAN KERAS:
• DILARANG jawab Bahasa Inggris jika pengguna menulis Bahasa Indonesia
• DILARANG jawab Bahasa Indonesia jika pengguna menulis Bahasa Inggris
• DILARANG mencampur dua bahasa dalam satu jawaban
• Istilah teknis (Python, Next.js, API, React, MySQL, dll) BUKAN penentu bahasa
• Nama orang, tempat, brand BUKAN penentu bahasa

CONTOH PENERAPAN:
User: "foto profil" → INDONESIA ✓
User: "profile photo" → ENGLISH ✓
User: "berapa harganya" → INDONESIA ✓
User: "how much does it cost" → ENGLISH ✓
User: "pakai Python bisa ga" → INDONESIA ✓
User: "can i use Python" → ENGLISH ✓
User: "next.js itu apa" → INDONESIA ✓
User: "what is next.js" → ENGLISH ✓
User: "random kata" → INDONESIA (default) ✓
User: "random words" → ENGLISH ✓

══════════════════════════════════════
MODE 1 — TENTANG FAIZ
══════════════════════════════════════
Aktif saat pertanyaan tentang Faiz, skill, proyek, pendidikan, pengalaman, atau kontak.
Jawab ramah, singkat (3-4 kalimat), pakai data di bawah, boleh pakai emoji.

══════════════════════════════════════
MODE 2 — ASISTEN UMUM
══════════════════════════════════════
Aktif saat pertanyaan TIDAK tentang Faiz (berita, sains, coding umum, matematika, dll).
Jawab sebaik mungkin dari pengetahuanmu.

Jangan sebut "mode" ke pengguna. Transisi antar mode boleh dalam satu percakapan.

══════════════════════════════════════
DATA FAIZ (MODE 1)
══════════════════════════════════════

WAKTU SEKARANG  : ${todayFormatted}
TAHUN SEKARANG  : ${now.getFullYear()}

DATA DIRI
Nama            : FAIZ AFDIAN PRATAMA (panggilan: Faiz)
Tanggal lahir   : 17 Mei 2008
Umur sekarang   : ${ageDetail}  ← GUNAKAN INI, JANGAN HITUNG SENDIRI
Lokasi          : Bekasi, Jawa Barat, Indonesia
Email           : afdianfaiz2@gmail.com
WhatsApp        : +62 812-9310-0423
GitHub          : https://github.com/FaizAfdianPratama-cell
LinkedIn        : https://www.linkedin.com/in/faizafdianpratama
Instagram       : https://www.instagram.com/faiz.afdian/

PENDIDIKAN
• Perbanas Institute Bekasi — Sains Data (Ags 2026–sekarang, aktif)
• SMK Telekomunikasi Telesandi Bekasi — RPL (Mei 2023–Jun 2026, lulus)

PENGALAMAN
• PT Revolutek Dananjaya Mandiri (Ags–Okt 2026) — Staff Purchasing & Web Developer
  Membuat website Company Profile (PHP, HTML, CSS, JS)

KEAHLIAN
Data  : Python 55%, SQL 50%, Pandas 45%, Google Looker 50%, Excel
Web   : HTML&CSS 70%, JavaScript 65%, PHP 50%, Next.js 40%, Bootstrap, Tailwind
Tools : Git&GitHub 60%, VB.Net 45%, MySQL, MIT App Inventor
Belajar: Machine Learning, Tableau, Power BI, Data Warehouse

SERTIFIKAT
• E-Course Data Analyst — Karirnex 2026
• Bootcamp Data Analyst (Excel, SQL, Python, Looker) — Karirnex 2026
• Digital Detective: Kenali Ancaman, Amankan Data — Bina Insani 2025
• Basic Data — MySkill 2026

PROYEK
• Analisis Data Furniture — Google Looker Studio
• SIPOSKAM (Sistem Pos Keamanan) — PHP/MySQL/Bootstrap
• Company Profile PT. Revolutek — PHP/HTML/CSS/JS
• Pendaftaran Siswa Baru — PHP/MySQL CRUD
• Game XOX (Tic Tac Toe) — MIT App Inventor Android
• Word Puzzle Game — MIT App Inventor Android

TUJUAN
Fresh graduate RPL, terbuka untuk magang/kerja/kolaborasi/freelance.
Goal: jadi Data Analyst / Data Scientist profesional. Balas dalam 24 jam.`;
}

async function callGroq(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY tidak ditemukan");

  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  const langHint = getLangHint(lastUserMsg?.content ?? "");

  const res = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        ...messages.map((m, idx) => {
          const isLast = idx === messages.length - 1;
          return {
            role: m.role,
            content: isLast && m.role === "user"
              ? m.content + langHint
              : m.content,
          };
        }),
      ],
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Groq API error:", JSON.stringify(err, null, 2));
    throw new Error(`Groq error: ${err?.error?.message || res.status}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "Maaf, tidak ada respons.";
}

interface GeminiPart {
  text?: string;
  executableCode?: unknown;
  codeExecutionResult?: unknown;
}

function extractGeminiReply(data: {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
  }>;
}): string {
  const parts: GeminiPart[] = data?.candidates?.[0]?.content?.parts ?? [];
  const text = parts
    .filter((p) => typeof p.text === "string" && p.text.trim() !== "")
    .map((p) => p.text as string)
    .join("");
  return text.trim() || "Maaf, tidak ada respons.";
}

async function callGemini(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY tidak ditemukan");

  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  const langHint = getLangHint(lastUserMsg?.content ?? "");

  const geminiContents = messages.map((m, idx) => {
    const isLast = idx === messages.length - 1;
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts: [{
        text: isLast && m.role === "user"
          ? m.content + langHint
          : m.content,
      }],
    };
  });

  const body = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: geminiContents,
    tools: [{ google_search: {} }],
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 1.0,
    },
  };

  const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error("Gemini fallback error:", JSON.stringify(err, null, 2));
    throw new Error(`Gemini error: ${err?.error?.message || res.status}`);
  }

  const data = await res.json();
  return extractGeminiReply(data);
}

// ─── Route handler ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const systemPrompt = buildSystemPrompt();

    // 1️⃣ Coba Gemini dulu (primary — ada Google Search realtime)
    try {
      const reply = await callGemini(messages, systemPrompt);
      console.log("✅ Gemini berhasil");
      return NextResponse.json({ reply });
    } catch (geminiErr) {
      console.warn("⚠️ Gemini gagal/habis kuota, fallback ke Groq...", geminiErr);
    }

    try {
      const reply = await callGroq(messages, systemPrompt);
      console.log("✅ Groq fallback berhasil");
      return NextResponse.json({ reply });
    } catch (groqErr) {
      console.error("❌ Groq fallback juga gagal:", groqErr);
    }

    return NextResponse.json(
      { error: "Semua AI tidak tersedia saat ini. Coba lagi nanti." },
      { status: 500 }
    );
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
