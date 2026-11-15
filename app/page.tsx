export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import PopularSection from "./PopularSection";
import Pagination from "./Pagination";
import PostCard from "./PostCard";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>;
}) {
  const { category, q, page } = await searchParams;
  const query = q?.trim() || "";
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 10;

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  const whereClause = {
    ...(category ? { category: { slug: category } } : {}),
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
    include: { category: true },
  });

  const isFirstPageUnfiltered = !category && !query && currentPage === 1;
  const featuredPost = isFirstPageUnfiltered ? posts.at(0) : null;
  const gridPosts = isFirstPageUnfiltered ? posts.slice(1) : posts;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <header className="sticky top-0 z-50 bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-1 shrink-0">
              PLAY<span className="text-cyan-400">UA</span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1.5">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                  !category && !query ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Усі
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                    category === cat.slug ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <form action="/" method="GET" className="relative flex items-center">
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Пошук новин..."
                className="bg-slate-800/90 border border-slate-700 focus:border-cyan-400 rounded-md pl-3 pr-8 py-1.5 text-sm text-white placeholder:text-slate-400 focus:outline-none w-36 sm:w-52 transition"
              />
              <button type="submit" aria-label="Шукати" className="absolute right-2 text-slate-400 hover:text-cyan-400 text-xs font-bold">
                🔍
              </button>
            </form>
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-2 rounded-md transition shrink-0"
            >
              Адмінка
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {query && (
          <div className="mb-6 flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg">
            <p className="text-sm text-slate-300">
              Результати пошуку за запитом: <span className="font-bold text-cyan-400">«{query}»</span> ({totalPosts})
            </p>
            <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
              Скинути пошук
            </Link>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg mb-4">
              {query ? `За запитом «${query}» нічого не знайдено.` : "У цій рубриці поки що немає публікацій."}
            </p>
            <Link href="/" className="text-cyan-400 hover:underline font-medium">
              ← Повернутися до всіх новин
            </Link>
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="mb-10">
                <Link
                  href={`/news/${featuredPost.slug}`}
                  className="group relative block rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition duration-300 shadow-2xl"
                >
                  <div className="aspect-[16/9] md:aspect-[21/9] w-full overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-75 group-hover:opacity-90"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-[#0b0f19]/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase px-2.5 py-1 rounded">
                        {featuredPost.category.name}
                      </span>
                      <span className="text-xs text-slate-300 font-medium">
                        {new Date(featuredPost.createdAt).toLocaleDateString("uk-UA")}
                      </span>
                      <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
                        👁 {featuredPost.views}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white group-hover:text-cyan-400 transition leading-tight max-w-4xl">
                      {featuredPost.title}
                    </h1>
                  </div>
                </Link>
              </section>
            )}

            {isFirstPageUnfiltered && <PopularSection />}

            {gridPosts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 border-l-4 border-cyan-400 pl-3 mb-6">
                  {query
                    ? "Знайдені публікації"
                    : category
                    ? "Матеріали рубрики"
                    : currentPage > 1
                    ? `Архів новин — сторінка ${currentPage}`
                    : "Свіжі публікації"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <PostCard key={post.id} post={post} />
                  ))}
                </div>
              </section>
            )}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              category={category}
              query={query}
            />
          </>
        )}
      </main>
    </div>
  );
}
