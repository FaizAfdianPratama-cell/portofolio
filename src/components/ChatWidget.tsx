"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "../context/AppContext";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED: { id: string; en: string }[] = [
  { id: "Apa skill utama Faiz?",         en: "What are Faiz's main skills?"     },
  { id: "Ceritakan proyek Faiz",          en: "Tell me about Faiz's projects"    },
  { id: "Bagaimana cara kontak Faiz?",    en: "How to contact Faiz?"             },
  { id: "Bantu saya belajar Python 🐍",   en: "Help me learn Python 🐍"          },
];

function GeminiLogo({ size = 20 }: { size?: number }) {
  return (
    <img
      src="/gemini.png"
      alt="Gemini"
      width={size}
      height={size}
      style={{ display: "block", objectFit: "contain", flexShrink: 0 }}
    />
  );
}

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "linear-gradient(135deg,#4285F4,#9B72F8,#EA4335)",
            display: "block",
          }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.16 }}
        />
      ))}
    </div>
  );
}

function ChatBubbleHint({ lang, isLight, onDismiss, position }: {
  lang: string; isLight: boolean; onDismiss: () => void;
  position: { x: number; y: number };
}) {
  const text = lang === "id" ? "Tanya apa saja, atau tentang Faiz!" : "Ask anything, or about Faiz!";

  // Position bubble above/left of FAB — SSR-safe
  const bvw = typeof window !== "undefined" ? window.innerWidth  : 400;
  const bvh = typeof window !== "undefined" ? window.innerHeight : 800;
  const bubbleRight  = bvw - position.x - 26;
  const bubbleBottom = bvh - position.y + 10;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.88 }}
      transition={{ delay: 1.4, duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        bottom: bubbleBottom,
        right: Math.max(bubbleRight - 60, 8),
        zIndex: 49,
        display: "flex", alignItems: "center", gap: 6,
        background: isLight ? "#fff" : "#2A2A2E",
        border: `1px solid ${isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)"}`,
        borderRadius: 20, padding: "7px 10px",
        boxShadow: isLight ? "0 2px 12px rgba(0,0,0,0.10)" : "0 2px 16px rgba(0,0,0,0.4)",
        whiteSpace: "nowrap",
      }}
    >
      <GeminiLogo size={14} />
      <span style={{ fontSize: 12, fontWeight: 500, color: isLight ? "#222" : "#E0E0E0" }}>
        {text}
      </span>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(); }}
        style={{
          marginLeft: 2, width: 16, height: 16, borderRadius: "50%",
          border: "none", background: "transparent", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: isLight ? "#999" : "#666", fontSize: 14, lineHeight: 1, padding: 0,
        }}
      >×</button>
    </motion.div>
  );
}

function DraggableFAB({
  children,
  onPositionChange,
}: {
  children: React.ReactNode;
  onPositionChange: (pos: { x: number; y: number }) => void;
}) {
  const fabRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, ex: 0, ey: 0 });

  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setPos({ x: window.innerWidth - 72, y: window.innerHeight - 72 });
  }, []);

  useEffect(() => {
    const onResize = () => {
      setPos(prev => ({
        x: Math.min(prev.x, window.innerWidth - 72),
        y: Math.min(prev.y, window.innerHeight - 72),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    onPositionChange(pos);
  }, [pos, onPositionChange]);

  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

  const onPointerDown = (e: React.PointerEvent) => {
    isDragging.current = false;
    dragStart.current = {
      mx: e.clientX,
      my: e.clientY,
      ex: pos.x,
      ey: pos.y,
    };

    const onMove = (ev: PointerEvent) => {
      const dx = ev.clientX - dragStart.current.mx;
      const dy = ev.clientY - dragStart.current.my;
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
        isDragging.current = true;
      }
      if (!isDragging.current) return;
      const newX = clamp(dragStart.current.ex + dx, 8, (window?.innerWidth  ?? 400) - 60);
      const newY = clamp(dragStart.current.ey + dy, 8, (window?.innerHeight ?? 800) - 60);
      setPos({ x: newX, y: newY });
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={fabRef}
      onPointerDown={onPointerDown}
      style={{
        position: "fixed",
        left: pos.x,
        top: pos.y,
        zIndex: 9999,
        touchAction: "none",
        userSelect: "none",
        cursor: isDragging.current ? "grabbing" : "grab",
      }}
    >
      {children}
    </div>
  );
}

export default function ChatWidget() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";

  const [mounted, setMounted]             = useState(false);
  const [open, setOpen]                   = useState(false);
  const [messages, setMessages]           = useState<Message[]>([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const [isMobile, setIsMobile]           = useState(false);
  const [fabPos, setFabPos]               = useState({ x: 0, y: 0 });
  const [navOpen, setNavOpen]             = useState(false);

  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setNavOpen(document.body.style.overflow === "hidden" && !open);
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => observer.disconnect();
  }, [open]);

  useEffect(() => {
    if (isMobile) document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => textareaRef.current?.focus(), 300);
  }, [open]);

  const handleFabClick = useCallback(() => {
    setOpen(prev => !prev);
    setBubbleVisible(false);
  }, []);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: trimmed }];
    setMessages(newMessages);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setLoading(true);
    setShowSuggested(false);
    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages([...newMessages, {
        role: "assistant",
        content: data.reply || data.error || "...",
      }]);
    } catch {
      setMessages([...newMessages, {
        role: "assistant",
        content: lang === "id"
          ? "Maaf, terjadi kesalahan. Coba lagi ya! 😅"
          : "Sorry, something went wrong. Please try again! 😅",
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Palette ── */
  const BG        = isLight ? "#F8F9FA"           : "#1E1F20";
  const SURFACE   = isLight ? "#FFFFFF"           : "#282A2C";
  const BORDER    = isLight ? "rgba(0,0,0,0.08)"  : "rgba(255,255,255,0.08)";
  const TEXT_PRI  = isLight ? "#1F1F1F"           : "#E3E3E3";
  const TEXT_MUT  = isLight ? "#74777F"           : "#8E918F";
  const INPUT_BG  = isLight ? "#F0F4F9"           : "#303134";
  const CHIP_BG   = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.05)";
  const CHIP_BOR  = isLight ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.09)";
  const USER_BG   = isLight ? "#E8F0FE"           : "#394457";
  const USER_TEXT = isLight ? "#1A3A6B"           : "#C2D3F5";

  const placeholder = lang === "id" ? "Tanya apa saja..." : "Ask me anything...";
  const greetTitle  = lang === "id" ? "Halo! 👋" : "Hello! 👋";
  const greetSub    = lang === "id"
    ? "Mau tanya soal Faiz, atau butuh bantuan lain?"
    : "Ask about Faiz, or anything else!";

  /* ── Panel position relative to FAB ── */
  const vw = typeof window !== "undefined" ? window.innerWidth  : 400;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;
  const panelRight  = isMobile ? 0 : Math.max(vw - fabPos.x - 52, 8);
  const panelBottom = isMobile ? 0 : Math.max(vh - fabPos.y + 8, 80);

  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed", inset: 0, zIndex: 9998,
        width: "100%", height: "100%",
        borderRadius: 0, display: "flex", flexDirection: "column",
        background: BG, overflow: "hidden",
      }
    : {
        position: "fixed",
        bottom: panelBottom,
        right: panelRight,
        zIndex: 9998,
        width: "min(420px, calc(100vw - 40px))",
        height: "min(600px, calc(100vh - 110px))",
        borderRadius: 20, display: "flex", flexDirection: "column",
        background: BG,
        border: `1px solid ${BORDER}`,
        overflow: "hidden",
        boxShadow: isLight
          ? "0 12px 48px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 12px 48px rgba(0,0,0,0.60), 0 2px 8px rgba(0,0,0,0.3)",
      };

  const fabVisible = mounted && !(isMobile && open) && !navOpen;

  return (
    <>
      <AnimatePresence>
        {mounted && !open && bubbleVisible && !navOpen && (
          <ChatBubbleHint
            lang={lang}
            isLight={isLight}
            onDismiss={() => setBubbleVisible(false)}
            position={fabPos}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {fabVisible && (
          <DraggableFAB onPositionChange={setFabPos}>
            <motion.button
              key="fab"
              onClick={handleFabClick}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label="Chat with AI"
              title={lang === "id" ? "Seret untuk pindahkan • Ketuk untuk buka" : "Drag to move • Tap to open"}
              style={{
                width: 52, height: 52, borderRadius: "50%",
                background: isLight ? "rgba(255,255,255,0.92)" : "rgba(40,42,44,0.92)",
                border: `1px solid ${BORDER}`,
                backdropFilter: "blur(12px)",
                cursor: "pointer", padding: 0, outline: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: isLight ? "0 4px 20px rgba(0,0,0,0.14)" : "0 4px 20px rgba(0,0,0,0.5)",
              }}
            >
              <AnimatePresence mode="wait">
                {open ? (
                  <motion.div key="x"
                    initial={{ rotate: -90, opacity: 0, scale: 0.7 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.7 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                      stroke={isLight ? "#444" : "#ccc"} strokeWidth={2.3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div key="logo"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    <GeminiLogo size={36} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Drag hint tooltip — shows once */}
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 3, duration: 0.4 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 6px)",
                right: 0,
                background: isLight ? "rgba(0,0,0,0.75)" : "rgba(255,255,255,0.15)",
                color: "#fff",
                fontSize: 10,
                padding: "3px 8px",
                borderRadius: 8,
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              {lang === "id" ? "Seret untuk pindah" : "Drag to move"}
            </motion.div>
          </DraggableFAB>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            initial={isMobile ? { y: "100%" } : { opacity: 0, y: 20, scale: 0.95 }}
            animate={isMobile ? { y: 0 }     : { opacity: 1, y: 0, scale: 1 }}
            exit={isMobile    ? { y: "100%" } : { opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={panelStyle}
          >
            <div style={{
              flexShrink: 0, background: SURFACE,
              borderBottom: `1px solid ${BORDER}`,
              paddingTop: isMobile ? "max(12px, env(safe-area-inset-top))" : 12,
              paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <GeminiLogo size={isMobile ? 26 : 28} />
                <div>
                  <p style={{ fontSize: 15, fontWeight: 600, color: TEXT_PRI, lineHeight: 1.2, margin: 0 }}>
                    Faiz AI
                  </p>
                  <p style={{ fontSize: 11, color: TEXT_MUT, marginTop: 1 }}>
                    {lang === "id"
                      ? "Powered by Gemini · Tanya apa saja"
                      : "Powered by Gemini · Ask anything"}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {messages.length > 0 && (
                  <button
                    onClick={() => { setMessages([]); setShowSuggested(true); }}
                    style={{
                      fontSize: 11, color: TEXT_MUT, background: "transparent",
                      border: `1px solid ${BORDER}`, borderRadius: 8,
                      padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap",
                    }}
                  >
                    {lang === "id" ? "Hapus" : "Clear"}
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  style={{
                    width: 34, height: 34, borderRadius: "50%",
                    border: "none",
                    background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)",
                    cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", flexShrink: 0,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke={isLight ? "#444" : "#ccc"} strokeWidth={2.3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div style={{
              flex: 1, overflowY: "auto",
              padding: messages.length === 0 ? 0 : "16px 16px 4px",
              display: "flex", flexDirection: "column",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "thin",
              scrollbarColor: `${BORDER} transparent`,
            }}>
              {messages.length === 0 && (
                <div style={{
                  flex: 1, display: "flex", flexDirection: "column",
                  justifyContent: "center",
                  padding: isMobile ? "32px 20px 20px" : "28px 20px 16px",
                }}>
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <p style={{ fontSize: isMobile ? 14 : 13, color: TEXT_MUT, marginBottom: 4 }}>{greetTitle}</p>
                    <p style={{
                      fontSize: isMobile ? 21 : 19, fontWeight: 700,
                      color: TEXT_PRI, lineHeight: 1.3,
                      marginBottom: isMobile ? 28 : 20,
                    }}>{greetSub}</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
                    style={{ display: "flex", gap: 6, marginBottom: isMobile ? 18 : 14, flexWrap: "wrap" }}
                  >
                    {[
                      { id: "👤 Tentang Faiz", en: "👤 About Faiz" },
                      { id: "🌐 Tanya Umum",   en: "🌐 General Q&A" },
                    ].map((pill) => (
                      <span key={pill.id} style={{
                        fontSize: 11, fontWeight: 500, color: TEXT_MUT,
                        background: CHIP_BG, border: `1px solid ${CHIP_BOR}`,
                        borderRadius: 20, padding: "4px 10px",
                      }}>
                        {pill[lang as "id" | "en"]}
                      </span>
                    ))}
                  </motion.div>

                  {showSuggested && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
                      style={{ display: "flex", flexDirection: "column", gap: isMobile ? 10 : 8 }}
                    >
                      {SUGGESTED.map((s, i) => (
                        <motion.button
                          key={i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.22 + i * 0.07 }}
                          onClick={() => sendMessage(s[lang as "id" | "en"])}
                          whileHover={{
                            backgroundColor: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.09)",
                            x: 2,
                          }}
                          whileTap={{ scale: 0.98 }}
                          style={{
                            display: "flex", alignItems: "center", gap: 12,
                            textAlign: "left",
                            padding: isMobile ? "13px 16px" : "11px 14px",
                            borderRadius: 14,
                            border: `1px solid ${CHIP_BOR}`,
                            background: CHIP_BG,
                            color: TEXT_PRI,
                            fontSize: isMobile ? 14 : 13,
                            fontWeight: 400, cursor: "pointer",
                            transition: "background 0.15s",
                            width: "100%",
                          }}
                        >
                          <GeminiLogo size={isMobile ? 18 : 16} />
                          {s[lang as "id" | "en"]}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </div>
              )}

              {messages.length > 0 && messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginBottom: isMobile ? 18 : 16 }}
                >
                  {msg.role === "user" ? (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <div style={{
                        maxWidth: isMobile ? "85%" : "80%",
                        background: USER_BG, color: USER_TEXT,
                        borderRadius: "18px 18px 4px 18px",
                        padding: isMobile ? "11px 15px" : "10px 14px",
                        fontSize: isMobile ? 14 : 13,
                        lineHeight: 1.55, whiteSpace: "pre-wrap", wordBreak: "break-word",
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ flexShrink: 0, marginTop: 2 }}>
                        <GeminiLogo size={isMobile ? 24 : 22} />
                      </div>
                      <div style={{
                        fontSize: isMobile ? 14 : 13, lineHeight: 1.65,
                        color: TEXT_PRI, whiteSpace: "pre-wrap",
                        wordBreak: "break-word", flex: 1, minWidth: 0,
                      }}>
                        {msg.content}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}
                >
                  <GeminiLogo size={isMobile ? 24 : 22} />
                  <TypingDots />
                </motion.div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input area */}
            <div style={{
              flexShrink: 0, background: SURFACE,
              borderTop: `1px solid ${BORDER}`,
              padding: isMobile
                ? "10px 14px max(12px, env(safe-area-inset-bottom))"
                : "12px 14px 10px",
            }}>
              <div style={{
                background: INPUT_BG, borderRadius: 20,
                padding: "10px 12px 8px",
                display: "flex", flexDirection: "column", gap: 6,
              }}>
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = "auto";
                    e.target.style.height = Math.min(e.target.scrollHeight, isMobile ? 120 : 96) + "px";
                  }}
                  onKeyDown={(e) => {
                    if (!isMobile && e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage(input);
                    }
                  }}
                  placeholder={placeholder}
                  disabled={loading}
                  rows={1}
                  style={{
                    width: "100%", resize: "none",
                    background: "transparent", border: "none", outline: "none",
                    fontSize: isMobile ? 15 : 13, lineHeight: 1.5,
                    color: TEXT_PRI, fontFamily: "inherit",
                    overflowY: "hidden", caretColor: "#4285F4",
                    touchAction: "manipulation",
                  }}
                />

                <div style={{
                  display: "flex", alignItems: "center",
                  justifyContent: "space-between", minHeight: 32,
                }}>
                  <span style={{ fontSize: 11, color: TEXT_MUT, userSelect: "none" }}>
                    {isMobile
                      ? (lang === "id" ? "Ketuk kirim →" : "Tap send →")
                      : (lang === "id" ? "Enter untuk kirim" : "Enter to send")}
                  </span>

                  <motion.button
                    onClick={() => sendMessage(input)}
                    disabled={loading || !input.trim()}
                    whileHover={!loading && input.trim() ? { scale: 1.08 } : {}}
                    whileTap={!loading && input.trim() ? { scale: 0.9 } : {}}
                    style={{
                      width: isMobile ? 38 : 34, height: isMobile ? 38 : 34,
                      borderRadius: "50%", border: "none",
                      cursor: loading || !input.trim() ? "default" : "pointer",
                      background: loading || !input.trim()
                        ? "transparent"
                        : "linear-gradient(135deg,#4285F4,#9B72F8,#EA4335)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      opacity: loading || !input.trim() ? 0.3 : 1,
                      transition: "all 0.2s", flexShrink: 0,
                    }}
                  >
                    <svg width={isMobile ? 17 : 15} height={isMobile ? 17 : 15}
                      viewBox="0 0 24 24" fill="none"
                      stroke={loading || !input.trim() ? TEXT_MUT : "white"}
                      strokeWidth={2.2}>
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: 4, marginTop: 8,
              }}>
                <GeminiLogo size={10} />
                <span style={{ fontSize: 10, color: TEXT_MUT }}>
                  Powered by Gemini ·{" "}
                  {lang === "id" ? "Faiz AI — Tanya apa saja" : "Faiz AI — Ask anything"}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
