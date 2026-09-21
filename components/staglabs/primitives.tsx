import Link from "next/link";
import { Fragment } from "react";
import type { ReactNode } from "react";

/* --------------------------------------------------------------- brand mark */

/**
 * The Staglabs mark — the isometric S/V monogram from the live site.
 *
 * The asset ships as ink-on-transparent, so dark surfaces invert it rather
 * than shipping a second file.
 */
export function CaLogo({
    size = 26,
    tone = "ink",
}: {
    size?: number;
    tone?: "ink" | "white";
}) {
    return (
        <img
            src="/staglabs-mark.png"
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            style={{
                display: "block",
                flexShrink: 0,
                filter: tone === "white" ? "brightness(0) invert(1)" : undefined,
            }}
        />
    );
}

const STAR_PATH =
    "M7.32538 18.923L8.56538 13.61L4.44238 10.038L9.87338 9.568L12.0004 4.557L14.1274 9.567L19.5574 10.037L15.4344 13.609L16.6754 18.922L12.0004 16.102L7.32538 18.923Z";

export function CaStar({
    size = 16,
    fill = "var(--ca-accent)",
}: {
    size?: number;
    fill?: string;
}) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={STAR_PATH} fill={fill} />
        </svg>
    );
}

export function CaCheck({ ghost = false }: { ghost?: boolean }) {
    return (
        <span
            className={`ca-check ${ghost ? "ca-check--ghost" : ""}`.trim()}
            aria-hidden="true"
        >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path
                    d="M2.5 6.2l2.3 2.3 4.7-5"
                    stroke="#fff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </span>
    );
}

/* ------------------------------------------------------------------ eyebrow */

export function CaEyebrow({
    children,
    tone = "light",
}: {
    children: ReactNode;
    tone?: "light" | "dark";
}) {
    const glass = tone === "dark";

    return (
        <span
            className={`ca-pill ca-label ${glass ? "ca-pill--glass" : ""}`.trim()}
            style={{ color: glass ? "rgba(255,255,255,0.9)" : "var(--ca-sub)" }}
        >
            <span className="ca-pill__star" aria-hidden="true">
                <CaStar fill={glass ? "#ffffff" : "var(--ca-accent)"} />
            </span>
            <span className="ca-pill__text">{children}</span>
        </span>
    );
}

/* ------------------------------------------------------------------- button */

export function CaCta({
    href,
    children,
    tone = "light",
    className = "",
}: {
    href: string;
    children: ReactNode;
    tone?: "light" | "dark";
    className?: string;
}) {
    return (
        <Link
            href={href}
            className={`ca-acta ${tone === "dark" ? "ca-acta--dark" : ""} ${className}`.trim()}
        >
            <span className="ca-acta__bg" aria-hidden="true" />
            <span className="ca-acta__label">{children}</span>
            <span className="ca-acta__chip" aria-hidden="true">
                ↗
            </span>
        </Link>
    );
}

/* ------------------------------------------------------------ split heading */

export function CaWords({ text, delay = 0 }: { text: string; delay?: number }) {
    const words = text.split(" ");

    return (
        <>
            {words.map((word, i) => (
                <Fragment key={`${word}-${i}`}>
                    {i > 0 ? " " : null}
                    <span
                        className="ca-word"
                        style={{ animationDelay: `${delay + i * 42}ms` }}
                    >
                        {word}
                    </span>
                </Fragment>
            ))}
        </>
    );
}

/**
 * Section heading: eyebrow pill, serif display title with optional italic
 * emphasis, and an intro paragraph. The visible text is the real text — the
 * per-word spans are presentational, so screen readers read the heading
 * normally and nothing is hidden if animations never run.
 */
export function CaSectionHead({
    eyebrow,
    lead,
    em,
    intro,
    tone = "light",
    wide = false,
}: {
    eyebrow: ReactNode;
    lead: string;
    em?: string;
    intro?: ReactNode;
    tone?: "light" | "dark";
    wide?: boolean;
}) {
    const ink = tone === "dark" ? "rgb(255,255,255)" : "var(--ca-ink)";
    const sub = tone === "dark" ? "rgba(255,255,255,0.85)" : "var(--ca-sub)";

    return (
        <div className="ca-cm">
            <div className="flex flex-col items-center text-center">
                <CaEyebrow tone={tone}>{eyebrow}</CaEyebrow>
                <h2
                    className="ca-serif ca-h2 ca-split-head mt-5 max-w-[18ch] [text-wrap:balance]"
                    style={{ color: ink }}
                >
                    <CaWords text={lead} />
                    {em ? (
                        <>
                            {" "}
                            <em>
                                <CaWords text={em} delay={lead.split(" ").length * 42} />
                            </em>
                        </>
                    ) : null}
                </h2>
                {intro ? (
                    <p
                        className={`ca-body-lg mt-4 ${wide ? "max-w-[44rem]" : "max-w-[36rem]"}`}
                        style={{ color: sub }}
                    >
                        {intro}
                    </p>
                ) : null}
            </div>
        </div>
    );
}
