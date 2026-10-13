import { CaCta, CaEyebrow, CaWords } from "./primitives";
import { CheckMark } from "./icons";

type Feed = {
    title: string;
    label: string;
    items: { time: string; text: string }[];
};

const FEEDS: Feed[] = [
    {
        title: "Shipping lane",
        label: "BRIEF · BUILD · SHIP",
        items: [
            { time: "00:31", text: "Scope signed off, owner named" },
            { time: "01:58", text: "First screen running on the preview link" },
        ],
    },
    {
        title: "Quality gates",
        label: "REVIEW · TEST · HANDOVER",
        items: [
            { time: "01:36", text: "12 changes reviewed, none pushed direct" },
            { time: "03:09", text: "Coverage report sent to the client" },
        ],
    },
];

function TiltCard({ feed, side }: { feed: Feed; side: "l" | "r" }) {
    return (
        <div
            className={`ca-tilt ca-tilt--${side} absolute ${
                side === "l" ? "left-[6%]" : "right-[6%]"
            } top-1/2 hidden w-[15rem] -translate-y-1/2 xl:block`}
        >
            <div className="ca-glass ca-glass--light flex flex-col p-5">
                <div
                    className="flex items-start justify-between gap-3 pb-3"
                    style={{ borderBottom: "1px solid rgba(0,0,0,0.09)" }}
                >
                    <div className="min-w-0">
                        <p className="ca-serif text-[1.3rem] leading-none">
                            {feed.title}
                        </p>
                        <p
                            className="ca-label mt-1.5 text-[0.56rem]"
                            style={{ color: "var(--ca-sub)" }}
                        >
                            {feed.label}
                        </p>
                    </div>
                    <span
                        className="ca-label flex shrink-0 items-center gap-1.5 pt-0.5 text-[0.56rem]"
                        style={{ color: "var(--ca-sub)" }}
                    >
                        <span
                            className="ca-dot ca-dot--pulse"
                            style={{
                                width: "0.4rem",
                                height: "0.4rem",
                                background: "var(--ca-accent)",
                            }}
                            aria-hidden="true"
                        />
                        Live
                    </span>
                </div>

                <ul className="mt-1 flex flex-col">
                    {feed.items.map((item, i) => (
                        <li
                            key={item.time}
                            className="flex items-start gap-2.5 py-2 text-[0.82rem] leading-snug"
                            style={{
                                color: "var(--ca-ink)",
                                borderTop: i
                                    ? "1px solid rgba(0,0,0,0.07)"
                                    : undefined,
                            }}
                        >
                            <span
                                aria-hidden="true"
                                className="ca-mono mt-px shrink-0 text-[0.62rem]"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                {item.time}
                            </span>
                            <span
                                aria-hidden="true"
                                className="mt-px shrink-0 text-[0.72rem]"
                                style={{ color: "var(--ca-accent)" }}
                            >
                                <CheckMark size={11} />
                            </span>
                            {item.text}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export function CtaBand() {
    return (
        <section className="ca-pc ca-anchor">
            <div className="ca-pc__inner" data-band="day" data-tone="dark">
                <div className="ca-fill" aria-hidden="true">
                    <img src="/img/bookend-sky.avif" alt="" loading="lazy" />
                </div>

                <div className="relative z-10">
                    <div className="relative px-5 py-28 sm:px-8 lg:py-36">
                        <TiltCard feed={FEEDS[0]} side="l" />
                        <TiltCard feed={FEEDS[1]} side="r" />

                        <div className="mx-auto flex max-w-[42rem] flex-col items-center text-center">
                            <span className="ca-siv inline-flex">
                                <CaEyebrow tone="dark">START NOW</CaEyebrow>
                            </span>

                            <h2
                                className="ca-serif ca-h2 ca-split-head mt-6 [text-wrap:balance]"
                                style={{ color: "rgb(255, 255, 255)" }}
                            >
                                <CaWords text="Wake up to work" />{" "}
                                <em>
                                    <CaWords
                                        text="already shipped"
                                        delay={126}
                                    />
                                </em>
                            </h2>

                            <div className="ca-siv mt-9 flex flex-wrap items-center justify-center gap-3">
                                <CaCta href="/about" tone="dark">
                                    Start a project
                                </CaCta>
                                <CaCta href="/#method">How we ship</CaCta>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
