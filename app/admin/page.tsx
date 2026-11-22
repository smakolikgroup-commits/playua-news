export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";
import { put } from "@vercel/blob";
import PostsList from "./PostsList";
import CategoryManager from "./CategoryManager";
import CreatePostForm from "./CreatePostForm";
import { LANGUAGES, LangCode } from "@/lib/i18n";
import { translateArticleWithAI } from "@/lib/aiTranslate";

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
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 text-sm p-3 rounded mb-4">
              Невірний пароль. Спробуйте ще раз.
            </div>
          )}
          <form action={loginAction} className="space-y-4">
            <input
              type="password"
              name="password"
              required
              className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white"
              placeholder="Пароль"
            />
            <button type="submit" className="w-full bg-cyan-500 text-slate-900 font-bold p-3 rounded">
              Увійти
            </button>
          </form>
        </div>
      </main>
    );
  }

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  async function createPost(formData: FormData) {
    "use server";
    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") throw new Error("Немає доступу");

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryId = formData.get("categoryId") as string;
    const lang = ((formData.get("lang") as string) || "uk") as LangCode;
    const autoTranslate = formData.get("autoTranslate") === "on";
    const file = formData.get("file") as File | null;
    let imageUrl = (formData.get("image") as string)?.trim();

    if (file && file.size > 0) {
      const blob = await put(`news/${Date.now()}-${file.name}`, file, { access: "public" });
      imageUrl = blob.url;
    }

    const finalImage = imageUrl || "https://unsplash.com";
    const makeSlug = (text: string, suffix: string) =>
      text.toLowerCase().replace(/[^a-z0-9а-яіїєґ\s]/g, "").trim().replace(/\s+/g, "-").slice(0, 60) + "-" + suffix;

    if (autoTranslate) {
      const translations = await translateArticleWithAI(title, content, lang);
      const batchId = Date.now().toString().slice(-4);
      for (const item of LANGUAGES) {
        const translated = translations[item.code];
        if (translated?.title && translated?.content) {
          await db.post.create({
            data: {
              title: translated.title,
              slug: makeSlug(translated.title || title, `${item.code}-${batchId}`),
              content: translated.content,
              lang: item.code,
              image: finalImage,
              categoryId,
            },
          });
        }
      }
    } else {
      await db.post.create({
        data: { title, slug: makeSlug(title, Date.now().toString().slice(-4)), content, lang, image: finalImage, categoryId },
      });
    }

    redirect("/");
  }

  return (
    <main style={{ width: "45%", minWidth: "480px", margin: "0 auto" }} className="py-12 px-6 text-white min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <Link href="/" className="text-cyan-400 hover:underline text-sm">← На головну</Link>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-slate-400 hover:text-red-400 transition">Вийти з адмінки</button>
        </form>
      </div>
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Додати нову публікацію</h1>
      <CreatePostForm categories={categories} createPost={createPost} />
      <CategoryManager />
      <PostsList />
    </main>
  );
}
