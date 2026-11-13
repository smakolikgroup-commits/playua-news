import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;

  const post = await db.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12 bg-slate-900 text-white min-h-screen">
      <Link href="/" className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
        ← На головну
      </Link>

      <header className="mb-6">
        <span className="text-sm font-bold uppercase tracking-wider text-cyan-400">
          {post.category.name}
        </span>
        <h1 className="text-3xl md:text-5xl font-black mt-2 leading-tight">
          {post.title}
        </h1>
        <div className="text-sm text-slate-400 mt-4">
          Опубліковано: {new Date(post.createdAt).toLocaleDateString("uk-UA")}
        </div>
      </header>

      <div className="my-8 rounded-lg overflow-hidden max-h-[400px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
      </div>

      <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
        {post.content}
      </div>
    </article>
  );
}
