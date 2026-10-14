import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/site";

const OG_IMAGE = `${SITE_URL}/opengraph-image`;

/**
 * Per-page metadata. Next replaces (not merges) `openGraph` and `twitter`, so
 * every page states its own og:url, title and description here instead of
 * inheriting the homepage values from the root layout.
 */
export function pageMeta(input: {
    title: string;
    description: string;
    path: string;
}): Metadata {
    const { title, description, path } = input;
    return {
        title: { absolute: title },
        description,
        alternates: { canonical: path },
        openGraph: {
            title,
            description,
            siteName: SITE_NAME,
            url: `${SITE_URL}${path === "/" ? "" : path}`,
            locale: "en_US",
            type: "website",
            images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: `${SITE_NAME} — MVP and product development agency` }],
        },
        twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
    };
}
