import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "./Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PLAYUA — Ігрове та гік-медіа",
    template: "%s | PLAYUA",
  },
  description: "Головні новини ігрової індустрії, огляди, кіберспорт та кіно українською.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-[#f4f5f7] text-slate-900`}
>
  <div className="flex-grow w-full">{children}</div>
  <Footer />
</body>
    </html>
  );
}
