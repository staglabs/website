import { CaStar, CaWords } from "./primitives";

export function QuoteBand() {
    return (
        <section className="ca-pc ca-anchor">
            <div className="ca-pc__inner" data-band="night" data-tone="dark">
                <div className="ca-fill" aria-hidden="true">
                    <img src="/img/sky-night.avif" alt="" loading="lazy" />
                </div>

                <div className="relative z-10">
                    <div className="ca-cm flex flex-col items-center py-28 text-center lg:py-36">
                        <blockquote
                            className="ca-serif ca-h3 ca-split-head max-w-[24ch] [text-wrap:balance]"
                            style={{ color: "rgb(255, 255, 255)" }}
                        >
                            <CaWords text="“The speed comes from the process," />{" "}
                            <em>
                                <CaWords text="not from skipping.”" delay={150} />
                            </em>
                        </blockquote>

                        <div className="ca-siv mt-9">
                            <span className="ca-pill ca-label ca-pill--glass">
                                <span
                                    className="ca-pill__star"
                                    aria-hidden="true"
                                >
                                    <CaStar fill="#ffffff" />
                                </span>
                                <span className="ca-pill__text">Staglabs</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
