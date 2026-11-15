export const dynamic = "force-dynamic";

import { db } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import Link from "next/link";
import { put } from "@vercel/blob";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const cookieStore = await cookies();
  if (cookieStore.get("admin_session")?.value !== "authenticated") {
    redirect("/admin");
  }

  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });

  if (!post) {
    notFound();
  }

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  async function updatePost(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const categoryId = formData.get("categoryId") as string;
    const file = formData.get("file") as File | null;
    let imageUrl = (formData.get("image") as string)?.trim();

    if (file && file.size > 0) {
      const blob = await put(`news/${Date.now()}-${file.name}`, file, {
        access: "public",
      });
      imageUrl = blob.url;
    }

    await db.post.update({
      where: { id },
      data: {
        title,
        content,
        image: imageUrl || "https://unsplash.com",
        categoryId,
      },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <main className="max-w-2xl mx-auto px-4 py-12 bg-slate-900 text-white min-h-screen">
      <Link href="/admin" className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
        ← Назад в адмінку
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Редагувати публікацію</h1>

      <form action={updatePost} className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Назва статті</label>
          <input
            type="text"
            name="title"
            defaultValue={post.title}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Категорія</label>
          <select
            name="categoryId"
            defaultValue={post.categoryId}
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
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Завантажити нову обкладинку з комп&apos;ютера (JPG, PNG, WebP)
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            className="w-full bg-slate-700 border border-slate-600 rounded p-2.5 text-sm text-slate-200 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Поточне посилання на зображення (URL)
          </label>
          <input
            type="url"
            name="image"
            defaultValue={post.image}
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Текст новини</label>
          <textarea
            name="content"
            rows={8}
            defaultValue={post.content}
            required
            className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3 rounded transition"
        >
          Зберегти зміни
        </button>
      </form>
    </main>
  );
}
