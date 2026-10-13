/**
 * Canonical site origin. Set NEXT_PUBLIC_SITE_URL at build time once the real
 * domain is live. The fallback is the current public deployment.
 */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://staglabs.13-52-217-195.sslip.io"
).replace(/\/$/, "");

export const SITE_NAME = "Staglabs";

export const ROUTES = ["/", "/about", "/about/chirag", "/about/ishan"] as const;
