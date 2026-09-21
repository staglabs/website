import { CaCta, CaWords } from "@/components/staglabs/primitives";
import { PageShell } from "@/components/staglabs/page-shell";

export default function NotFound() {
    return (
        <PageShell>
            <section className="ca-pc ca-anchor">
                <div className="ca-pc__inner" data-band="night" data-tone="dark">
                    <div className="ca-fill" aria-hidden="true">
                        <img src="/img/sky-night.avif" alt="" loading="eager" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex min-h-[calc(100svh-1.5rem)] flex-col items-center justify-center px-5 pt-28 pb-28 text-center sm:px-8">
                            <span
                                className="ca-serif ca-stat"
                                style={{ color: "rgba(255, 255, 255, 0.35)" }}
                            >
                                404
                            </span>

                            <h1
                                className="ca-serif ca-h2 ca-split-head mt-4 [text-wrap:balance]"
                                style={{ color: "rgb(255, 255, 255)" }}
                            >
                                <CaWords text="This page never" />{" "}
                                <em>
                                    <CaWords text="shipped." delay={126} />
                                </em>
                            </h1>

                            <p
                                className="ca-cover-lead mt-7 max-w-[36rem]"
                                style={{ color: "rgba(255, 255, 255, 0.92)" }}
                            >
                                The route you asked for does not exist. Head back
                                to the lane.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <CaCta href="/" tone="dark">
                                    Back to home
                                </CaCta>
                                <CaCta href="/#method">How we ship</CaCta>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
