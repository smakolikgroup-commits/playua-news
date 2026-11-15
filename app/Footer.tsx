import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#080b12] border-t border-slate-800/80 text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white inline-flex items-center gap-1 mb-2">
            PLAY<span className="text-cyan-400">UA</span>
          </Link>
          <p className="text-xs text-slate-500 max-w-sm">
            Незалежне ігрове та гік-медіа. Новини індустрії, огляди ігор, кіберспорт та кіно українською.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-cyan-400 transition">
            Головна
          </Link>
          <Link href="/?category=novyny" className="hover:text-cyan-400 transition">
            Новини
          </Link>
          <Link href="/?category=oglyady" className="hover:text-cyan-400 transition">
            Огляди
          </Link>
          <Link href="/?category=cybersport" className="hover:text-cyan-400 transition">
            Кіберспорт
          </Link>
          <Link href="/admin" className="hover:text-cyan-400 transition">
            Адмін-панель
          </Link>
        </div>
      </div>

      <div className="border-t border-slate-900 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} PLAYUA Clone. Усі права захищено.
      </div>
    </footer>
  );
}
