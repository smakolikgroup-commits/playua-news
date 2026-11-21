import Link from "next/link";

export default function FeedCard({ post }: { post: any }) {
  return (
    <article className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col sm:flex-row">
      <Link
        href={`/news/${post.slug}`}
        className="sm:w-64 md:w-72 aspect-video sm:aspect-auto shrink-0 overflow-hidden bg-slate-100 block"
      >
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
        />
      </Link>

      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center gap-2 text-xs mb-2">
            <span className="font-extrabold uppercase tracking-wider text-amber-600">
              {post.category.name}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-400">
              {new Date(post.createdAt).toLocaleDateString("uk-UA", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <Link href={`/news/${post.slug}`}>
            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-amber-600 transition leading-snug mb-2 line-clamp-2">
              {post.title}
            </h3>
          </Link>

          <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed">
            {post.content}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-slate-400">
          <span>👁 {post.views}</span>
          <span>💬 {post._count.comments}</span>
        </div>
      </div>
    </article>
  );
}
