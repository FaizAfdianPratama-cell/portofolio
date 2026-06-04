type Tr = { id: string; en: string };
type TrArr = { id: string[]; en: string[] };

export const t: {
  nav: Record<string, Tr>;
  hero: {
    available: Tr; roles: TrArr; bio: Tr;
    tags: { id: string[]; en: string[] };
    downloadCV: Tr; scroll: Tr; openToWork: Tr;
    freshGrad: Tr; codeRole: Tr;
  };
  skills: {
    label: Tr; title: Tr; titlePre: Tr; sub: Tr;
    learning: Tr; proficiency: Tr;
    categories: Record<string, Tr>;
  };
  education: {
    label: Tr; title: Tr; titlePre: Tr; sub: Tr;
    internshipLabel: Tr; certLabel: Tr; available: Tr; educationLabel: Tr;
  };
  projects: { label: Tr; title: Tr; titlePre: Tr; sub: Tr };
  contact: {
    label: Tr; title: Tr; titlePre: Tr; sub: Tr;
    greeting: Tr; reply: Tr; email: Tr; footer: Tr;
    formTitle: Tr; formName: Tr; formEmail: Tr; formMessage: Tr;
    formSend: Tr; formSending: Tr; formSuccess: Tr; formError: Tr;
    waChat: Tr; igProfile: Tr;
  };
} = {
  nav: {
    about:     { id: "Tentang",    en: "About" },
    skills:    { id: "Keahlian",   en: "Skills" },
    education: { id: "Pendidikan", en: "Education" },
    projects:  { id: "Proyek",     en: "Projects" },
    contact:   { id: "Kontak",     en: "Contact" },
    hire:      { id: "Rekrut Saya", en: "Hire Me" },
  },
  hero: {
    available: { id: "Tersedia untuk kerja", en: "Available for work" },
    roles: {
      id: ["Penggemar Data", "Pengembang Web", "Pelajar Python", "Penggiat Teknologi"],
      en: ["Data Enthusiast", "Junior Developer", "Python Learner", "Tech Enthusiast"],
    },
    bio: {
      id: "Lulusan SMK RPL yang mengasah skill di web programming, logika pemrograman, desain sistem, hingga analisis data. Aktif belajar mandiri di bidang Data Analytics — siap terus berkembang di industri teknologi.",
      en: "SMK RPL graduate who honed skills across web programming, logic-based programming, system design, and data analysis. Actively self-learning in Data Analytics — ready to keep growing in the tech industry.",
    },
    tags: {
      id: ["Bekasi 📍", "SMK Telesandi 🎓", "Lulus 2026 🏆"],
      en: ["Bekasi 📍", "SMK Telesandi 🎓", "Class of 2026 🏆"],
    },
    downloadCV: { id: "Unduh CV", en: "Download CV" },
    scroll:     { id: "gulir ke bawah", en: "scroll down" },
    openToWork: { id: "🔥 Siap Bekerja", en: "🔥 Open to Work" },
    freshGrad:  { id: "🎓 Fresh Graduate", en: "🎓 Fresh Graduate" },
    codeRole:   { id: "Data Enthusiast", en: "Data Enthusiast" },
  },
  skills: {
    label:    { id: "02_keahlian.py", en: "02_skills.py" },
    title:    { id: "Senjata", en: "Arsenal" },
    titlePre: { id: "Tech", en: "Tech" },
    sub:      { id: "Tools & teknologi yang sedang saya kuasai", en: "Tools & technologies I'm mastering" },
    learning: { id: "Sedang Dipelajari", en: "Currently Learning" },
    proficiency: { id: "kemahiran", en: "proficiency" },
    categories: {
      Data:  { id: "Data", en: "Data" },
      Web:   { id: "Web", en: "Web" },
      Tools: { id: "Tools", en: "Tools" },
    },
  },
  education: {
    label:    { id: "03_pengalaman.py", en: "03_experience.py" },
    title:    { id: "Diperoleh", en: "Gained" },
    titlePre: { id: "Pengalaman", en: "Experience" },
    sub:      { id: "Beberapa pengalaman yang telah membentuk saya", en: "The experiences that have shaped me so far" },
    educationLabel:  { id: "Pendidikan", en: "Education" },
    internshipLabel: { id: "PKL / Magang", en: "Internship" },
    certLabel: { id: "Sertifikat & Sertifikasi", en: "Certificates & Certifications" },
    available:       { id: "Tersedia", en: "Available" },
  },
  projects: {
    label:    { id: "04_proyek.py", en: "04_projects.py" },
    title:    { id: "Yang Sudah Saya Buat", en: "What I've Built" },
    titlePre: { id: "Apa", en: "" },
    sub:      { id: "Proyek nyata sebagai bukti belajar saya", en: "Real projects as proof of my learning" },
  },
  contact: {
    label:    { id: "05_kontak.py", en: "05_contact.py" },
    title:    { id: "Hubungi", en: "Connect" },
    titlePre: { id: "Ayo", en: "Let's" },
    sub:      { id: "Terbuka untuk peluang magang, kerja, atau kolaborasi. Yuk ngobrol!", en: "Open to internships, jobs, or collaborations. Let's talk!" },
    greeting: { id: "Salam Kenal!", en: "Say Hello!" },
    reply:    { id: "Balas dalam 24 jam · Terbuka untuk semua peluang", en: "Reply within 24h · Open to all opportunities" },
    email:    { id: "✉️ Kirim Email", en: "✉️ Send Email" },
    footer:   { id: "Dibuat dengan Next.js · Tailwind CSS · Framer Motion · Di-deploy di Vercel", en: "Built with Next.js · Tailwind CSS · Framer Motion · Deployed on Vercel" },
    formTitle:   { id: "Kirim Pesan", en: "Send a Message" },
    formName:    { id: "Nama Lengkap", en: "Full Name" },
    formEmail:   { id: "Alamat Email", en: "Your Email Address" },
    formMessage: { id: "Pesan Anda...", en: "Your Message..." },
    formSend:    { id: "Kirim Pesan", en: "Send Message" },
    formSending: { id: "Mengirim...", en: "Sending..." },
    formSuccess: { id: "Pesan berhasil dikirim!", en: "Message sent successfully!" },
    formError:   { id: "Gagal mengirim. Pastikan EmailJS sudah dikonfigurasi.", en: "Failed to send. Make sure EmailJS is configured." },
    waChat:      { id: "Chat langsung", en: "Chat directly" },
    igProfile:   { id: "Lihat profil", en: "View profile" },
  },
};