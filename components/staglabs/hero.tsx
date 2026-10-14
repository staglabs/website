import { HeroStartButton } from "./hero-start-button";
import { CaCta, CaWords } from "./primitives";

export function Hero() {
    return (
        <header id="top" className="ca-anchor">
            <section className="ca-pc ca-anchor">
                <div className="ca-pc__inner" data-band="night" data-tone="dark">
                    <div className="ca-fill ca-fill--hero" aria-hidden="true">
                        <img
                            src="/img/sky-night.avif"
                            alt=""
                            loading="eager"
                            fetchPriority="high"
                            decoding="async"
                        />
                    </div>

                    <div className="ca-hero-content relative z-10">
                        <div className="flex min-h-[calc(100svh-1.5rem)] flex-col items-center justify-center px-5 pt-28 pb-28 text-center sm:px-8">
                            <h1
                                className="ca-serif ca-h1 ca-hero-anim max-w-[20ch] [text-wrap:balance]"
                                style={{ color: "rgb(255, 255, 255)" }}
                            >
                                <CaWords text="Fast shipping," />{" "}
                                <em>
                                    <CaWords
                                        text="without the shortcuts."
                                        delay={98}
                                    />
                                </em>
                            </h1>

                            <p
                                className="ca-cover-lead ca-hero-anim mt-6 max-w-[34rem]"
                                style={{ color: "rgba(255, 255, 255, 0.92)" }}
                            >
                                Production software in tight, visible increments
                                — shipped fast, and built to stay.
                            </p>

                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <HeroStartButton />
                                <CaCta href="/#method">How we ship</CaCta>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </header>
    );
}
