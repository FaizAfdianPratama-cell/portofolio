"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { personalData } from "@/data/portfolio";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";

/* ─── Reusable Photo Card ─── */
function PhotoCard({
  isLight,
  name,
  size,
  lang,
}: {
  isLight: boolean;
  name: string;
  size: "sm" | "lg";
  lang: "id" | "en";
}) {
  const isSm = size === "sm";

  return (
    <div className={`relative ${isSm ? "w-full" : "inline-block"}`}>
      {/* Outer ambient glow */}
      <div
        className={`absolute rounded-3xl pointer-events-none blur-2xl transition-all duration-500 ${
          isSm ? "-inset-3" : "-inset-5"
        } ${
          isLight
            ? "bg-gradient-to-br from-indigo-300/40 to-purple-300/40"
            : "bg-gradient-to-br from-[#00f5d4]/15 to-[#7c3aed]/15"
        }`}
      />

      {/* Photo frame */}
      <div
        className={`relative overflow-hidden border-2 transition-all duration-300 ${
          isSm
            ? "w-full aspect-[16/9] rounded-2xl"
            : "w-56 h-72 sm:w-64 sm:h-80 rounded-3xl"
        } ${
          isLight
            ? "border-indigo-200/80 shadow-2xl shadow-indigo-200/50"
            : "border-white/10 shadow-2xl shadow-black/40"
        }`}
      >
        <img
          src="/foto.jpg"
          alt={name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            const target = e.currentTarget;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              parent.style.background = isLight
                ? "linear-gradient(135deg,rgba(99,102,241,.12),rgba(168,85,247,.12))"
                : "linear-gradient(135deg,rgba(0,245,212,.08),rgba(124,58,237,.08))";
              parent.innerHTML = `<div style="width:100%;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;"><span style="font-size:${isSm ? 36 : 48}px;opacity:.35">👤</span>${
                !isSm
                  ? `<span style="font-size:10px;color:#6366f1;font-family:monospace;opacity:.7;letter-spacing:.05em">foto.jpg → /public/</span>`
                  : ""
              }</div>`;
            }
          }}
        />
        {/* Subtle bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
      </div>

      {/* Decorative corner frames — desktop only */}
      {!isSm && (
        <>
          <div
            className={`absolute -bottom-3 -right-3 w-16 h-16 rounded-2xl border pointer-events-none ${
              isLight ? "border-indigo-200/60" : "border-white/6"
            }`}
          />
          <div
            className={`absolute -top-3 -left-3 w-12 h-12 rounded-xl border pointer-events-none ${
              isLight ? "border-purple-200/60" : "border-white/6"
            }`}
          />
        </>
      )}

      {/* Accent dots */}
      <div
        className={`absolute top-3 -right-1.5 w-2.5 h-2.5 rounded-full blur-[2px] ${
          isLight ? "bg-indigo-400/80" : "bg-[#00f5d4]/60"
        }`}
      />
      <div
        className={`absolute bottom-10 -left-1.5 w-2 h-2 rounded-full blur-[2px] ${
          isLight ? "bg-purple-400/80" : "bg-[#7c3aed]/60"
        }`}
      />

      {/* Available badge — desktop only */}
      {!isSm && (
        <div
          className={`absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono whitespace-nowrap ${
            isLight
              ? "bg-white border-indigo-100 text-indigo-500 shadow-sm"
              : "bg-[#060b18]/90 border-white/10 text-[#00f5d4] backdrop-blur-sm"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          {t.education.available[lang]}
        </div>
      )}
    </div>
  );
}

export default function Hero() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";
  const currentRoles = t.hero.roles[lang];

  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const current = currentRoles[roleIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75);
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), 2200);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length - 1)), 38);
    } else {
      setIsDeleting(false);
      setRoleIdx((i) => (i + 1) % currentRoles.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, roleIdx, currentRoles]);

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="about"
      className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 pb-16 grid-bg mesh-gradient overflow-hidden transition-colors duration-500"
    >
      {/* Glow blobs */}
      {isLight ? (
        <>
          <div className="absolute top-1/3 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-indigo-400/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-72 sm:w-96 lg:w-[28rem] h-72 sm:h-96 lg:h-[28rem] rounded-full bg-purple-400/15 blur-[120px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/3 left-1/4 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 rounded-full bg-[#7c3aed]/10 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-72 sm:w-96 lg:w-[28rem] h-72 sm:h-96 lg:h-[28rem] rounded-full bg-[#00f5d4]/7 blur-[120px] pointer-events-none" />
        </>
      )}

      <motion.div
        variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-5xl mx-auto"
      >
        {/* Mobile / tablet: stacked (photo first, then text)
            Desktop: side-by-side grid */}
        <div className="flex flex-col items-center gap-8 sm:gap-10 lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">

          {/* Photo — mobile & tablet only (shown above text) */}
          <motion.div
            variants={item}
            className="lg:hidden w-full"
          >
            <PhotoCard isLight={isLight} name={personalData.name} size="sm" lang={lang} />
          </motion.div>

          {/* Text content */}
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Name */}
            <motion.div variants={item} className="mb-3 sm:mb-4 w-full">
              <h1
                className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight ${
                  isLight ? "text-indigo-950" : "text-white"
                }`}
              >
                {personalData.name.split(" ")[0]}{" "}
                <span
                  className={
                    isLight
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent"
                      : "bg-gradient-to-r from-[#00f5d4] to-[#7c3aed] bg-clip-text text-transparent"
                  }
                >
                  {personalData.name.split(" ").slice(1).join(" ") || "Pratama"}
                </span>
              </h1>
            </motion.div>

            {/* Typewriter */}
            <motion.div
              variants={item}
              className="flex items-center justify-center lg:justify-start gap-2 mb-4 sm:mb-6"
            >
              <span
                className={`font-mono text-xs sm:text-sm ${
                  isLight ? "text-indigo-400" : "text-slate-500"
                }`}
              >
                role =
              </span>
              <span
                className={`font-mono text-xs sm:text-sm font-medium ${
                  isLight ? "text-indigo-600" : "text-[#00f5d4]"
                }`}
              >
                &quot;{displayed}
                <span className="blink">|</span>&quot;
              </span>
            </motion.div>

            {/* Bio — Fix 1: per-word fade-in */}
            <motion.div
              variants={item}
              className={`text-sm sm:text-base leading-relaxed max-w-sm sm:max-w-md mx-auto lg:mx-0 mb-6 sm:mb-8 flex flex-wrap justify-center lg:justify-start gap-x-1.5 gap-y-0.5 ${
                isLight ? "text-indigo-800/70" : "text-slate-400"
              }`}
            >
              {t.hero.bio[lang].split(" ").map((word, wi) => (
                <motion.span
                  key={wi}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + wi * 0.045, duration: 0.35, ease: "easeOut" }}
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              variants={item}
              className="flex flex-wrap justify-center lg:justify-start gap-2 sm:gap-3 w-full"
            >
              <a
                href={personalData.cvUrl}
                download
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 ${
                  isLight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    : "bg-[#00f5d4] text-[#060b18] hover:bg-[#00f5d4]/90 hover:shadow-[0_0_20px_rgba(0,245,212,0.3)]"
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {t.hero.downloadCV[lang]}
              </a>
              <a
                href={personalData.github}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 ${
                  isLight
                    ? "border-indigo-200 text-indigo-600 hover:border-indigo-400 hover:bg-indigo-50 bg-white/70"
                    : "border-white/10 text-slate-400 hover:border-white/25 hover:text-white"
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
              <a
                href={personalData.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 ${
                  isLight
                    ? "border-indigo-200 text-indigo-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 bg-white/70"
                    : "border-white/10 text-slate-400 hover:border-[#0ea5e9]/40 hover:text-[#0ea5e9]"
                }`}
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                LinkedIn
              </a>
            </motion.div>
          </div>

          {/* Photo — desktop only (right column) */}
          <motion.div
            variants={item}
            className="hidden lg:flex justify-center items-center pb-6"
          >
            <PhotoCard isLight={isLight} name={personalData.name} size="lg" lang={lang} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div variants={item} className="mt-12 sm:mt-16 lg:mt-20 flex justify-center">
          <a href="#skills" className="group flex flex-col items-center gap-2">
            <span
              className={`text-[10px] font-mono tracking-[0.2em] uppercase transition-colors duration-200 ${
                isLight
                  ? "text-indigo-400 group-hover:text-indigo-600"
                  : "text-slate-500 group-hover:text-slate-300"
              }`}
            >
              {t.hero.scroll[lang]}
            </span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className={`w-5 h-9 rounded-full border-2 flex items-start justify-center pt-1.5 ${
                isLight ? "border-indigo-300" : "border-white/12"
              }`}
            >
              <div className={`w-1 h-2 rounded-full ${isLight ? "bg-indigo-500" : "bg-[#00f5d4]"}`} />
            </motion.div>
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}