import { NextResponse, type NextRequest } from "next/server";
import { redirectTarget } from "@/lib/redirects";
import { SITE_URL } from "@/lib/site";

/**
 * Permanent (308) redirects:
 *  1. Old staglabs.in paths to their closest page here.
 *  2. Any host that is not the canonical one to https://staglabs.in, same path
 *     and query. Only when ENFORCE_CANONICAL_HOST=1, so nothing redirects before
 *     DNS is ready. localhost, 127.0.0.1 and *.vercel.app are never redirected.
 */
export function middleware(request: NextRequest) {
    const target = redirectTarget({
        hostHeader: request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
        pathname: request.nextUrl.pathname,
        search: request.nextUrl.search,
        canonicalOrigin: SITE_URL,
        enforce: process.env.ENFORCE_CANONICAL_HOST === "1",
    });
    if (!target) return NextResponse.next();

    const url = target.startsWith("http") ? target : new URL(target, request.url).toString();
    return NextResponse.redirect(url, 308);
}

export const config = {
    // Skip only Next internals. robots.txt, sitemap.xml and public files on a
    // non-canonical host are redirected too, so crawlers never see a second copy.
    matcher: ["/((?!_next/).*)"],
};
