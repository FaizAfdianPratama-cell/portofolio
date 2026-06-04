"use client";
import { useApp } from "../context/AppContext";
import Cursor from "@/components/Cursor";
import Particles from "@/components/Particles";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";

export default function Home() {
  const { theme } = useApp();
  const isLight = theme === "light";

  return (
    <main
      style={{ position: "relative", minHeight: "100vh" }}
      className={`transition-colors duration-500 ${isLight ? "bg-[#eef2ff]" : "bg-[#060b18]"}`}
    >
      <Particles />
      <Cursor />

      <div style={{ position: "relative", zIndex: 1 }}>
        <Navbar />
        <Hero />
        <Skills />
        <Education />
        <Projects />
        <Contact />
        <Footer />
      </div>

      <ChatWidget />
    </main>
  );
}