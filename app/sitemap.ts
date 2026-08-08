import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.i-am-significant.com",
      lastModified: new Date(),
    },
  ];
}
