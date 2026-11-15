import Link from "next/link";

export default function Pagination({
  currentPage,
  totalPages,
  category,
  query,
}: {
  currentPage: number;
  totalPages: number;
  category?: string;
  query?: string;
}) {
  if (totalPages <= 1) return null;

  function createPageUrl(pageNumber: number) {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (query) params.set("q", query);
    if (pageNumber > 1) params.set("page", pageNumber.toString());

    const queryString = params.toString();
    return queryString ? `/?${queryString}` : "/";
  }

  return (
    <nav aria-label="Навігація по сторінках" className="mt-12 flex items-center justify-center gap-3">
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
        >
          ← Попередня
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg bg-slate-900/50 text-slate-600 border border-slate-800/60 text-sm font-semibold cursor-not-allowed">
          ← Попередня
        </span>
      )}

      <span className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-sm font-bold text-cyan-400">
        Сторінка {currentPage} з {totalPages}
      </span>

      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-sm font-semibold transition"
        >
          Наступна →
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-lg bg-slate-900/50 text-slate-600 border border-slate-800/60 text-sm font-semibold cursor-not-allowed">
          Наступна →
        </span>
      )}
    </nav>
  );
}
