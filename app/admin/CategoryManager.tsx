import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default function CategoryManager() {
  async function createCategory(formData: FormData) {
    "use server";

    const store = await cookies();
    if (store.get("admin_session")?.value !== "authenticated") {
      throw new Error("Немає доступу");
    }

    const name = (formData.get("name") as string)?.trim();
    if (!name) return;

    const slug =
      name
        .toLowerCase()
        .replace(/[^a-z0-9а-яіїєґ\s]/g, "")
        .trim()
        .replace(/\s+/g, "-") +
      "-" +
      Date.now().toString().slice(-3);

    await db.category.create({
      data: { name, slug },
    });

    revalidatePath("/");
    revalidatePath("/admin");
    redirect("/admin");
  }

  return (
    <section className="mb-12 bg-slate-800/70 p-6 rounded-lg border border-slate-700">
      <h2 className="text-lg font-bold text-slate-200 mb-4">Додати нову рубрику (категорію)</h2>
      <form action={createCategory} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          name="name"
          required
          placeholder="Наприклад: Залізо, Комікси або Блоги"
          className="flex-grow bg-slate-700 border border-slate-600 rounded p-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
        />
        <button
          type="submit"
          className="bg-slate-700 hover:bg-cyan-500 hover:text-slate-950 text-cyan-400 border border-cyan-500/40 font-bold px-5 py-2.5 rounded text-sm transition shrink-0"
        >
          + Створити рубрику
        </button>
      </form>
    </section>
  );
}
