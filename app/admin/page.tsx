export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; edit?: string }>;
}) {
  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get("admin_session")?.value === "authenticated";
  const { error, edit } = await searchParams;

  async function loginAction(formData: FormData) {
    "use server";
    const password = formData.get("password") as string;

    if (password === process.env.ADMIN_PASSWORD) {
      const store = await cookies();
      store.set("admin_session", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
      redirect("/admin");
    } else {
      redirect("/admin?error=1");
    }
  }

  async function logoutAction() {
    "use server";
    const store = await cookies();
    store.delete("admin_session");
    redirect("/");
  }

  if (!isAuthorized) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 bg-slate-900 text-white min-h-screen flex flex-col justify-center">
        <Link href="/" className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
          ← На головну
        </Link>

        <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 shadow-xl">
          <h1 className="text-2xl font-bold mb-2 text-cyan-400">Вхід в адмін-панель</h1>
          <p className="text-slate-400 text-sm mb-6">Введіть пароль адміністратора для доступу.</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-3 rounded mb-4">
              Невірний пароль. Спробуйте ще раз.
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Пароль</label>
              <input
                type="password"
                name="password"
                required
                className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3 rounded transition"
            >
              Увійти
            </button>
          </form>
        </div>
      </main>
    );
  }

  let categories = await db.category.findMany();

  if (categories.length === 0) {
    await db.category.createMany({
      data: [
        { name: "Новини", slug: "novyny" },
        { name: "Огляди", slug: "oglyady" },
        { name: "Кіберспорт", slug: "cybersport" },
      ],
    });
    categories = await db.category.findMany();
  }

  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const editingPost = edit ? posts.find((p) => p.id === edit) : null;

  async function savePost(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const postId = formData.get("postId") as string | null;
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const categoryId = formData.get("categoryId") as string;

    if (postId) {
      await db.post.update({
        where: { id: postId },
        data: {
          title,
          content,
          image: image || "https://unsplash.com",
          categoryId,
        },
      });
    } else {
      const slug =
        title
          .toLowerCase()
          .replace(/[^a-z0-9а-яіїєґ\s]/g, "")
          .trim()
          .replace(/\s+/g, "-") +
        "-" +
        Date.now().toString().slice(-4);

      await db.post.create({
        data: {
          title,
          slug,
          content,
          image: image || "https://unsplash.com",
          categoryId,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

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
    <main className="max-w-3xl mx-auto px-4 py-12 bg-slate-900 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-cyan-400 hover:underline text-sm">
          ← На головну
        </Link>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-400 hover:text-red-400 transition">
            Вийти з адмінки
          </button>
        </form>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-cyan-400">
          {editingPost ? "Редагувати статтю" : "Додати нову публікацію"}
        </h1>
        {editingPost && (
          <Link
            href="/admin"
            className="text-sm bg-slate-700 hover:bg-slate-600 text-slate-200 px-3 py-1.5 rounded transition"
          >
            Скасувати редагування
          </Link>
        )}
      </div>

      <form
        key={editingPost?.id || "new"}
        action={savePost}
        className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700 mb-12"
      >
        {editingPost && <input type="hidden" name="postId" value={editingPost.id} />}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Назва статті</label>
          <input
            type="text"
            name="title"
            defaultValue={editingPost?.title || ""}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="Наприклад: Реліз GTA VI перенесли..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Категорія</label>
          <select
            name="categoryId"
            defaultValue={editingPost?.categoryId || categories[0]?.id}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Посилання на головне зображення (URL)</label>
          <input
            type="url"
            name="image"
            defaultValue={editingPost?.image || ""}
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Текст новини</label>
          <textarea
            name="content"
            rows={8}
            defaultValue={editingPost?.content || ""}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="Напишіть контент статті тут..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3 rounded transition tracking-wide"
        >
          {editingPost ? "Зберегти зміни" : "Опублікувати новину"}
        </button>
      </form>

      <section>
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
                    <span className="text-xs font-bold uppercase text-cyan-400">{post.category.name}</span>
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
                    href={`/admin?edit=${post.id}`}
className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 px-3 py-1.5 rounded text-sm font-medium transition"
>
Редагувати
Видалити




))}

)}

);
}