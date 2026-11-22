import { LANGUAGES } from "@/lib/i18n";

export default function CreatePostForm({
  categories,
  createPost,
}: {
  categories: { id: string; name: string }[];
  createPost: (formData: FormData) => Promise<void>;
}) {
  return (
    <form
      action={createPost}
      className="space-y-6 bg-slate-800 p-6 md:p-8 rounded-lg border border-slate-700 mb-12"
    >
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Назва статті</label>
        <input
          type="text"
          name="title"
          required
          style={{ width: "100%" }}
          className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          placeholder="Наприклад: Реліз GTA VI перенесли..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Категорія</label>
        <select
          name="categoryId"
          required
          style={{ width: "100%" }}
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
        <label className="block text-sm font-medium text-slate-300 mb-2">Мова публікації</label>
        <select
          name="lang"
          defaultValue="uk"
          style={{ width: "100%" }}
          className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
        >
          {LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.name}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-3 bg-slate-700/60 border border-cyan-500/40 rounded-lg p-3.5 cursor-pointer hover:bg-slate-700 transition">
        <input type="checkbox" name="autoTranslate" defaultChecked className="w-5 h-5 accent-cyan-400 rounded" />
        <div>
          <span className="block text-sm font-bold text-cyan-300">
            ✨ Автоматично перекласти ШІ на всі 7 мов
          </span>
          <span className="block text-xs text-slate-400">
            Стаття з&apos;явиться в усіх 7 мовних розділах сайту.
          </span>
        </div>
      </label>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Завантажити обкладинку (JPG, PNG, WebP)
        </label>
        <input
          type="file"
          name="file"
          accept="image/*"
          style={{ width: "100%" }}
          className="w-full bg-slate-700 border border-slate-600 rounded p-2.5 text-sm text-slate-200 file:mr-4 file:py-1.5 file:px-4 file:rounded file:border-0 file:text-xs file:font-bold file:bg-cyan-500 file:text-slate-950 hover:file:bg-cyan-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Або посилання на зображення (URL)
        </label>
        <input
          type="url"
          name="image"
          style={{ width: "100%" }}
          className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-white focus:outline-none focus:border-cyan-400"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">Текст новини</label>
        <textarea
          name="content"
          rows={18}
          required
          style={{ width: "100%", display: "block" }}
          className="w-full bg-slate-700 border border-slate-600 rounded p-4 text-base leading-relaxed text-white focus:outline-none focus:border-cyan-400"
          placeholder="Напишіть контент статті тут..."
        />
      </div>

      <button
        type="submit"
        style={{ width: "100%" }}
        className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-900 font-bold p-3.5 rounded transition tracking-wide text-base"
      >
        Опублікувати новину
      </button>
    </form>
  );
}
