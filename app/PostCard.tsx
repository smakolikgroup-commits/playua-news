import Link from "next/link";

export default function PostCard({ post }: { post: any }) {
  return (
    <article className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-700 hover:-translate-y-1 transition duration-300 shadow-lg">
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
        <p className="text-slate-400 text-sm line-clamp-3 mt-auto">{post.content}</p>
      </div>
    </article>
  );
}
