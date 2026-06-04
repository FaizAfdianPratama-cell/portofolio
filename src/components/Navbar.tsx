"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";
import PixelCharacter from "@/components/PixelCharacter";

// ── Mini canvas particles ─────────────────────────────────────────
function NavParticles({ isLight }: { isLight: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;
    canvas.width  = W;
    canvas.height = H;

    const colors   = isLight
      ? ["#6366f1", "#a855f7", "#3b82f6", "#8b5cf6"]
      : ["#00f5d4", "#7c3aed", "#f59e0b", "#00f5d4"];
    const lineCol  = isLight ? "#6366f1" : "#00f5d4";
    const lineAlpha = isLight ? 0.18 : 0.12;

    const COUNT = 18;
    type P = { x: number; y: number; vx: number; vy: number; r: number; opacity: number; color: string };
    const pts: P[] = Array.from({ length: COUNT }, () => ({
      x:       Math.random() * W,
      y:       Math.random() * H,
      vx:      (Math.random() - 0.5) * 0.55,
      vy:      (Math.random() - 0.5) * 0.55,
      r:       Math.random() * 1.5 + 0.8,
      opacity: isLight ? Math.random() * 0.5 + 0.3 : Math.random() * 0.55 + 0.2,
      color:   colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      pts.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[j].x - p.x, dy = pts[j].y - p.y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = lineCol;
            ctx.globalAlpha = (1 - d / 80) * lineAlpha;
            ctx.lineWidth   = 0.5;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, [isLight]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        borderRadius: "inherit",
      }}
    />
  );
}

// ── Scroll progress bar ───────────────────────────────────────────
function ProgressBar({ isLight }: { isLight: boolean }) {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const bar = barRef.current;
      if (!bar) return;
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct  = docH > 0 ? Math.min(window.scrollY / docH, 1) * 100 : 0;
      bar.style.width = `${pct}%`;
    };
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <>
      <div
        className="absolute bottom-0 left-0 right-0 h-[2.5px] pointer-events-none z-10"
        style={{ background: isLight ? "rgba(99,102,241,0.08)" : "rgba(255,255,255,0.04)" }}
      />
      <div
        ref={barRef}
        className="absolute bottom-0 left-0 h-[2.5px] pointer-events-none z-10"
        style={{
          width: "0%",
          background: isLight
            ? "linear-gradient(90deg,#6366f1,#a855f7)"
            : "linear-gradient(90deg,#00f5d4,#7c3aed)",
          boxShadow: isLight
            ? "0 0 6px rgba(99,102,241,0.7)"
            : "0 0 6px rgba(0,245,212,0.7)",
        }}
      />
    </>
  );
}

export default function Navbar() {
  const { theme, lang, toggleTheme, toggleLang } = useApp();
  const [scrolled,       setScrolled]       = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [activeSection,  setActiveSection]  = useState("about");
  const isLight = theme === "light";

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      const sections = ["about", "skills", "education", "projects", "contact"];
      const current = sections.find((id) => {
        const el = document.getElementById(id);
        if (!el) return false;
        const rect = el.getBoundingClientRect();
        return rect.top <= 120 && rect.bottom >= 120;
      });
      if (current) setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const links = [
    { label: t.nav.about[lang],     href: "#about",     id: "about" },
    { label: t.nav.skills[lang],    href: "#skills",    id: "skills" },
    { label: t.nav.education[lang], href: "#education", id: "education" },
    { label: t.nav.projects[lang],  href: "#projects",  id: "projects" },
    { label: t.nav.contact[lang],   href: "#contact",   id: "contact" },
  ];

  const borderColor = isLight
    ? "1px solid rgba(99,102,241,0.15)"
    : "1px solid rgba(255,255,255,0.07)";

  const pillBg = scrolled
    ? isLight ? "rgba(255,255,255,0.92)" : "rgba(6,11,24,0.92)"
    : isLight ? "rgba(255,255,255,0.60)" : "rgba(6,11,24,0.50)";

  const pillShadow = scrolled
    ? isLight
      ? "0 8px 32px rgba(99,102,241,0.10), 0 2px 8px rgba(0,0,0,0.06)"
      : "0 8px 32px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.2)"
    : "none";

  const btnClass = isLight
    ? "border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50"
    : "border border-white/10 text-slate-400 hover:border-[#00f5d4]/35 hover:text-[#00f5d4] hover:bg-[#00f5d4]/5";

  return (
    <>
      {/* ── Main Navbar ── */}
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50"
      >
        <div className="mx-auto mt-3 px-3 sm:px-4 max-w-5xl">
          <div
            className="relative flex items-center justify-between h-12 px-3 sm:px-5 rounded-2xl transition-all duration-500 overflow-hidden"
            style={{
              background: pillBg,
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: borderColor,
              boxShadow: pillShadow,
            }}
          >
            <ProgressBar isLight={isLight} />

            {/* Logo */}
            <a href="#" className="group relative flex-shrink-0 z-10">
              <div
                className="absolute -inset-2 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: isLight
                    ? "radial-gradient(ellipse, rgba(99,102,241,0.2), transparent)"
                    : "radial-gradient(ellipse, rgba(0,245,212,0.15), transparent)",
                }}
              />
              <motion.img
                src="/logo.png"
                alt="Logo"
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.2 }}
                className={[
                  "relative h-6 w-auto object-contain transition-all duration-300",
                  isLight
                    ? "opacity-75 hover:opacity-100"
                    : "brightness-0 invert opacity-65 hover:opacity-100",
                ].join(" ")}
              />
            </a>

            {/* Canvas particles */}
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
              <NavParticles isLight={isLight} />
            </div>

            {/* Pixel character */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{ zIndex: 2, borderRadius: "inherit" }}
            >
              <PixelCharacter isLight={isLight} mode="navbar" className="w-full h-full" />
            </div>

            {/* Desktop nav links */}
            <ul className="hidden md:flex items-center gap-0.5 z-10 relative">
              {links.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className={[
                        "relative px-3.5 py-2 text-[13px] font-medium transition-all duration-200 rounded-xl block",
                        isActive
                          ? isLight ? "text-indigo-600" : "text-[#00f5d4]"
                          : isLight
                            ? "text-slate-500 hover:text-slate-800"
                            : "text-slate-400 hover:text-white",
                      ].join(" ")}
                    >
                      {link.label}
                      {isActive && (
                        <motion.span
                          layoutId="pill"
                          className="absolute inset-0 rounded-xl -z-10"
                          style={{
                            background: isLight
                              ? "rgba(99,102,241,0.08)"
                              : "rgba(0,245,212,0.07)",
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Right controls */}
            <div className="flex items-center gap-1.5 z-10 relative">
              {/* Lang toggle desktop — text only, no flag */}
              <button
                onClick={toggleLang}
                className={[
                  "hidden sm:flex items-center h-8 px-3 rounded-xl text-[11px] font-mono font-semibold transition-all duration-200 tracking-wider",
                  btnClass,
                ].join(" ")}
              >
                {lang === "id" ? "ID" : "EN"}
              </button>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                className={[
                  "h-8 w-8 rounded-xl flex items-center justify-center transition-all duration-200",
                  btnClass,
                ].join(" ")}
              >
                <motion.div
                  key={theme}
                  initial={{ rotate: -20, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25 }}
                >
                  {isLight ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  )}
                </motion.div>
              </button>

              {/* Lang toggle mobile — text only */}
              <button
                onClick={toggleLang}
                aria-label="Toggle language"
                className={[
                  "sm:hidden h-8 px-2.5 rounded-xl flex items-center justify-center text-[11px] font-mono font-semibold tracking-wider transition-all duration-200",
                  btnClass,
                ].join(" ")}
              >
                {lang === "id" ? "ID" : "EN"}
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
                className={[
                  "md:hidden h-8 w-8 rounded-xl flex flex-col items-center justify-center gap-[4.5px] transition-all duration-200",
                  btnClass,
                ].join(" ")}
              >
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block w-3.5 h-px bg-current rounded-full"
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-3.5 h-px bg-current rounded-full"
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="block w-3.5 h-px bg-current rounded-full"
                />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 md:hidden"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%", opacity: 0.5 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 md:hidden flex flex-col"
              style={{
                background: isLight ? "rgba(255,255,255,0.97)" : "rgba(8,14,30,0.97)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                borderLeft: isLight
                  ? "1px solid rgba(99,102,241,0.12)"
                  : "1px solid rgba(255,255,255,0.06)",
                boxShadow: isLight
                  ? "-16px 0 48px rgba(99,102,241,0.08)"
                  : "-16px 0 48px rgba(0,0,0,0.4)",
              }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 h-14"
                style={{
                  borderBottom: isLight
                    ? "1px solid rgba(99,102,241,0.08)"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <img
                  src="/logo.png"
                  alt="Logo"
                  className={[
                    "h-6 w-auto object-contain",
                    isLight ? "opacity-75" : "brightness-0 invert opacity-65",
                  ].join(" ")}
                />
                <button
                  onClick={() => setMenuOpen(false)}
                  className={[
                    "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                    isLight
                      ? "text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                      : "text-slate-500 hover:bg-white/5 hover:text-slate-300",
                  ].join(" ")}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto">
                {links.map((link, i) => {
                  const isActive = activeSection === link.id;
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.055, duration: 0.3 }}
                      className={[
                        "relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 overflow-hidden",
                        isActive
                          ? isLight ? "text-indigo-600" : "text-[#00f5d4]"
                          : isLight
                            ? "text-slate-500 hover:text-slate-800"
                            : "text-slate-400 hover:text-white",
                      ].join(" ")}
                      style={{
                        background: isActive
                          ? isLight ? "rgba(99,102,241,0.07)" : "rgba(0,245,212,0.06)"
                          : "transparent",
                      }}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="drawer-bar"
                          className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                          style={{ background: isLight ? "#6366f1" : "#00f5d4" }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <span
                        className="text-[10px] font-mono w-5 flex-shrink-0 transition-all duration-200"
                        style={{
                          color: isActive
                            ? isLight ? "#6366f1" : "#00f5d4"
                            : isLight ? "#cbd5e1" : "#334155",
                        }}
                      >
                        0{i + 1}
                      </span>
                      <span className="flex-1">{link.label}</span>
                      {isActive && (
                        <svg
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: isLight ? "#6366f1" : "#00f5d4" }}
                          fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </motion.a>
                  );
                })}
              </nav>

              {/* ── Pixel character strip — REMOVED from drawer so it doesn't block controls ── */}

              {/* Bottom controls */}
              <div
                className="px-4 py-4 flex gap-2"
                style={{
                  borderTop: isLight
                    ? "1px solid rgba(99,102,241,0.08)"
                    : "1px solid rgba(255,255,255,0.05)",
                }}
              >
                {/* Lang toggle — text only ID/EN, no flag */}
                <button
                  onClick={toggleLang}
                  className={[
                    "flex-1 flex items-center justify-center gap-2 h-9 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all duration-200",
                    btnClass,
                  ].join(" ")}
                >
                  {lang === "id" ? "ID" : "EN"}
                </button>

                <button
                  onClick={toggleTheme}
                  aria-label="Toggle theme"
                  className={[
                    "h-9 w-9 flex-shrink-0 rounded-xl flex items-center justify-center transition-all duration-200",
                    btnClass,
                  ].join(" ")}
                >
                  {isLight ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  ) : (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707.707M6.343 6.343l-.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}