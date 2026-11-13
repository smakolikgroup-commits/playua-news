import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminPage() {
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

  async function createPost(formData: FormData) {
    "use server";

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
      <Link href="/" className="text-cyan-400 hover:underline text-sm mb-6 inline-block">
        ← На головну
      </Link>

      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Додати нову публікацію</h1>

      <form action={createPost} className="space-y-6 bg-slate-800 p-6 rounded-lg border border-slate-700">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Назва статті</label>
          <input type="text" name="title" required className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="Наприклад: Реліз GTA VI перенесли..." />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Категорія</label>
          <select name="categoryId" required className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          
export const dynamic = "force-dynamic";
<label className="block text-sm font-medium text-slate-300 mb-2">Посилання на головне зображення (URL)</label>
          <input type="url" name="image" className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="https://example.com" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Текст новини</label>
          <textarea name="content" rows={8} required className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400" placeholder="Напишіть контент статті тут..."></textarea>
        </div>

        <button type="submit" className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3 rounded transition tracking-wide">
          Опублікувати новину
        </button>
      </form>
    </main>
  );
}
