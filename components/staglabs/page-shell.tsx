import type { ReactNode } from "react";
import { CaEyebrow, CaWords } from "./primitives";
import { SiteFooter } from "./site-footer";
import { SiteNav } from "./site-nav";
import { SmoothScroll } from "./smooth-scroll";

/**
 * Shared chrome for every route: the floating nav pill, the page body, and the
 * oversized footer. Keeps interior routes identical in theme to `/`.
 */
export function PageShell({ children }: { children: ReactNode }) {
    return (
        <SmoothScroll>
            <div className="ca-page min-h-screen" data-fill="sky">
                <a
                    href="#main"
                    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:text-black"
                >
                    Skip to content
                </a>

                <SiteNav />

                <main id="main">{children}</main>

                <SiteFooter />
            </div>
        </SmoothScroll>
    );
}

/**
 * Cover band used at the top of interior routes. Same construction as the
 * landing hero, but left weighted and shorter.
 */
export function PageHero({
    eyebrow,
    lead,
    em,
    intro,
    image = "/img/bookend-sky.avif",
    band = "day",
}: {
    eyebrow: ReactNode;
    lead: string;
    em?: string;
    intro?: ReactNode;
    image?: string;
    band?: "day" | "dusk" | "night";
}) {
    return (
        <header className="ca-anchor">
            <section className="ca-pc ca-anchor">
                <div className="ca-pc__inner" data-band={band} data-tone="dark">
                    <div className="ca-fill" aria-hidden="true">
                        <img src={image} alt="" loading="eager" fetchPriority="high" />
                    </div>

                    <div className="relative z-10">
                        <div className="ca-cm px-5 pt-36 pb-20 sm:px-8 lg:pt-44 lg:pb-28">
                            <div className="flex max-w-[46rem] flex-col items-start">
                                <CaEyebrow tone="dark">{eyebrow}</CaEyebrow>

                                <h1
                                    className="ca-serif ca-h1 ca-split-head mt-5 [text-wrap:balance]"
                                    style={{ color: "rgb(255, 255, 255)" }}
                                >
                                    <CaWords text={lead} />
                                    {em ? (
                                        <>
                                            {" "}
                                            <em>
                                                <CaWords
                                                    text={em}
                                                    delay={lead.split(" ").length * 42}
                                                />
                                            </em>
                                        </>
                                    ) : null}
                                </h1>

                                {intro ? (
                                    <p
                                        className="ca-cover-lead mt-7 max-w-[40rem]"
                                        style={{ color: "rgba(255, 255, 255, 0.92)" }}
                                    >
                                        {intro}
                                    </p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
}
