export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import PostsList from "./PostsList";


export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const isAuthorized = cookieStore.get("admin_session")?.value === "authenticated";
  const { error } = await searchParams;

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

  const defaultCategories = [
    { name: "Новини", slug: "novyny" },
    { name: "Огляди", slug: "oglyady" },
    { name: "Кіберспорт", slug: "cybersport" },
    { name: "Ігри", slug: "igry" },
    { name: "Кіно", slug: "kino" },
  ];

  for (const cat of defaultCategories) {
    await db.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  async function createPost(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const categoryId = formData.get("categoryId") as string;

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

    redirect("/");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 bg-slate-900 text-white min-h-screen">
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

      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Додати нову публікацію</h1>

      <form action={createPost} className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Назва статті</label>
          <input
            type="text"
            name="title"
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="Наприклад: Реліз GTA VI перенесли..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Категорія</label>
          <select
            name="categoryId"
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
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Текст новини</label>
          <textarea
            name="content"
            rows={8}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
            placeholder="Напишіть контент статті тут..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3 rounded transition tracking-wide"
        >
          Опублікувати новину
        </button>
      </form>
    <PostsList />

</main>
  );
}
