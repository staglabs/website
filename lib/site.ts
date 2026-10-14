/**
 * Canonical site origin.
 *
 * Defaults to the production domain. `NEXT_PUBLIC_SITE_URL` still overrides it
 * (for example a preview deployment), but a production build refuses values
 * that would put a dev host into canonicals, the sitemap or JSON-LD.
 */
export const DEFAULT_SITE_URL = "https://staglabs.in";

/** Hosts that must never be advertised as the canonical origin. */
const FORBIDDEN_HOST = /(^|\.)sslip\.io$|^\d{1,3}(\.\d{1,3}){3}$|^localhost$|^\[.*\]$/i;

/** Returns the normalised origin, or throws a readable error. */
export function resolveSiteUrl(raw: string | undefined): string {
    const value = (raw ?? "").trim() || DEFAULT_SITE_URL;
    let url: URL;
    try {
        url = new URL(value);
    } catch {
        throw new Error(
            `NEXT_PUBLIC_SITE_URL is not a valid URL: "${value}". Expected something like ${DEFAULT_SITE_URL}`,
        );
    }
    if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error(`NEXT_PUBLIC_SITE_URL must be http(s): "${value}"`);
    }
    if (FORBIDDEN_HOST.test(url.hostname)) {
        throw new Error(
            `NEXT_PUBLIC_SITE_URL points at a dev/IP host (${url.hostname}). ` +
                `Unset it or use ${DEFAULT_SITE_URL}.`,
        );
    }
    return url.origin;
}

const raw = process.env.NEXT_PUBLIC_SITE_URL;

// Fail loudly during `next build`. Elsewhere (dev, tests) a bad value only warns
// and falls back, so a typo in a local shell cannot take the dev server down.
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

function pick(): string {
    try {
        return resolveSiteUrl(raw);
    } catch (error) {
        if (isProductionBuild) throw error;
        console.warn(`[site] ${(error as Error).message} Falling back to ${DEFAULT_SITE_URL}.`);
        return DEFAULT_SITE_URL;
    }
}

export const SITE_URL = pick();

export const SITE_NAME = "Staglabs";

/**
 * Public contact address, shown on /contact and in structured data.
 * PLACEHOLDER: confirm this mailbox exists, or set NEXT_PUBLIC_CONTACT_EMAIL.
 */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "hello@staglabs.in";

export const SOCIAL = {
    github: "https://github.com/staglabs",
    x: "https://x.com/staglabz",
} as const;

export const ROUTES = ["/", "/about", "/about/chirag", "/about/ishan", "/contact"] as const;
