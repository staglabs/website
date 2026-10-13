import type { MetadataRoute } from "next";
import { ROUTES, SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
    return ROUTES.map((path) => ({
        url: `${SITE_URL}${path === "/" ? "" : path}`,
        changeFrequency: path === "/" ? "monthly" : "yearly",
        priority: path === "/" ? 1 : path === "/about" ? 0.7 : 0.5,
    }));
}
