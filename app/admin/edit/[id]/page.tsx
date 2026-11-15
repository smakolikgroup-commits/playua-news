export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import Link from "next/link";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const posts = await db.post.findMany({
    where: category ? { category: { slug: category } } : undefined,
    orderBy: { createdAt: "desc" },
    take: 15,
    include: { category: true },
  });

  const featuredPost = posts.at(0);
  const regularPosts = posts.slice(1);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Шапка сайту (Header) */}
      <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
              PLAY<span className="text-cyan-400">UA</span>
            </Link>

            {/* Навігація та фільтри категорій */}
            <nav className="hidden sm:flex items-center gap-2">
              <Link
                href="/"
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition ${
                  !category
                    ? "bg-cyan-500 text-slate-950"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                Усі матеріали
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

          <Link
            href="/admin"
            className="text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-2 rounded-md transition"
          >
            Адмінка
          </Link>
        </div>

        {/* Мобільне меню категорій */}
        <div className="sm:hidden flex items-center gap-2 overflow-x-auto px-4 py-2 border-t border-slate-800/60">
          <Link
            href="/"
            className={`px-3 py-1 rounded text-xs font-semibold shrink-0 ${
              !category ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300"
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

      {/* Основний контент */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
            <p className="text-slate-400 text-lg mb-4">У цій рубриці поки що немає публікацій.</p>
            <Link href="/admin" className="text-cyan-400 hover:underline font-medium">
              Додати першу новину →
            </Link>
          </div>
        ) : (
          <>
            {/* Головна новина (Hero-блок) */}
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
                    </div>
                    <h1 className="text-2xl md:text-4xl font-extrabold text-white group-hover:text-cyan-400 transition leading-tight max-w-4xl">
                      {featuredPost.title}
                    </h1>
                  </div>
                </Link>
              </section>
            )}

            {/* Сітка інших публікацій */}
            {regularPosts.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 border-l-4 border-cyan-400 pl-3">
                    {category ? "Матеріали рубрики" : "Свіжі публікації"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
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
                          <span className="text-xs text-slate-500">
                            {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                          </span>
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
