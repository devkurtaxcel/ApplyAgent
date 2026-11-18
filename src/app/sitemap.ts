import type { MetadataRoute } from "next";

// Only the landing page is public; the dashboard needs sign-in.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://applyagent.kurtaxcel.com", lastModified: "2026-11-18", changeFrequency: "yearly", priority: 1 }];
}
