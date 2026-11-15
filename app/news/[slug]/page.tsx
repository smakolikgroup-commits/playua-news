export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  const relatedPosts = await db.post.findMany({
    where: {
      id: { not: post.id },
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: { category: true },
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100">
      {/* Спільна шапка сайту */}
      <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black tracking-tighter text-white flex items-center gap-1">
            PLAY<span className="text-cyan-400">UA</span>
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition">
              ← Усі новини
            </Link>
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 px-3 py-2 rounded-md transition"
            >
              Адмінка
            </Link>
          </div>
        </div>
      </header>

      {/* Основний контент статті */}
      <article className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/?category=${post.category.slug}`}
            className="bg-cyan-500 text-slate-950 text-xs font-extrabold uppercase px-2.5 py-1 rounded hover:bg-cyan-400 transition"
          >
            {post.category.name}
          </Link>
          <time className="text-sm text-slate-400">
            {new Date(post.createdAt).toLocaleDateString("uk-UA", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-8">
          {post.title}
        </h1>

        <div className="rounded-2xl overflow-hidden border border-slate-800 mb-10 bg-slate-900 shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full max-h-[520px] object-cover"
          />
        </div>

        <div className="space-y-6 text-slate-200 text-lg leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </article>

      {/* Блок "Читайте також" */}
      {relatedPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-800/80">
          <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 border-l-4 border-cyan-400 pl-3 mb-6">
            Читайте також
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition"
              >
                <div className="aspect-video overflow-hidden bg-slate-800">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-4">
                  <span className="text-xs font-bold uppercase text-cyan-400 block mb-1">
                    {item.category.name}
                  </span>
                  <h3 className="font-bold text-white group-hover:text-cyan-400 transition line-clamp-2">
                    {item.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}