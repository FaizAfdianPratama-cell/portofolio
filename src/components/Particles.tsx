"use client";
import { useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useApp();
  const isLight = theme === "light";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const setSize = () => {
      // pakai offsetParent/parentElement untuk dapat full page height
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : document.documentElement.scrollWidth;
      canvas.height = parent ? parent.offsetHeight : document.documentElement.scrollHeight;
    };
    setSize();

    const resizeObserver = new ResizeObserver(() => setSize());
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);
    window.addEventListener("resize", setSize);

    const darkColors  = ["#00f5d4", "#7c3aed", "#f59e0b", "#00f5d4"];
    const lightColors = ["#6366f1", "#a855f7", "#3b82f6", "#8b5cf6"];
    const colors      = isLight ? lightColors : darkColors;
    const lineColor   = isLight ? "#6366f1"   : "#00f5d4";
    const lineAlpha   = isLight ? 0.15        : 0.08;

    const W = () => canvas.width;
    const H = () => canvas.height;

    const makeParticle = () => ({
      x:       Math.random() * W(),
      y:       Math.random() * H(),
      vx:      (Math.random() - 0.5) * 0.45,
      vy:      (Math.random() - 0.5) * 0.45,
      size:    Math.random() * 2.2 + 0.8,
      opacity: isLight ? Math.random() * 0.5 + 0.25 : Math.random() * 0.45 + 0.12,
      color:   colors[Math.floor(Math.random() * colors.length)],
    });

    // jumlah partikel proporsional terhadap area
    const getCount = () => Math.min(Math.max(Math.floor((W() * H()) / 14000), 100), 220);
    let particles = Array.from({ length: getCount() }, makeParticle);

    let raf: number;
    const draw = () => {
      const w = W(), h = H();
      ctx.clearRect(0, 0, w, h);

      // kalau canvas resize, sesuaikan jumlah partikel
      const needed = getCount();
      while (particles.length < needed) particles.push(makeParticle());
      if (particles.length > needed) particles = particles.slice(0, needed);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[j].x - p.x;
          const dy = particles[j].y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = lineColor;
            ctx.globalAlpha = (1 - dist / 130) * lineAlpha;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
        ctx.globalAlpha = 1;
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("resize", setSize);
    };
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
      }}
    />
  );
}