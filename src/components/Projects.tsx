"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { projects } from "@/data/portfolio";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";

// ── Filter categories ────────────────────────────────────────────────
const filterLabels: Record<string, { id: string; en: string }> = {
  All:         { id: "Semua",           en: "All"           },
  "Web Dev":   { id: "Web Dev",         en: "Web Dev"       },
  "Android Dev":{ id: "Android Dev",    en: "Android Dev"   },
  "Data Vizualization": { id: "Data Analytics", en: "Data Analytics" },
  "Data Analysis":      { id: "Data Analytics", en: "Data Analytics" },
};

// Normalise beberapa category value ke bucket filter
const normCategory = (cat: string): string => {
  if (cat === "Data Analysis" || cat === "Data Vizualization" || cat === "Data Viz") return "Data Vizualization";
  return cat;
};

const filterKeys = ["All", "Web Dev", "Android Dev", "Data Vizualization"];

// ── Category meta ────────────────────────────────────────────────────
const catMeta: Record<string, {
  bg: string; text: string; border: string;
  bgLight: string; textLight: string; borderLight: string;
  previewDark: string; previewLight: string;
  iconDark: string; iconLight: string;
}> = {
  "Data Analysis": {
    bg: "rgba(0,245,212,0.05)", text: "#00f5d4", border: "rgba(0,245,212,0.2)",
    bgLight: "rgba(99,102,241,0.08)", textLight: "#6366f1", borderLight: "rgba(99,102,241,0.25)",
    previewDark:  "linear-gradient(135deg,rgba(0,245,212,0.12) 0%,rgba(124,58,237,0.08) 100%)",
    previewLight: "linear-gradient(135deg,rgba(99,102,241,0.10) 0%,rgba(139,92,246,0.07) 100%)",
    iconDark: "#00f5d4", iconLight: "#6366f1",
  },
  "Data Vizualization": {
    bg: "rgba(0,245,212,0.05)", text: "#00f5d4", border: "rgba(0,245,212,0.2)",
    bgLight: "rgba(99,102,241,0.08)", textLight: "#6366f1", borderLight: "rgba(99,102,241,0.25)",
    previewDark:  "linear-gradient(135deg,rgba(0,245,212,0.12) 0%,rgba(124,58,237,0.08) 100%)",
    previewLight: "linear-gradient(135deg,rgba(99,102,241,0.10) 0%,rgba(139,92,246,0.07) 100%)",
    iconDark: "#00f5d4", iconLight: "#6366f1",
  },
  "Data Viz": {
    bg: "rgba(124,58,237,0.05)", text: "#a78bfa", border: "rgba(124,58,237,0.2)",
    bgLight: "rgba(168,85,247,0.08)", textLight: "#9333ea", borderLight: "rgba(168,85,247,0.25)",
    previewDark:  "linear-gradient(135deg,rgba(124,58,237,0.14) 0%,rgba(245,158,11,0.07) 100%)",
    previewLight: "linear-gradient(135deg,rgba(168,85,247,0.10) 0%,rgba(236,72,153,0.07) 100%)",
    iconDark: "#a78bfa", iconLight: "#9333ea",
  },
  "Web Dev": {
    bg: "rgba(245,158,11,0.05)", text: "#f59e0b", border: "rgba(245,158,11,0.2)",
    bgLight: "rgba(236,72,153,0.07)", textLight: "#db2777", borderLight: "rgba(236,72,153,0.25)",
    previewDark:  "linear-gradient(135deg,rgba(245,158,11,0.10) 0%,rgba(239,68,68,0.06) 100%)",
    previewLight: "linear-gradient(135deg,rgba(236,72,153,0.09) 0%,rgba(245,158,11,0.07) 100%)",
    iconDark: "#f59e0b", iconLight: "#db2777",
  },
  "Android Dev": {
    bg: "rgba(16,185,129,0.05)", text: "#10b981", border: "rgba(16,185,129,0.2)",
    bgLight: "rgba(5,150,105,0.08)", textLight: "#059669", borderLight: "rgba(5,150,105,0.25)",
    previewDark:  "linear-gradient(135deg,rgba(16,185,129,0.12) 0%,rgba(6,182,212,0.06) 100%)",
    previewLight: "linear-gradient(135deg,rgba(5,150,105,0.10) 0%,rgba(16,185,129,0.07) 100%)",
    iconDark: "#10b981", iconLight: "#059669",
  },
};

function PreviewIcon({ category, color }: { category: string; color: string }) {
  if (category.includes("Data")) {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.2} opacity={0.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    );
  }
  if (category === "Android Dev") {
    return (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.2} opacity={0.5}>
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    );
  }
  return (
    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.2} opacity={0.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );
}

// ── Filter icon per key ──────────────────────────────────────────────
function FilterIcon({ filterKey, size = 14 }: { filterKey: string; size?: number }) {
  if (filterKey === "All") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
  if (filterKey === "Web Dev") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
    </svg>
  );
  if (filterKey === "Android Dev") return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
    </svg>
  );
  // Data
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
    </svg>
  );
}

export default function Projects() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects = activeFilter === "All"
    ? projects
    : projects.filter(p => normCategory(p.category) === activeFilter);

  // count per filter
  const countFor = (key: string) => key === "All"
    ? projects.length
    : projects.filter(p => normCategory(p.category) === key).length;

  return (
    <section
      id="projects"
      className="relative py-16 sm:py-20 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 grid-bg mesh-gradient"
    >
      {/* Glow blobs */}
      {isLight ? (
        <>
          <div className="absolute top-1/3 right-1/4 w-48 sm:w-72 lg:w-80 h-48 sm:h-72 lg:h-80 rounded-full bg-indigo-400/20 blur-[80px] sm:blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/4 w-56 sm:w-80 lg:w-96 h-56 sm:h-80 lg:h-96 rounded-full bg-purple-400/15 blur-[100px] sm:blur-[120px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/3 right-1/4 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 rounded-full bg-[#7c3aed]/10 blur-[80px] sm:blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 left-1/4 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 rounded-full bg-[#00f5d4]/7 blur-[100px] sm:blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-4 sm:right-8 top-8 sm:top-12 select-none font-extrabold leading-none"
        style={{
          fontSize: "clamp(5rem,14vw,9rem)",
          color: isLight ? "rgba(99,102,241,0.055)" : "rgba(255,255,255,0.03)",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.04em",
        }}
      >
        04
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="mb-8 sm:mb-10 text-center"
        >
          <p className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 ${isLight ? "text-indigo-500" : "text-[#00f5d4]"}`}>
            {t.projects.label[lang]}
          </p>
          <h2
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-2 sm:mb-3"
            style={{
              backgroundImage: isLight
                ? "linear-gradient(135deg,#6366f1 20%,#a855f7 80%)"
                : "linear-gradient(135deg,#00f5d4 20%,#7c3aed 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {t.projects.titlePre[lang]}{t.projects.titlePre[lang] ? " " : ""}{t.projects.title[lang]}
          </h2>
          <p className={`text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto ${isLight ? "text-indigo-600/70" : "text-slate-400"}`}>
            {t.projects.sub[lang]}
          </p>
        </motion.div>

        {/* ── Filter Bar ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-8 sm:mb-10"
        >
          {filterKeys.map((key) => {
            const isActive = activeFilter === key;
            const count = countFor(key);
            const label = filterLabels[key]?.[lang] ?? key;

            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all duration-200 ${
                  isActive
                    ? isLight
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200/60"
                      : "bg-[#00f5d4] text-[#060b18] border-[#00f5d4] shadow-lg shadow-[#00f5d4]/20"
                    : isLight
                      ? "bg-white text-indigo-500 border-indigo-100 hover:border-indigo-300 hover:text-indigo-700 shadow-sm"
                      : "bg-white/5 text-slate-400 border-white/8 hover:border-white/20 hover:text-slate-200"
                }`}
              >
                <span className={`${isActive ? "" : "opacity-70"}`}>
                  <FilterIcon filterKey={key} size={13} />
                </span>
                <span>{label}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ml-0.5 ${
                    isActive
                      ? isLight
                        ? "bg-white/25 text-white"
                        : "bg-[#060b18]/20 text-[#060b18]"
                      : isLight
                        ? "bg-indigo-50 text-indigo-400"
                        : "bg-white/8 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Project Grid ── */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, i) => {
              const color  = catMeta[project.category] || catMeta["Web Dev"];
              const bg     = isLight ? color.bgLight     : color.bg;
              const text   = isLight ? color.textLight   : color.text;
              const border = isLight ? color.borderLight : color.border;
              const previewBg   = isLight ? color.previewLight : color.previewDark;
              const previewIcon = isLight ? color.iconLight    : color.iconDark;

              const hasGithub = !!(project as any).githubUrl && (project as any).githubUrl !== "";
              const hasDemo   = !!(project as any).demoUrl   && (project as any).demoUrl   !== "";
              const liveUrl   = hasDemo ? (project as any).demoUrl : hasGithub ? (project as any).githubUrl : null;

              const desc = typeof project.description === "string"
                ? project.description
                : (project.description as { id: string; en: string })[lang];

              // Label kategori yang ditampilkan di card — ikut bahasa
              const catLabel = filterLabels[normCategory(project.category)]?.[lang] ?? project.category;

              return (
                <motion.div
                  key={project.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -10 }}
                  transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -4 }}
                  className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer ${
                    isLight
                      ? "bg-white border-indigo-100 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200"
                      : "bg-[#0d1426] border-white/8 hover:border-white/16 hover:shadow-2xl hover:shadow-black/30"
                  }`}
                  onClick={() => { if (liveUrl) window.open(liveUrl, "_blank"); }}
                >
                  {/* ── Preview image area ── */}
                  <div className="relative w-full h-40 overflow-hidden flex-shrink-0" style={{ background: previewBg }}>
                    {project.imageUrl ? (
                      <>
                        <img
                          src={project.imageUrl}
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                          onError={(e) => {
                            const img = e.currentTarget;
                            img.style.display = "none";
                            const fallback = img.nextElementSibling as HTMLElement | null;
                            if (fallback) fallback.style.display = "flex";
                          }}
                        />
                        <div
                          className="absolute inset-0 items-center justify-center"
                          style={{ display: "none", background: previewBg }}
                        >
                          <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                              backgroundImage: isLight
                                ? "linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px)"
                                : "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
                              backgroundSize: "24px 24px",
                            }}
                          />
                          <PreviewIcon category={project.category} color={previewIcon} />
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            backgroundImage: isLight
                              ? "linear-gradient(rgba(99,102,241,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.06) 1px,transparent 1px)"
                              : "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center">
                          <PreviewIcon category={project.category} color={previewIcon} />
                        </div>
                      </>
                    )}
                    <div
                      className="absolute bottom-0 left-0 right-0 h-10 pointer-events-none z-10"
                      style={{
                        background: isLight
                          ? "linear-gradient(to bottom,transparent,rgba(255,255,255,0.95))"
                          : "linear-gradient(to bottom,transparent,rgba(13,20,38,0.9))",
                      }}
                    />
                  </div>

                  {/* ── Card body ── */}
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    {/* Category badge + action buttons */}
                    <div className="flex items-start justify-between mb-3 sm:mb-4 relative z-10">
                      <span
                        className="text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full font-mono font-medium border"
                        style={{ background: bg, color: text, borderColor: border }}
                      >
                        {catLabel}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {hasGithub && (
                          <a
                            href={(project as any).githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="GitHub"
                            className={`transition-all duration-200 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                              isLight
                                ? "bg-indigo-50 text-indigo-500 hover:bg-indigo-100 border border-indigo-100"
                                : "bg-white/5 text-[#94a3b8] hover:bg-white/10 border border-white/8"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                            </svg>
                          </a>
                        )}
                        {hasDemo && (
                          <a
                            href={(project as any).demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            title="Live Demo"
                            className={`transition-all duration-200 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${
                              isLight
                                ? "bg-indigo-600 text-white hover:bg-indigo-700 border border-indigo-600"
                                : "bg-[#00f5d4]/15 text-[#00f5d4] hover:bg-[#00f5d4]/25 border border-[#00f5d4]/30"
                            }`}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>

                    <h3 className={`font-bold text-base sm:text-lg mb-1.5 sm:mb-2 relative z-10 ${isLight ? "text-indigo-950" : "text-white"}`}>
                      {project.title}
                    </h3>

                    <p className={`text-xs sm:text-sm leading-relaxed flex-1 relative z-10 ${isLight ? "text-indigo-700/70" : "text-[#64748b]"}`}>
                      {desc}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-4 sm:mt-5 relative z-10">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] sm:text-xs font-mono px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md ${
                            isLight
                              ? "bg-indigo-50 text-indigo-500 border border-indigo-100"
                              : "bg-white/5 text-[#64748b]"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom hint */}
                    {liveUrl && (
                      <div className={`flex items-center gap-1.5 mt-4 pt-3 border-t relative z-10 ${
                        isLight ? "border-indigo-100" : "border-white/6"
                      }`}>
                        <svg className={`w-3 h-3 ${isLight ? "text-indigo-400" : "text-[#00f5d4]/60"}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        <span className={`text-[10px] font-mono ${isLight ? "text-indigo-400" : "text-[#00f5d4]/60"}`}>
                          {hasDemo
                            ? (lang === "id" ? "Buka Demo" : "Open Demo")
                            : (lang === "id" ? "Lihat di GitHub" : "View on GitHub")}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        <AnimatePresence>
          {filteredProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-16"
            >
              <p className={`text-sm font-mono ${isLight ? "text-indigo-300" : "text-slate-600"}`}>
                {lang === "id" ? "Belum ada proyek di kategori ini." : "No projects in this category yet."}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}