export const dynamic = "force-dynamic";

import Link from "next/link";
import { db } from "@/lib/db";


export default async function HomePage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { category: true },
  });

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 bg-slate-900 text-white min-h-screen">
      <header className="border-b border-slate-700 pb-6 mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-extrabold text-cyan-400 tracking-wider">PLAYUA_CLONE</h1>
        <Link href="/admin" className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 px-4 py-2 rounded font-bold transition">
          Адмінка
        </Link>
      </header>

      {posts.length === 0 ? (
        <p className="text-slate-400 text-center text-lg">Новин поки немає. Зайдіть в адмінку та додайте першу!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article key={post.id} className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700 flex flex-col">
              <div className="relative h-48 w-full bg-slate-700">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                  {post.category.name}
                </span>
                <h2 className="text-xl font-bold mb-3 line-clamp-2 hover:text-cyan-300 transition">
                  <Link href={`/news/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                  {post.content}
                </p>
                <div className="text-xs text-slate-500">
                  {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
