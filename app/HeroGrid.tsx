import Link from "next/link";
import { LangCode, translateCategory } from "@/lib/i18n";

export default function HeroGrid({
  heroMain,
  heroSide,
  lang,
}: {
  heroMain: any;
  heroSide: any[];
  lang: LangCode;
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-10">
      <Link
        href={`/news/${heroMain.slug}`}
        className="lg:col-span-8 group relative rounded-2xl overflow-hidden bg-slate-900 aspect-[16/10] shadow-md block"
      >
        <img
          src={heroMain.image}
          alt={heroMain.title}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <span className="inline-block bg-amber-400 text-slate-950 text-xs font-black uppercase px-2.5 py-1 rounded mb-3">
            {translateCategory(heroMain.category.slug, heroMain.category.name, lang)}
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-300 transition leading-tight">
            {heroMain.title}
          </h1>
        </div>
      </Link>

      <div className="lg:col-span-4 flex flex-col gap-5">
        {heroSide.map((item) => (
          <Link
            key={item.id}
            href={`/news/${item.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 flex-1 min-h-[180px] shadow-md block"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <span className="inline-block bg-amber-400 text-slate-950 text-[11px] font-black uppercase px-2 py-0.5 rounded mb-2">
                {translateCategory(item.category.slug, item.category.name, lang)}
              </span>
              <h2 className="text-base font-extrabold text-white group-hover:text-amber-300 transition line-clamp-2 leading-snug">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
