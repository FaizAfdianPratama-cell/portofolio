"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { personalData } from "@/data/portfolio";
import { useApp } from "../context/AppContext";
import { t } from "@/data/translations";

const EMAILJS_SERVICE_ID  = "service_t6wyp75";
const EMAILJS_TEMPLATE_ID = "template_d11jsvc";
const EMAILJS_PUBLIC_KEY  = "qMIH4BCBKMNolvz-3";

const WHATSAPP_URL  = "https://wa.me/6281293100423";
const INSTAGRAM_URL = "https://www.instagram.com/faiz.afdian/";

export default function Contact() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";

  const [form, setForm]     = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setStatus("sending");
    try {
      const emailjs = await import("@emailjs/browser");
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        { from_name: form.name, from_email: form.email, message: form.message, to_email: personalData.email },
        EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass = `w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm outline-none transition-all duration-200 border ${
    isLight
      ? "bg-white border-indigo-200 text-indigo-950 placeholder-indigo-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 shadow-sm"
      : "bg-white/10 border-white/15 text-slate-100 placeholder-slate-500 focus:border-[#00f5d4]/50 focus:bg-white/15"
  }`;

  return (
    <section
      id="contact"
      className="relative py-16 sm:py-20 lg:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-500 grid-bg mesh-gradient"
    >
      {/* Glow blobs — same as Hero */}
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

      <div
        className="pointer-events-none absolute right-4 sm:right-8 top-8 sm:top-12 select-none font-extrabold leading-none"
        style={{
          fontSize: "clamp(5rem,14vw,9rem)",
          color: isLight ? "rgba(99,102,241,0.055)" : "rgba(255,255,255,0.03)",
          letterSpacing: "-0.04em",
        }}
      >
        05
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-10 sm:mb-12 lg:mb-14 text-center"
        >
          <p className={`font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-2 sm:mb-3 ${isLight ? "text-indigo-500" : "text-[#00f5d4]"}`}>
            {t.contact.label[lang]}
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
            {t.contact.titlePre[lang]}{" "}{t.contact.title[lang]}
          </h2>
          <p className={`text-xs sm:text-sm max-w-xs sm:max-w-md mx-auto ${isLight ? "text-indigo-600/70" : "text-slate-400"}`}>
            {t.contact.sub[lang]}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-start">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col gap-3 sm:gap-4"
          >
            {/* Email card */}
            <div className={`rounded-2xl p-4 sm:p-5 border ${
              isLight
                ? "bg-white border-indigo-100 shadow-sm"
                : "bg-white/3 border-white/8"
            }`}>
              <p className={`text-[10px] sm:text-xs font-mono uppercase tracking-widest mb-1 sm:mb-1.5 ${isLight ? "text-indigo-400" : "text-slate-500"}`}>
                Email
              </p>
              <p className={`text-xs sm:text-sm font-medium break-all ${isLight ? "text-indigo-900" : "text-slate-300"}`}>
                {personalData.email}
              </p>
            </div>

            <motion.a
              href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                isLight
                  ? "bg-white border-indigo-100 hover:border-green-300 hover:shadow-md hover:shadow-green-100 shadow-sm"
                  : "bg-white/3 border-white/8 hover:bg-white/5 hover:border-[#25d366]/30"
              }`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#25d366]/10">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#25d366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold ${isLight ? "text-indigo-900" : "text-slate-200"}`}>WhatsApp</p>
                <p className={`text-[10px] sm:text-xs ${isLight ? "text-indigo-400" : "text-slate-500"}`}>
                  {t.contact.waChat[lang]}
                </p>
              </div>
              <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isLight ? "text-indigo-300" : "text-slate-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>

            <motion.a
              href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 ${
                isLight
                  ? "bg-white border-indigo-100 hover:border-pink-300 hover:shadow-md hover:shadow-pink-100 shadow-sm"
                  : "bg-white/3 border-white/8 hover:bg-white/5 hover:border-[#e1306c]/30"
              }`}
            >
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#e1306c]/10">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-[#e1306c]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold ${isLight ? "text-indigo-900" : "text-slate-200"}`}>Instagram</p>
                <p className={`text-[10px] sm:text-xs ${isLight ? "text-indigo-400" : "text-slate-500"}`}>
                  {t.contact.igProfile[lang]}
                </p>
              </div>
              <svg className={`w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0 ${isLight ? "text-indigo-300" : "text-slate-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className={`rounded-2xl border p-5 sm:p-6 lg:p-8 ${
              isLight
                ? "bg-white border-indigo-100 shadow-md shadow-indigo-100/50"
                : "bg-white/3 border-white/8"
            }`}
          >
            <h3 className={`text-sm sm:text-base font-semibold mb-4 sm:mb-6 ${isLight ? "text-indigo-950" : "text-white"}`}>
              {t.contact.formTitle[lang]}
            </h3>

            <div className="flex flex-col gap-2.5 sm:gap-3">
              <input
                type="text" name="name" value={form.name} onChange={handleChange}
                placeholder={t.contact.formName[lang]}
                className={inputClass}
              />
              <input
                type="email" name="email" value={form.email} onChange={handleChange}
                placeholder={t.contact.formEmail[lang]}
                className={inputClass}
              />
              <textarea
                name="message" value={form.message} onChange={handleChange}
                placeholder={t.contact.formMessage[lang]}
                rows={4}
                className={`${inputClass} resize-none`}
              />

              <button
                onClick={handleSubmit}
                disabled={status === "sending"}
                className={`w-full py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 mt-1 ${
                  status === "sending"
                    ? isLight
                      ? "bg-indigo-200 text-indigo-400 cursor-not-allowed"
                      : "bg-[#00f5d4]/40 text-[#060b18]/50 cursor-not-allowed"
                    : isLight
                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200"
                    : "bg-[#00f5d4] text-[#060b18] hover:bg-[#00f5d4]/90 hover:shadow-[0_0_20px_rgba(0,245,212,0.25)]"
                }`}
              >
                {status === "sending" ? t.contact.formSending[lang] : t.contact.formSend[lang]}
              </button>

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className={`flex items-center gap-2 text-xs sm:text-sm rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 ${
                    isLight
                      ? "text-indigo-700 bg-indigo-50 border border-indigo-200"
                      : "text-[#00f5d4] bg-[#00f5d4]/8 border border-[#00f5d4]/20"
                  }`}
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {t.contact.formSuccess[lang]}
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="text-xs sm:text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3"
                >
                  {t.contact.formError[lang]}
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
