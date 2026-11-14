import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function PostsList() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  async function deletePost(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const postId = formData.get("postId") as string;
    if (postId) {
      await db.post.delete({ where: { id: postId } });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold mb-6 text-slate-200 border-b border-slate-700 pb-3">
        Усі публікації ({posts.length})
      </h2>

      {posts.length === 0 ? (
        <p className="text-slate-400">Поки що немає жодної новини.</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex-grow">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase text-cyan-400">
                    {post.category.name}
                  </span>
                  <span className="text-xs text-slate-500">
                    • {new Date(post.createdAt).toLocaleDateString("uk-UA")}
                  </span>
                </div>
                <Link
                  href={`/news/${post.slug}`}
                  className="font-bold text-lg text-white hover:text-cyan-300 transition line-clamp-1"
                >
                  {post.title}
                </Link>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded text-sm font-medium transition"
                >
                  Редагувати
                </Link>

                <form action={deletePost}>
                  <input type="hidden" name="postId" value={post.id} />
                  <button
                    type="submit"
                    className="bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/40 px-3 py-1.5 rounded text-sm font-medium transition"
                  >
                    Видалити
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
