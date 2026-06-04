"use client";
import { useEffect, useRef, useCallback } from "react";

// ─── Pixel art character — Minecraft / Roblox chibi style ──────────
// Canvas-drawn 16×24px characters (scale 2 → 32×48 rendered)
// Animations: walk, jump, wave, sit, idle

export interface PixelCharacterProps {
  isLight: boolean;
  mode?: "navbar" | "footer";
  className?: string;
}

// Colour palettes per theme
const PALETTES = {
  dark: {
    skin: "#f5c9a0", hair: "#2d1b0e",
    shirt: "#00f5d4", pants: "#7c3aed", shoes: "#1e1b4b",
    outline: "#00f5d4", wave: "#f59e0b",
    shadow: "rgba(0,245,212,0.15)",
  },
  light: {
    skin: "#f5c9a0", hair: "#2d1b0e",
    shirt: "#6366f1", pants: "#4338ca", shoes: "#1e1b4b",
    outline: "#6366f1", wave: "#f59e0b",
    shadow: "rgba(99,102,241,0.15)",
  },
  // 2nd character (footer) — colour variant
  dark2: {
    skin: "#f5c9a0", hair: "#92400e",
    shirt: "#7c3aed", pants: "#00f5d4", shoes: "#0f172a",
    outline: "#7c3aed", wave: "#f59e0b",
    shadow: "rgba(124,58,237,0.15)",
  },
  light2: {
    skin: "#f5c9a0", hair: "#92400e",
    shirt: "#a855f7", pants: "#6d28d9", shoes: "#1e1b4b",
    outline: "#a855f7", wave: "#f59e0b",
    shadow: "rgba(168,85,247,0.15)",
  },
  // 3rd character — extra colour variant
  dark3: {
    skin: "#f5c9a0", hair: "#1a1a2e",
    shirt: "#f59e0b", pants: "#b45309", shoes: "#0f172a",
    outline: "#f59e0b", wave: "#00f5d4",
    shadow: "rgba(245,158,11,0.15)",
  },
  light3: {
    skin: "#f5c9a0", hair: "#1a1a2e",
    shirt: "#f97316", pants: "#c2410c", shoes: "#1e1b4b",
    outline: "#f97316", wave: "#6366f1",
    shadow: "rgba(249,115,22,0.15)",
  },
} as const;
type Palette = (typeof PALETTES)[keyof typeof PALETTES];

// ─── Drawing helper ────────────────────────────────────────────────
type C = CanvasRenderingContext2D;

function rect(ctx: C, x: number, y: number, w: number, h: number, col: string, s: number) {
  ctx.fillStyle = col;
  ctx.fillRect(x * s, y * s, w * s, h * s);
}

// ─── Part = [x, y, w, h, colourKey] ─────────────────────────────────
type K = keyof Omit<Palette, "outline" | "shadow">;
type P = [number, number, number, number, K];

// HEAD (shared)
const HEAD: P[] = [
  [5, 0, 6, 6, "skin"],
  [5, 0, 6, 2, "hair"],
  [5, 0, 1, 3, "hair"],
  [10, 0, 1, 3, "hair"],
  [6, 2, 1, 1, "hair"],  // left eye
  [9, 2, 1, 1, "hair"],  // right eye
];

const HEAD_SMILE: P[] = [
  ...HEAD,
  [7, 4, 2, 1, "skin"],
  [6, 4, 1, 1, "hair"],
  [10, 4, 1, 1, "hair"],
];

// WALK 1 — right leg forward
const WALK1: P[] = [
  ...HEAD,
  [4, 6, 8, 6, "shirt"],
  [2, 6, 2, 5, "shirt"],   // L arm
  [10, 6, 2, 5, "shirt"],  // R arm
  [4, 12, 8, 4, "pants"],
  [4, 16, 4, 5, "pants"],  // L leg back
  [8, 15, 4, 5, "pants"],  // R leg forward
  [4, 21, 4, 3, "shoes"],
  [8, 20, 4, 3, "shoes"],
];

// WALK 2 — left leg forward
const WALK2: P[] = [
  ...HEAD,
  [4, 6, 8, 6, "shirt"],
  [2, 7, 2, 5, "shirt"],
  [10, 7, 2, 5, "shirt"],
  [4, 12, 8, 4, "pants"],
  [4, 15, 4, 5, "pants"],
  [8, 16, 4, 5, "pants"],
  [4, 20, 4, 3, "shoes"],
  [8, 21, 4, 3, "shoes"],
];

// JUMP
const JUMP_F: P[] = [
  ...HEAD,
  [4, 6, 8, 6, "shirt"],
  [1, 4, 3, 5, "shirt"],  // arms up
  [12, 4, 3, 5, "shirt"],
  [4, 12, 8, 4, "pants"],
  [4, 16, 3, 3, "pants"],
  [9, 16, 3, 3, "pants"],
  [4, 19, 3, 2, "shoes"],
  [9, 19, 3, 2, "shoes"],
];

// WAVE 1
const WAVE1: P[] = [
  ...HEAD_SMILE,
  [4, 6, 8, 6, "shirt"],
  [2, 6, 2, 5, "shirt"],
  [10, 3, 2, 5, "shirt"],  // R arm raised
  [12, 1, 3, 3, "wave"],   // waving hand
  [4, 12, 8, 4, "pants"],
  [4, 16, 4, 6, "pants"],
  [8, 16, 4, 6, "pants"],
  [4, 22, 4, 2, "shoes"],
  [8, 22, 4, 2, "shoes"],
];

// WAVE 2 (hand higher)
const WAVE2: P[] = [
  ...HEAD_SMILE,
  [4, 6, 8, 6, "shirt"],
  [2, 6, 2, 5, "shirt"],
  [10, 2, 2, 6, "shirt"],
  [12, 0, 3, 3, "wave"],
  [4, 12, 8, 4, "pants"],
  [4, 16, 4, 6, "pants"],
  [8, 16, 4, 6, "pants"],
  [4, 22, 4, 2, "shoes"],
  [8, 22, 4, 2, "shoes"],
];

// SIT
const SIT_F: P[] = [
  ...HEAD_SMILE,
  [4, 6, 8, 6, "shirt"],
  [1, 7, 3, 4, "shirt"],
  [12, 7, 3, 4, "shirt"],
  [4, 12, 8, 4, "pants"],
  [1, 16, 6, 3, "pants"],
  [9, 16, 6, 3, "pants"],
  [1, 19, 4, 2, "shoes"],
  [11, 19, 4, 2, "shoes"],
];

// IDLE (bob version = same as WALK1 frame but arms relaxed)
const IDLE_F: P[] = [
  ...HEAD,
  [4, 6, 8, 6, "shirt"],
  [2, 6, 2, 6, "shirt"],
  [10, 6, 2, 6, "shirt"],
  [4, 12, 8, 4, "pants"],
  [4, 16, 4, 6, "pants"],
  [8, 16, 4, 6, "pants"],
  [4, 22, 4, 2, "shoes"],
  [8, 22, 4, 2, "shoes"],
];

function drawChar(ctx: C, parts: P[], pal: Palette, s: number) {
  ctx.imageSmoothingEnabled = false;
  parts.forEach(([x, y, w, h, k]) => rect(ctx, x, y, w, h, pal[k] as string, s));
}

// ─── Per-character state ──────────────────────────────────────────
interface CharState {
  x: number;
  y: number;          // vertical offset (for jump)
  vel: number;        // vertical velocity
  dir: 1 | -1;
  phase: "walk" | "jump" | "wave" | "sit";
  walkIdx: number;
  waveIdx: number;
  frame: number;
  pauseTick: number;
  palette: Palette;
}

function makeChar(x: number, pal: Palette): CharState {
  return { x, y: 0, vel: 0, dir: 1, phase: "walk", walkIdx: 0, waveIdx: 0, frame: 0, pauseTick: 0, palette: pal };
}

// ─────────────────────────────────────────────────────────────────────
export default function PixelCharacter({ isLight, mode = "navbar", className = "" }: PixelCharacterProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charsRef  = useRef<CharState[]>([]);
  const rafRef    = useRef<number>(0);

  const SCALE  = 1;
  const CHAR_W = 16 * SCALE;  // 16
  const CHAR_H = 24 * SCALE;  // 24

  // Pick palettes
  const pal1 = isLight ? PALETTES.light  : PALETTES.dark;
  const pal2 = isLight ? PALETTES.light2 : PALETTES.dark2;
  const pal3 = isLight ? PALETTES.light3 : PALETTES.dark3;

  const initChars = useCallback((W: number) => {
    if (mode === "navbar") {
      // Three characters, staggered start positions
      const c1 = makeChar(-CHAR_W, pal1);
      c1.dir = 1;
      const c2 = makeChar(-CHAR_W * 5, pal2);
      c2.dir = 1;
      const c3 = makeChar(W + CHAR_W, pal3);
      c3.dir = -1;
      charsRef.current = [c1, c2, c3];
    } else {
      // Footer: two characters, starting at opposite ends
      const c1 = makeChar(-CHAR_W, pal1);
      c1.dir = 1;
      const c2 = makeChar(W + CHAR_W, pal2);
      c2.dir = -1;
      charsRef.current = [c1, c2];
    }
  }, [mode, pal1, pal2, pal3, CHAR_W]);

  const tick = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    charsRef.current.forEach((ch) => {
      ch.frame++;

      // ── State machine ──────────────────────────────────────────
      if (ch.phase === "walk") {
        ch.x += ch.dir * 1.1;

        if (ch.frame % 8 === 0) ch.walkIdx = (ch.walkIdx + 1) % 2;

        // Random jump
        if (ch.frame % 100 === 0 && Math.random() > 0.45) {
          ch.phase = "jump";
          ch.vel   = -6;
        }

        // Bounce / flip
        if (ch.dir === 1 && ch.x > W - CHAR_W - 4) {
          ch.dir = -1;
          if (Math.random() > 0.4) { ch.phase = "wave"; ch.pauseTick = 0; }
        }
        if (ch.dir === -1 && ch.x < 4) {
          ch.dir = 1;
          if (Math.random() > 0.4) { ch.phase = "wave"; ch.pauseTick = 0; }
        }

        // Random wave
        if (ch.frame % 240 === 0 && Math.random() > 0.5) {
          ch.phase = "wave"; ch.waveIdx = 0; ch.pauseTick = 0;
        }

      } else if (ch.phase === "jump") {
        ch.vel += 0.38;
        ch.y   += ch.vel;
        ch.x   += ch.dir * 1.3;

        if (ch.y >= 0) {
          ch.y   = 0;
          ch.vel = 0;
          ch.phase = "walk";
        }

      } else if (ch.phase === "wave") {
        ch.pauseTick++;
        if (ch.frame % 16 === 0) ch.waveIdx = (ch.waveIdx + 1) % 2;
        if (ch.pauseTick > 90) {
          ch.phase = "walk";
          ch.pauseTick = 0;
        }

      } else if (ch.phase === "sit") {
        ch.pauseTick++;
        if (ch.pauseTick > 120) { ch.phase = "walk"; ch.pauseTick = 0; }
      }

      // ── Shadow ──────────────────────────────────────────────────
      const shadowY = H - 3;
      ctx.fillStyle = ch.palette.shadow;
      ctx.beginPath();
      ctx.ellipse(
        ch.x + CHAR_W / 2, shadowY,
        CHAR_W * 0.45 - Math.abs(ch.y) * 0.03, 2.5,
        0, 0, Math.PI * 2
      );
      ctx.fill();

      // ── Draw character ──────────────────────────────────────────
      const drawY = H - CHAR_H - 2 + ch.y;

      ctx.save();
      ctx.imageSmoothingEnabled = false;

      if (ch.dir === -1) {
        ctx.translate(ch.x + CHAR_W, drawY);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(ch.x, drawY);
      }

      let parts: P[];
      switch (ch.phase) {
        case "jump": parts = JUMP_F; break;
        case "wave": parts = ch.waveIdx === 0 ? WAVE1 : WAVE2; break;
        case "sit":  parts = SIT_F; break;
        default:     parts = ch.walkIdx === 0 ? WALK1 : WALK2;
      }

      drawChar(ctx, parts, ch.palette, SCALE);
      ctx.restore();
    });

    rafRef.current = requestAnimationFrame(tick);
  }, [CHAR_W, CHAR_H, SCALE]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width  = canvas.offsetWidth  || 300;
      canvas.height = canvas.offsetHeight || (mode === "navbar" ? 48 : 52);
      // Re-init chars so positions are valid for new width
      initChars(canvas.width);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [tick, initChars, mode]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: "pixelated", display: "block", pointerEvents: "none" }}
    />
  );
}