/**
 * Redirect rules shared by `middleware.ts` (and unit-checkable on their own).
 */

/** Paths the previous staglabs.in site served, mapped to their closest page here. */
export const LEGACY_PATHS: Record<string, string> = {
    "/work": "/#work",
    "/careers": "/about",
    "/updates": "/",
};

/** Hosts that are never redirected: local dev and preview deployments. */
export function isExemptHost(hostname: string): boolean {
    return (
        hostname === "localhost" ||
        hostname === "127.0.0.1" ||
        hostname === "[::1]" ||
        hostname.endsWith(".localhost") ||
        hostname.endsWith(".vercel.app")
    );
}

export function hostnameOf(hostHeader: string | null): string {
    return (hostHeader ?? "").split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
}

/**
 * Where should this request go? Returns an absolute-or-relative target, or null.
 *
 * - `enforce` false: only the legacy path map applies, as a relative redirect.
 * - `enforce` true: any non-canonical, non-exempt host goes to the canonical
 *   origin with the same path and query. The legacy map is folded into the same
 *   hop so a request never takes two redirects.
 */
export function redirectTarget(input: {
    hostHeader: string | null;
    pathname: string;
    search: string;
    canonicalOrigin: string;
    enforce: boolean;
}): string | null {
    const { pathname, search, canonicalOrigin, enforce } = input;
    const host = hostnameOf(input.hostHeader);
    const canonicalHost = new URL(canonicalOrigin).hostname;

    const normalised = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const legacy = LEGACY_PATHS[normalised];

    const wrongHost = enforce && host !== "" && host !== canonicalHost && !isExemptHost(host);

    if (wrongHost) {
        // Legacy destinations drop the old query (e.g. /careers?position=x).
        return legacy ? `${canonicalOrigin}${legacy}` : `${canonicalOrigin}${pathname}${search}`;
    }
    if (legacy) return legacy;
    return null;
}
