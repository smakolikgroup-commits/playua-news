import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export default async function CategoryManager() {
  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });

  async function addCategory(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const name = (formData.get("name") as string)?.trim();
    if (!name) return;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9а-яіїєґ\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    await db.category.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });

    revalidatePath("/admin");
    revalidatePath("/");
  }

  async function deleteCategory(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const id = formData.get("id") as string;
    if (!id) return;

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin");
    revalidatePath("/");
  }

  return (
    <section className="bg-slate-800 p-6 rounded-lg border border-slate-700 mb-12">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">Керування категоріями</h2>

      <form action={addCategory} className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          name="name"
          required
          placeholder="Назва нової рубрики (наприклад: Технології)"
          className="flex-grow bg-slate-700 border border-slate-600 rounded p-2.5 text-white text-sm focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold px-5 py-2.5 rounded text-sm transition shrink-0"
        >
          + Додати рубрику
        </button>
      </form>

      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="flex items-center gap-2 bg-slate-700/80 border border-slate-600 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200"
          >
            <span>
              {cat.name} ({cat._count.posts})
            </span>

            {cat._count.posts === 0 && (
              <form action={deleteCategory}>
                <input type="hidden" name="id" value={cat.id} />
                <button
                  type="submit"
                  title="Видалити порожню категорію"
                  className="text-red-400 hover:text-red-300 font-bold ml-1 px-1.5 py-0.5 rounded hover:bg-red-500/20 transition"
                >
                  ✕
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
