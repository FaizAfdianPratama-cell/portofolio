"use client";
import { motion } from "framer-motion";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";
import { skills } from "@/data/portfolio";

const colorPalette = [
  "#3b82f6", "#f59e0b", "#8b5cf6", "#0ea5e9", "#10b981",
  "#f97316", "#ec4899", "#6366f1", "#777BB4", "#945db6",
];

const techs = skills.map((skill, index) => ({
  name: skill.name,
  color: colorPalette[index % colorPalette.length],
}));

const learning = [
  "Machine Learning", "Tableau", "Power BI", "Data Warehouse",
];

export default function Skills() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";

  return (
    <section
      id="skills"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 grid-bg mesh-gradient"
    >
      {/* Glow blobs */}
      {isLight ? (
        <>
          <div className="absolute top-1/3 left-1/4 w-48 sm:w-72 lg:w-80 h-48 sm:h-72 lg:h-80 rounded-full bg-indigo-400/20 blur-[80px] sm:blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-56 sm:w-80 lg:w-96 h-56 sm:h-80 lg:h-96 rounded-full bg-purple-400/15 blur-[100px] sm:blur-[120px] pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute top-1/3 left-1/4 w-48 sm:w-64 lg:w-72 h-48 sm:h-64 lg:h-72 rounded-full bg-[#7c3aed]/10 blur-[80px] sm:blur-[100px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-56 sm:w-72 lg:w-80 h-56 sm:h-72 lg:h-80 rounded-full bg-[#00f5d4]/7 blur-[100px] sm:blur-[120px] pointer-events-none" />
        </>
      )}

      {/* Section number watermark */}
      <div
        className="pointer-events-none absolute right-4 sm:right-8 top-8 sm:top-12 select-none font-extrabold leading-none"
        style={{
          fontSize: "clamp(5rem,14vw,9rem)",
          color: isLight ? "rgba(99,102,241,0.055)" : "rgba(255,255,255,0.03)",
          letterSpacing: "-0.04em",
        }}
      >
        02
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 lg:mb-14 text-center"
        >
          <p className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 ${isLight ? "text-indigo-500" : "text-[#00f5d4]"}`}>
            {t.skills.label[lang]}
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
            {t.skills.titlePre[lang]}{" "}{t.skills.title[lang]}
          </h2>
          <p className={`text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto ${isLight ? "text-indigo-600/70" : "text-slate-400"}`}>
            {t.skills.sub[lang]}
          </p>
        </motion.div>

        {/* ── Tech Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-3.5 mb-10 sm:mb-12">
          {techs.map((tech, i) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ y: -3, scale: 1.02 }}
              className={`rounded-xl px-4 py-3.5 transition-all duration-250 cursor-default ${
                isLight
                  ? "bg-white border border-indigo-100 shadow-sm hover:shadow-md hover:shadow-indigo-100/60 hover:border-indigo-200"
                  : "bg-white/4 border border-white/8 hover:bg-white/8 hover:border-white/16"
              }`}
            >
              <p className={`text-sm font-semibold leading-snug tracking-tight ${
                isLight ? "text-indigo-950" : "text-slate-200"
              }`}>
                {tech.name}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── Divider ── */}
        <div
          className="h-px mb-8 sm:mb-10"
          style={{
            background: isLight
              ? "rgba(99,102,241,0.12)"
              : "rgba(255,255,255,0.06)",
          }}
        />

        {/* ── Currently Learning ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p
            className="text-[10px] sm:text-xs font-mono tracking-widest uppercase mb-4"
            style={{ color: isLight ? "#a5b4fc" : "#334155" }}
          >
            {t.skills.learning[lang]}
          </p>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {learning.map((item, i) => (
              <motion.span
                key={item}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.35 }}
                viewport={{ once: true }}
                className={`text-[11px] sm:text-xs px-3.5 py-1.5 rounded-full font-medium border transition-all duration-200 ${
                  isLight
                    ? "bg-white border-indigo-100 text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50"
                    : "bg-white/4 border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-white/8"
                }`}
              >
                {item}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}