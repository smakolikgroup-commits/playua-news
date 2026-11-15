export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";
import PopularSection from "./PopularSection";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const query = q?.trim() || "";

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const posts = await db.post.findMany({
    where: {
      ...(category ? { category: { slug: category } } : {}),
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { category: true },
  });

  const isFiltered = Boolean(category || query);
  const featuredPost = !isFiltered ? posts.at(0) : null;
  const gridPosts = !isFiltered ? posts.slice(1) : posts;

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
                  !category && !query
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Усі
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                    category === cat.slug
                      ? "bg-cyan-500 text-slate-950"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
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
              <button
                type="submit"
                aria-label="Шукати"
                className="absolute right-2 text-slate-400 hover:text-cyan-400 text-xs font-bold"
              >
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

        <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/60">
          <Link
            href="/"
            className={`px-3 py-1 rounded text-xs font-semibold shrink-0 ${
              !category && !query ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
            }`}
          >
            Усі
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/?category=${cat.slug}`}
              className={`px-3 py-1 rounded text-xs font-semibold shrink-0 ${
                category === cat.slug ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 flex-grow w-full">
        {query && (
          <div className="mb-6 flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-lg">
            <p className="text-sm text-slate-300">
              Результати пошуку за запитом: <span className="font-bold text-cyan-400">«{query}»</span> ({posts.length})
            </p>
            <Link href="/" className="text-xs text-slate-400 hover:text-white underline">
              Скинути пошук
            </Link>
          </div>
        )}

        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg mb-4">
              {query
                ? `За запитом «${query}» нічого не знайдено.`
                : "У цій рубриці поки що немає публікацій."}
            </p>
            <Link href="/" className="text-cyan-400 hover:underline font-medium">
              ← Повернутися до всіх новин
            </Link>
          </div>
        ) : (
          <>
            {featuredPost && (
              <section className="mb-12">
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
            {!isFiltered && <PopularSection />}

            {gridPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 border-l-4 border-cyan-400 pl-3">
                    {query
                      ? "Знайдені публікації"
                      : category
                      ? "Матеріали рубрики"
                      : "Свіжі публікації"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gridPosts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 hover:-translate-y-1 transition duration-300 shadow-lg"
                    >
                      <Link href={`/news/${post.slug}`} className="block aspect-video overflow-hidden bg-slate-800">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-full h-full object-cover hover:scale-105 transition duration-500"
                        />
                      </Link>

                      <div className="p-5 flex flex-col flex-grow">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                            {post.category.name}
                          </span>
                          <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{new Date(post.createdAt).toLocaleDateString("uk-UA")}</span>
                            <span>•</span>
                            <span>👁 {post.views}</span>
                          </div>
                        </div>

                        <Link href={`/news/${post.slug}`} className="block mb-3">
                          <h3 className="text-lg font-bold text-white hover:text-cyan-400 transition line-clamp-2 leading-snug">
                            {post.title}
                          </h3>
                        </Link>

                                           <p className="text-slate-400 text-sm line-clamp-3 mt-auto">
                       {post.content}
                     </p>
                   </div>
                 </article>
               ))}
             </div>
           </section>
         )}
       </>
     )}
   </main>
 </div>
);
}
