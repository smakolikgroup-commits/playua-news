import { db } from "@/lib/db";
import Link from "next/link";
import { getDict, translateCategory } from "@/lib/i18n";

export default async function Sidebar({ lang: rawLang }: { lang?: string }) {
  const { lang, t } = getDict(rawLang);

  const popularPosts = await db.post.findMany({
    where: rawLang ? { lang } : {},
    orderBy: { views: "desc" },
    take: 5,
    include: { category: true },
  });

  return (
    <aside className="space-y-8">
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
          {t.socials}
        </h3>
        <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
          <a href="#telegram" className="py-2.5 rounded-lg bg-[#229ED9]/10 text-[#229ED9] hover:bg-[#229ED9] hover:text-white transition">
            Telegram
          </a>
          <a href="#youtube" className="py-2.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition">
            YouTube
          </a>
          <a href="#discord" className="py-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 hover:bg-indigo-600 hover:text-white transition">
            Discord
          </a>
        </div>
      </div>

      {popularPosts.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/80">
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-slate-100">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
            <h3 className="text-base font-black uppercase tracking-tight text-slate-900">
              {t.popular}
            </h3>
          </div>

          <div className="space-y-4">
            {popularPosts.map((post, idx) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="group flex items-start gap-3.5"
              >
                <span className="text-xl font-black text-amber-400 leading-none pt-0.5 shrink-0">
                  {idx + 1}
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-800 group-hover:text-amber-600 transition line-clamp-2 leading-snug mb-1">
                    {post.title}
                  </h4>
                  <div className="text-[11px] font-medium text-slate-400 flex items-center gap-2">
                    <span className="text-slate-500 font-semibold">
                      {translateCategory(post.category.slug, post.category.name, lang)}
                    </span>
                    <span>•</span>
                    <span>👁 {post.views}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10">
          <span className="inline-block bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded mb-2">
            {t.communityBadge}
          </span>
          <h3 className="text-lg font-extrabold leading-snug mb-2">
            {t.communityTitle}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            {t.communityDesc}
          </p>
          <Link
            href="/admin"
            className="inline-block w-full text-center bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs uppercase tracking-wider py-2.5 rounded-lg transition"
          >
            {t.addPost}
          </Link>
        </div>
      </div>
    </aside>
  );
}
