// =============================================
// EDIT FILE INI UNTUK MENGUBAH DATA PORTOFOLIO
// =============================================

export const personalData = {
  name: "FAIZ AFDIAN PRATAMA",
  tagline: "Data Enthusiast & Junior Developer",
  location: "Bekasi, Jawa Barat",
  school: "SMK Telekomunikasi Telesandi Bekasi",
  major: "Rekayasa Perangkat Lunak",
  graduationYear: "2026",
  bio: "Lulusan SMK RPL yang mengasah skill di web programming, logika pemrograman, desain sistem, hingga analisis data. Pengalaman kerja saat ini di PT Tirta Alam Segar (Process Bottle) menunjukkan bahwa saya adalah seorang pembelajar cepat yang mampu beradaptasi dengan industri non-IT dan tetap memberikan performa terbaik.",
  email: "afdianfaiz2@gmail.com",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  cvUrl: "https://google.com",
};

export const skills = [
  { name: "Python", level: 55, icon: "🐍", category: "Data" },
  { name: "SQL", level: 50, icon: "🗃️", category: "Data" },
  { name: "Pandas", level: 45, icon: "🐼", category: "Data" },
  { name: "Google Looker", level: 50, icon: "📊", category: "Data" },
  { name: "JavaScript", level: 65, icon: "⚡", category: "Web" },
  { name: "HTML & CSS", level: 70, icon: "🌐", category: "Web" },
  { name: "Next.js", level: 40, icon: "▲", category: "Web" },
  { name: "Git & GitHub", level: 60, icon: "🔧", category: "Tools" },
  { name: "PHP", level: 50, icon: "🐘", category: "Web" },
  { name: "VB.Net", level: 45, icon: "⚙️", category: "Desktop" },
];

export const certifications = [
  {
    name: "E-Course Data Analyst",
    issuer: "Karirnex",
    year: "2026",
    url: "https://google.com",
  },
  {
    name: "Bootcamp Data Analyst — Excel, SQL, Python & Google Looker Studio",
    issuer: "Karirnex",
    year: "2026",
    url: "https://google.com",
  },
  {
    name: "Digital Detective: Kenali Ancaman, Amankan Data",
    issuer: "Bina Insani University",
    year: "2025",
    url: "https://google.com",
  },
  {
    name: "Basic Data",
    issuer: "MySkill",
    year: "2026",
    url: "https://googleapis.com",
  },
  {
    name: "AI for Work Productivity",
    issuer: "MySkill",
    year: "2026",
    url: "https://google.com",
  },
];

export const projects = [
  {
    title: "Analisis Data Furniture",
    description: {
      id: "Eksplorasi dan visualisasi dataset furniture menggunakan Google Looker untuk menemukan pola dan tren penjualan.",
      en: "Exploration and visualization of a furniture dataset using Google Looker to uncover sales patterns and trends.",
    },
    tags: ["Google Looker"],
    category: "Data Visualization",
    imageUrl: "/projects/furniture-dashboard.png",
    demoUrl: "https://google.com",
  },
  {
    title: "Sistem Pos Keamanan - SIPOSKAM",
    description: {
      id: "Sistem informasi digital pengelolaan absensi, buku tamu, dan log barang pos satpam.",
      en: "Digital security post management system for attendance, visitor logs, and item tracking.",
    },
    tags: ["PHP", "Bootstrap", "HTML", "CSS", "JavaScript", "MySQL"],
    category: "Web Dev",
    imageUrl: "/projects/siposkam-dashboard.png",
    githubUrl: "https://github.com/siposkam",
    demoUrl: "",
  },
  {
    title: "Company Profile - PT. Revolutek Dananjaya Mandiri",
    description: {
      id: "Company profile digital PT. Revolutek Dananjaya Mandiri yang menampilkan informasi perusahaan, layanan, dan portofolio bisnis.",
      en: "Digital company profile of PT. Revolutek Dananjaya Mandiri showcasing company information, services, and business portfolio.",
    },
    tags: ["PHP", "HTML", "CSS", "JavaScript"],
    category: "Web Dev",
    imageUrl: "/projects/company-profile.png",
    githubUrl: "https://github.com/CompanyProfile",
    demoUrl: "",
  },
  {
    title: "Pendaftaran Siswa Baru",
    description: {
      id: "Aplikasi web CRUD untuk mengelola pendaftaran calon siswa baru, mencakup fitur tambah, lihat daftar, edit, dan hapus data siswa.",
      en: "A CRUD web application for managing new student registrations, featuring add, list, edit, and delete student data.",
    },
    tags: ["PHP", "MySQL", "HTML", "CSS"],
    category: "Web Dev",
    imageUrl: "/projects/smk-coding.png",
    githubUrl: "https://github.com/PendaftaranSiswaBaru",
    demoUrl: "",
  },
  {
    title: "Kampder",
    description: {
      id: "Aplikasi yang digunakan untuk Mencatat keuangan sehari-hari, Memantau target, dan Mengatur jadwal.",
      en: "An application used for tracking daily finances, monitoring targets, and scheduling tasks.",
    },
    tags: ["Next.js 14", "TypeScript", "Tailwind", "shadcn/ui", "Framer Motion", "Prisma", "Neon PostgreSQL", "NextAuth", "PWA"],
    category: "Web Dev", // Diubah kembali menjadi string murni agar seragam dengan data project lain
    imageUrl: "/projects/kampder.png",
    githubUrl: "",
    demoUrl: "https://vercel.app",
  },
  {
    title: "Game XOX",
    description: {
      id: "Aplikasi game Tic Tac Toe (XOX) interaktif berbasis Android yang dibuat menggunakan MIT App Inventor, dilengkapi dengan sistem logika penentu kemenangan otomatis dan efek suara.",
      en: "An interactive Android-based Tic Tac Toe (XOX) game application built with MIT App Inventor, featuring an automatic win-determination logic system and sound effects."
    },
    tags: ["MIT App Inventor", "Android", "Visual Blocks Programming"],
    category: "Android Dev",
    imageUrl: "/projects/game-xox.png",
    githubUrl: "",
    demoUrl: "https://youtu.be"
  },
  {
    title: "Word Puzzle Game",
    description: {
      id: "Aplikasi game teka-teki kata interaktif berbasis Android yang dibuat menggunakan MIT App Inventor.",
      en: "An interactive Android-based word puzzle game application built with MIT App Inventor."
    },
    tags: ["MIT App Inventor", "Android", "Visual Blocks Programming"],
    category: "Android Dev",
    imageUrl: "/projects/word-puzzle.png",
    githubUrl: "https://github.com/WordPuzzleGame",
    demoUrl: ""
  },
];

export const education = [
  {
    school: "SMK Telekomunikasi Telesandi Bekasi",
    major: { id: "Rekayasa Perangkat Lunak (RPL)", en: "Software Engineering (RPL)" },
    year: { id: "Mei 2023 – Jun 2026", en: "May 2023 – Jun 2026" },
  },
];

export const internship = [
  {
    company: "PT Tirta Alam Segar",
    role: { id: "Process Bottle", en: "Process Bottle" },
    year: { id: "Jul 2026 – Sekarang", en: "Jul 2026 – Present" },
  },
  {
    company: "PT Revolutek Dananjaya Mandiri",
    role: { id: "Staff Purchasing dan Web Developer", en: "Purchasing Staff & Web Developer" },
    year: { id: "Ags 2025 – Nov 2025", en: "Aug 2025 – Nov 2025" },
  },
];
