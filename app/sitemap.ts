import { MetadataRoute } from "next";
import { db } from "@/lib/db";
import { LANGUAGES } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://playua-clone-ua.vercel.app";

  const posts = await db.post.findMany({
    select: { slug: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  const categories = await db.category.findMany({
    select: { slug: true },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1.0,
    },
    ...LANGUAGES.map((l) => ({
      url: `${baseUrl}/?lang=${l.code}`,
      lastModified: new Date(),
      changeFrequency: "hourly" as const,
      priority: 0.9,
    })),
    ...categories.map((cat) => ({
      url: `${baseUrl}/?category=${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/news/${post.slug}`,
    lastModified: post.createdAt,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  return [...staticRoutes, ...postRoutes];
}
