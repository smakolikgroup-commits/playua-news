import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function CommentsSection({
  postId,
  slug,
}: {
  postId: string;
  slug: string;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin_session")?.value === "authenticated";

  const comments = await db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "desc" },
  });

  async function addComment(formData: FormData) {
    "use server";

    const author = (formData.get("author") as string)?.trim();
    const text = (formData.get("text") as string)?.trim();

    if (!author || !text) return;

    await db.comment.create({
      data: {
        author: author.slice(0, 40),
        text: text.slice(0, 1000),
        postId,
      },
    });

    revalidatePath(`/news/${slug}`);
  }

  async function deleteComment(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const commentId = formData.get("commentId") as string;
    if (commentId) {
      await db.comment.delete({ where: { id: commentId } });
    }

    revalidatePath(`/news/${slug}`);
  }

  return (
    <section className="max-w-4xl mx-auto px-4 py-10 border-t border-slate-800/80">
      <h2 className="text-xl font-bold uppercase tracking-wider text-slate-200 border-l-4 border-cyan-400 pl-3 mb-6">
        Коментарі ({comments.length})
      </h2>

      {/* Форма додавання коментаря */}
      <form action={addComment} className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 mb-8 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Ваше ім&apos;я або нікнейм
          </label>
          <input
            type="text"
            name="author"
            required
            maxLength={40}
            placeholder="Наприклад: Ґеральт із Рівії"
            className="w-full sm:w-72 bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Текст коментаря
          </label>
          <textarea
            name="text"
            rows={3}
            required
            maxLength={1000}
            placeholder="Поділіться враженнями від новини..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3.5 text-sm text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-lg text-sm transition"
        >
          Опублікувати коментар
        </button>
      </form>

      {/* Список коментарів */}
      {comments.length === 0 ? (
        <p className="text-slate-500 text-sm">Поки що немає коментарів. Будьте першим!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4"
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-cyan-400 text-sm">{comment.author}</span>
                  <span className="text-xs text-slate-500">
                    • {new Date(comment.createdAt).toLocaleDateString("uk-UA", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                {isAdmin && (
                  <form action={deleteComment}>
                    <input type="hidden" name="commentId" value={comment.id} />
                    <button
                      type="submit"
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Видалити
                    </button>
                  </form>
                )}
              </div>

              <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                {comment.text}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
