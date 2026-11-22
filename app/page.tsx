export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import Sidebar from "./Sidebar";
import Pagination from "./Pagination";
import FeedCard from "./FeedCard";
import HeroGrid from "./HeroGrid";
import { LANGUAGES, getDict, translateCategory } from "@/lib/i18n";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string; lang?: string }>;
}) {
  const { category, q, page, lang: rawLang } = await searchParams;
  const { lang, t } = getDict(rawLang);
  const query = q?.trim() || "";
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 10;

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  const whereClause = {
    ...(category ? { category: { slug: category } } : {}),
    ...(rawLang ? { lang } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as const } },
            { content: { contains: query, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const totalPosts = await db.post.count({ where: whereClause });
  const totalPages = Math.ceil(totalPosts / pageSize);

  const posts = await db.post.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip: (currentPage - 1) * pageSize,
    take: pageSize,
    include: { category: true, _count: { select: { comments: true } } },
  });

  const isHeroView = !category && !query && currentPage === 1 && posts.length >= 3;
  const heroMain = isHeroView ? posts.at(0) : null;
  const heroSide = isHeroView ? posts.slice(1, 3) : [];
  const feedPosts = isHeroView ? posts.slice(3) : posts;
  const langQuery = rawLang ? `lang=${lang}` : "";

  return (
    <div className="min-h-screen bg-[#f4f5f7] text-slate-900 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-5">
            <Link href={rawLang ? `/?${langQuery}` : "/"} className="flex items-center gap-1.5 shrink-0">
              <span className="bg-slate-950 text-white font-black text-xl px-2.5 py-1 rounded-md tracking-tighter">
                PLAY<span className="text-amber-400">UA</span>
              </span>
            </Link>

            <nav className="hidden xl:flex items-center gap-1">
              <Link
                href={rawLang ? `/?${langQuery}` : "/"}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                  !category && !query ? "bg-amber-400 text-slate-950" : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {t.all}
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}${rawLang ? `&${langQuery}` : ""}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                    category === cat.slug ? "bg-amber-400 text-slate-950" : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {translateCategory(cat.slug, cat.name, lang)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-100 rounded-lg p-1 text-xs font-extrabold border border-slate-200 gap-0.5 overflow-x-auto">
              {LANGUAGES.map((item) => (
                <Link
                  key={item.code}
                  href={`/?lang=${item.code}${category ? `&category=${category}` : ""}`}
                  className={`px-2 py-1 rounded transition ${
                    (rawLang || "uk") === item.code
                      ? "bg-amber-400 text-slate-950 shadow-2xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <form action="/" method="GET" className="relative hidden sm:flex items-center">
              {rawLang && <input type="hidden" name="lang" value={lang} />}
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder={t.searchPlaceholder}
                className="bg-slate-100 border border-slate-200 focus:border-amber-400 focus:bg-white rounded-full pl-3.5 pr-8 py-1.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none w-32 md:w-40 transition"
              />
              <button type="submit" aria-label="Search" className="absolute right-2.5 text-slate-500 text-xs">
                🔍
              </button>
            </form>

            <Link
              href="/admin"
              className="text-xs font-extrabold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-amber-400 px-3 py-2 rounded-lg transition shrink-0"
            >
              {t.admin}
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {isHeroView && heroMain && (
          <HeroGrid heroMain={heroMain} heroSide={heroSide} lang={lang} />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 flex items-center gap-2.5 mb-6">
              <span className="w-1.5 h-6 bg-amber-400 rounded-full inline-block" />
              {query ? `«${query}» (${totalPosts})` : category ? t.categoryMaterials : t.freshNews}
            </h2>

            {feedPosts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                <p className="text-slate-500 mb-4">{t.notFound}</p>
                <Link href={rawLang ? `/?${langQuery}` : "/"} className="text-amber-600 font-bold hover:underline">
                  {t.backHome}
                </Link>
              </div>
            ) : (
              <div className="space-y-5">
                {feedPosts.map((post) => (
                  <FeedCard key={post.id} post={post} lang={lang} />
                ))}
              </div>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              category={category}
              query={query}
            />
          </div>

          <div className="lg:col-span-4">
            <Sidebar lang={rawLang} />
          </div>
        </div>
      </main>
    </div>
  );
}
