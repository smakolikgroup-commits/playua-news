import { db } from "@/lib/db";
import Link from "next/link";

export default async function PopularSection() {
  const popularPosts = await db.post.findMany({
    orderBy: { views: "desc" },
    take: 4,
    include: { category: true },
  });

  if (popularPosts.length < 2) return null;

  return (
    <section className="mb-12 bg-slate-900/60 border border-slate-800/90 rounded-2xl p-5 md:p-6">
      <h2 className="text-sm font-extrabold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
        <span>🔥 Найпопулярніше зараз</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {popularPosts.map((item, index) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-800/70 transition"
          >
            <span className="text-2xl font-black text-slate-700 group-hover:text-cyan-400 transition leading-none pt-0.5">
              0{index + 1}
            </span>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-200 group-hover:text-white transition line-clamp-2 leading-snug mb-1">
                {item.title}
              </h3>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                👁 {item.views} • {item.category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
