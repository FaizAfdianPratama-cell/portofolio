import { NextRequest, NextResponse } from "next/server";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

// ─── Sistem prompt ────────────────────────────────────────────────────────────
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
ATURAN BAHASA — WAJIB DIIKUTI
══════════════════════════════════════
DETEKSI bahasa dari pesan TERAKHIR pengguna:
• Jika pengguna menulis dalam BAHASA INGGRIS → jawab SELURUHNYA dalam BAHASA INGGRIS
• Jika pengguna menulis dalam BAHASA INDONESIA → jawab SELURUHNYA dalam BAHASA INDONESIA
• Jika campur → ikuti bahasa yang dominan
JANGAN pernah menjawab dalam bahasa yang berbeda dari bahasa pengguna.

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
PERINGATAN KERAS — BAHASA
══════════════════════════════════════
Sebelum menjawab, deteksi bahasa pesan terakhir pengguna.
Jika pesan terakhir dalam BAHASA INGGRIS: SELURUH jawabanmu HARUS dalam BAHASA INGGRIS. TIDAK BOLEH ada satu kata pun dalam Bahasa Indonesia.
Jika pesan terakhir dalam BAHASA INDONESIA: SELURUH jawabanmu HARUS dalam BAHASA INDONESIA.
INI ADALAH INSTRUKSI TERPENTING. Gagal mengikuti ini = jawaban salah.

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

// ─── Groq (Primary) ───────────────────────────────────────────────────────────
async function callGroq(
  messages: Array<{ role: string; content: string }>,
  systemPrompt: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY tidak ditemukan");

  // Detect language for Groq too
  const lastUserMsgGroq = [...messages].reverse().find(m => m.role === "user");
  const lastTextGroq = lastUserMsgGroq?.content ?? "";
  const isEnglishGroq = /^[a-zA-Z0-9\s.,!?'";:()/\-]+$/.test(lastTextGroq.trim()) ||
    /\b(the|is|are|was|were|what|who|how|tell|show|give|can|i|my|me|you|your|please|about|and|or|not|with|from|for|this|that|has|have|do|does|did|will|would|should|could|may|might)\b/i.test(lastTextGroq);

  const langHintGroq = isEnglishGroq
    ? "\n\n[SYSTEM: Respond entirely in ENGLISH. Do NOT use Bahasa Indonesia.]"
    : "\n\n[SYSTEM: Jawab seluruhnya dalam Bahasa Indonesia.]";

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
          return { role: m.role, content: isLast && m.role === "user" ? m.content + langHintGroq : m.content };
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

// ─── Gemini (Fallback + Google Search) ───────────────────────────────────────
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

  // Detect language of last user message and prepend a strong hint
  const lastUserMsg = [...messages].reverse().find(m => m.role === "user");
  const lastText = lastUserMsg?.content ?? "";
  const isEnglish = /^[a-zA-Z0-9\s.,!?'";:()/\-]+$/.test(lastText.trim()) ||
    /\b(the|is|are|was|were|what|who|how|tell|show|give|can|i|my|me|you|your|please|about|and|or|not|with|from|for|this|that|has|have|do|does|did|will|would|should|could|may|might)\b/i.test(lastText);

  const langHint = isEnglish
    ? "\n\n[SYSTEM: The user wrote in ENGLISH. You MUST respond entirely in ENGLISH. Do NOT use Bahasa Indonesia at all.]"
    : "\n\n[SYSTEM: Pengguna menulis dalam Bahasa Indonesia. Jawab SELURUHNYA dalam Bahasa Indonesia.]";

  const geminiContents = messages.map((m, idx) => {
    const isLast = idx === messages.length - 1;
    return {
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: isLast && m.role === "user" ? m.content + langHint : m.content }],
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

    // 2️⃣ Fallback ke Groq (limit banyak, 14.400 req/hari)
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