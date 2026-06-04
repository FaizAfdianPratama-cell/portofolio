"use client";
import { motion } from "framer-motion";
import { certifications } from "@/data/portfolio";
import { useApp } from "../context/AppContext";

export default function Certifications() {
  const { theme, lang } = useApp();
  const isLight = theme === "light";
  if (certifications.length === 0) return null;

  return (
    <section className="relative py-16 px-4 sm:px-6 lg:px-8 ...">
      {/* header, grid, sama seperti di Education */}
    </section>
  );
}