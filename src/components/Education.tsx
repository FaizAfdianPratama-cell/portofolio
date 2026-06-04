"use client";
import { motion } from "framer-motion";
import { education, certifications, internship } from "@/data/portfolio";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";

export default function Education() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";

  // ── Tokens ───────────────────────────────────────────────────────
  const accent    = isLight ? "#6366f1" : "#00f5d4";
  const accentAlt = isLight ? "#a855f7" : "#f59e0b";
  const headColor = isLight ? "#1e1b4b" : "#f1f5f9";
  const subColor  = isLight ? "#7c3aed" : "#00f5d4";
  const muted     = isLight ? "#9ca3af" : "#64748b";
  const lineGrad  = isLight
    ? "linear-gradient(180deg,rgba(99,102,241,0.45),rgba(99,102,241,0.03))"
    : "linear-gradient(180deg,rgba(0,245,212,0.4),rgba(0,245,212,0.02))";
  const divider   = isLight ? "rgba(99,102,241,0.12)" : "rgba(255,255,255,0.07)";
  const rowHover  = isLight ? "rgba(99,102,241,0.04)" : "rgba(255,255,255,0.03)";

  // ── Helpers ───────────────────────────────────────────────────────
  const SectionLabel = ({ text }: { text: string }) => (
    <div className="flex items-center gap-3 mb-5">
      <div className="flex-1 h-px" style={{ background: divider }} />
      <span
        className="text-[9px] font-bold tracking-[0.18em] uppercase px-2.5 py-0.5 rounded-full"
        style={{
          color: accent,
          background: isLight ? "rgba(99,102,241,0.07)" : "rgba(0,245,212,0.07)",
          border: `1px solid ${isLight ? "rgba(99,102,241,0.15)" : "rgba(0,245,212,0.12)"}`,
        }}
      >
        {text}
      </span>
      <div className="flex-1 h-px" style={{ background: divider }} />
    </div>
  );

  const fadeUp = { initial: { opacity: 0, y: 16 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

  // ── Compact timeline row ──────────────────────────────────────────
  // Layout: [dot] [year badge] [name · major]  — all on ONE line
  const TimelineRow = ({
    year, title, sub, color, glow, index,
  }: {
    year: string; title: string; sub: string;
    color: string; glow: string; index: number;
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      viewport={{ once: true }}
      className="relative py-2.5 px-3 rounded-xl transition-colors duration-200 group cursor-default"
      onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
    >
      {/* dot — always anchored to top of item */}
      <span
        className="absolute -left-[1.6rem] sm:-left-[1.85rem] top-[0.9rem]"
        style={{
          width: 8, height: 8, borderRadius: "50%",
          background: color,
          boxShadow: `0 0 0 3px ${glow}`,
          display: "block",
          flexShrink: 0,
        }}
      />

      {/* year badge on top, then name + sub below — consistent on all screen sizes */}
      <div className="flex flex-col gap-0.5">

        {/* year badge */}
        <span
          className="self-start text-[9px] font-mono font-semibold tracking-wider whitespace-nowrap px-1.5 py-0.5 rounded"
          style={{
            color,
            background: isLight
              ? color === accent ? "rgba(99,102,241,0.08)" : "rgba(168,85,247,0.08)"
              : color === accent ? "rgba(0,245,212,0.08)" : "rgba(245,158,11,0.08)",
            minWidth: 80,
            textAlign: "center",
          }}
        >
          {year}
        </span>

        {/* title */}
        <span className="text-sm font-semibold leading-snug" style={{ color: headColor }}>
          {title}
        </span>

        {/* sub */}
        <span className="text-[11px] font-medium leading-snug" style={{ color: sub === subColor ? subColor : accentAlt }}>
          {sub}
        </span>

      </div>
    </motion.div>
  );

  return (
    <section
      id="education"
      className="relative py-16 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 grid-bg mesh-gradient"
    >
      {/* blobs */}
      <div className="pointer-events-none absolute top-1/3 right-1/4 w-56 sm:w-80 h-56 sm:h-80 rounded-full opacity-20 blur-[90px]"
        style={{ background: isLight ? "#818cf8" : "#7c3aed" }} />
      <div className="pointer-events-none absolute bottom-1/3 left-1/4 w-64 sm:w-96 h-64 sm:h-96 rounded-full opacity-15 blur-[110px]"
        style={{ background: isLight ? "#c084fc" : "#00f5d4" }} />

      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-4 sm:right-8 top-8 sm:top-12 select-none font-extrabold leading-none"
        style={{
          fontSize: "clamp(5rem,14vw,9rem)",
          color: isLight ? "rgba(99,102,241,0.055)" : "rgba(255,255,255,0.03)",
          letterSpacing: "-0.04em",
        }}
      >
        03
      </div>

      <div className="relative z-10 max-w-xl mx-auto">

        {/* ── Header ── */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-10 sm:mb-12 lg:mb-14 text-center">
          <p className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 ${isLight ? "text-indigo-500" : "text-[#00f5d4]"}`}>
            {t.education.label[lang]}
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
            {t.education.titlePre[lang]}{" "}{t.education.title[lang]}
          </h2>
          <p className={`text-xs sm:text-sm max-w-xs mx-auto ${isLight ? "text-indigo-600/70" : "text-slate-400"}`}>
            {t.education.sub[lang]}
          </p>
        </motion.div>

        {/* ══════════════════════════════
            Education
        ══════════════════════════════ */}
        <motion.div {...fadeUp} transition={{ duration: 0.45 }} className="mb-8">
          <SectionLabel text={t.education.educationLabel[lang]} />
          <div className="relative pl-6 sm:pl-7">
            <div className="absolute left-[3px] top-2 bottom-2 w-px" style={{ background: lineGrad }} />
            <div className="flex flex-col gap-0.5">
              {education.map((item, i) => (
                <TimelineRow
                  key={i} index={i}
                  year={typeof item.year === "string" ? item.year : item.year[lang]}
                  title={item.school}
                  sub={typeof item.major === "string" ? item.major : item.major[lang]}
                  color={accent}
                  glow={isLight ? "rgba(99,102,241,0.15)" : "rgba(0,245,212,0.13)"}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* ══════════════════════════════
            Internship
        ══════════════════════════════ */}
        {internship.length > 0 && (
          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.05 }} className="mb-8">
            <SectionLabel text={t.education.internshipLabel[lang]} />
            <div className="relative pl-6 sm:pl-7">
              <div className="absolute left-[3px] top-2 bottom-2 w-px" style={{ background: lineGrad }} />
              <div className="flex flex-col gap-0.5">
                {internship.map((item, i) => (
                  <TimelineRow
                    key={i} index={i}
                    year={typeof item.year === "string" ? item.year : item.year[lang]}
                    title={item.company}
                    sub={typeof item.role === "string" ? item.role : item.role[lang]}
                    color={accentAlt}
                    glow={isLight ? "rgba(168,85,247,0.15)" : "rgba(245,158,11,0.13)"}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════════════════════════════
            Certifications — 2-col grid
        ══════════════════════════════ */}
        {certifications.length > 0 && (
          <motion.div {...fadeUp} transition={{ duration: 0.45, delay: 0.1 }}>
            <SectionLabel text={t.education.certLabel[lang]} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {certifications.map((cert, i) => (
                <motion.a
                  key={i}
                  href={cert.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  viewport={{ once: true }}
                  className="group flex items-center gap-2.5 no-underline rounded-xl px-3 py-2.5 transition-colors duration-200"
                  style={{ border: `1px solid ${divider}` }}
                  onMouseEnter={e => (e.currentTarget.style.background = rowHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  {/* icon */}
                  <span
                    className="flex-shrink-0 flex items-center justify-center rounded-lg"
                    style={{ width: 28, height: 28, background: "rgba(245,158,11,0.10)", border: "1px solid rgba(245,158,11,0.2)" }}
                  >
                    <svg className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </span>

                  {/* text */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold truncate group-hover:underline" style={{ color: headColor }}>
                      {cert.name}
                    </p>
                    <p className="text-[10px] mt-0.5" style={{ color: muted }}>
                      {cert.issuer} · {cert.year}
                    </p>
                  </div>

                  {/* arrow */}
                  <svg
                    className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-50 transition-all duration-200"
                    style={{ color: accent }}
                    fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </section>
  );
}