import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "../context/AppContext";

export const metadata: Metadata = {
  title: "Portfolio — Data Enthusiast",
  description: "Data Enthusiast | Fresh Graduate RPL SMK Telesandi Bekasi",
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#060b18" },
    { media: "(prefers-color-scheme: light)", color: "#eef2ff" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="dark">
      <body>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}