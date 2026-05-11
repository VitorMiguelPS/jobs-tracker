import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "JobTracker — Acompanhe suas candidaturas",
  description: "Registre e acompanhe suas candidaturas de emprego em um só lugar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
