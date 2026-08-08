import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/natal",
    },
    sitemap: "https://www.i-am-significant.com/sitemap.xml",
  };
}
