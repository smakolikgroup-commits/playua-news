"use client";

import { useState } from "react";

export default function ShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  const getUrl = () => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/news/${slug}`;
    }
    return `https://vercel.app{slug}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getUrl());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Ігноруємо помилку буфера обміну
    }
  };

  const shareUrl = encodeURIComponent(getUrl());
  const shareTitle = encodeURIComponent(title);

  return (
    <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
      <span className="text-sm font-bold uppercase tracking-wider text-slate-400">
        Поділитися новиною:
      </span>

      <div className="flex flex-wrap items-center gap-2.5">
        <a
          href={`https://t.me{shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[#229ED9]/15 hover:bg-[#229ED9]/25 text-[#229ED9] border border-[#229ED9]/30 text-xs font-bold transition"
        >
          Telegram
        </a>

        <a
          href={`https://twitter.com{shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition"
        >
          X (Twitter)
        </a>

        <a
          href={`https://facebook.com{shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/25 text-[#4a9eff] border border-[#1877F2]/30 text-xs font-bold transition"
        >
          Facebook
        </a>

        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 text-xs font-bold transition"
        >
          {copied ? "✓ Скопійовано!" : "🔗 Копіювати лінк"}
        </button>
      </div>
    </div>
  );
}
