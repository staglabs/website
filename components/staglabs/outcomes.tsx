import { CaCheck, CaCta, CaSectionHead } from "./primitives";

const OUTCOMES = [
    {
        title: "Product interfaces",
        body: "Customer-facing web and app surfaces that look deliberate, load fast, and stay easy to change after launch.",
    },
    {
        title: "Internal tools",
        body: "Dashboards, admin panels, and operational workflows that replace the spreadsheet holding the business together.",
    },
    {
        title: "AI-assisted surfaces",
        body: "Product features where a model does real work, wired in with the same review and testing standard as everything else.",
    },
];

const STATS = [
    { figure: "5", caption: "checkpoints on every project" },
    { figure: "Short", caption: "cycles, not quarters" },
    { figure: "Small", caption: "diffs you can actually review" },
];

export function OutcomesSection() {
    return (
        <section id="outcomes" className="ca-anchor ca-sec">
            <CaSectionHead
                eyebrow="04 · Outcomes"
                lead="What we"
                em="ship"
                intro="Three kinds of work, and the same standard underneath all of them."
            />

            <div className="ca-cx mt-14">
                <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_2fr]">
                    <aside className="ca-card ca-siv flex flex-col justify-between gap-10 p-7">
                        <div>
                            <p
                                className="ca-label"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                What we ship
                            </p>
                            <ul className="mt-6 flex flex-col gap-5">
                                {OUTCOMES.map((item) => (
                                    <li
                                        key={item.title}
                                        className="flex items-start gap-3.5"
                                    >
                                        <span className="mt-px shrink-0">
                                            <CaCheck />
                                        </span>
                                        <span>
                                            <span
                                                className="block text-[0.9rem] leading-snug font-medium"
                                                style={{ color: "var(--ca-ink)" }}
                                            >
                                                {item.title}
                                            </span>
                                            <span
                                                className="mt-1 block text-[0.85rem] leading-snug"
                                                style={{ color: "var(--ca-sub)" }}
                                            >
                                                {item.body}
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p
                            className="border-t pt-6 text-[0.9rem] leading-relaxed italic"
                            style={{
                                borderColor: "#e7e7ea",
                                color: "var(--ca-sub)",
                            }}
                        >
                            Not every brief is a fit. We say so before you spend
                            anything.
                        </p>

                        <dl className="flex flex-col">
                            {STATS.map((stat) => (
                                <div
                                    key={stat.caption}
                                    className="flex items-baseline gap-4 border-t py-[1.15rem]"
                                    style={{ borderColor: "#e7e7ea" }}
                                >
                                    <dt
                                        className="ca-serif w-[6.5rem] shrink-0 text-[1.3rem]"
                                        style={{
                                            color: "var(--ca-ink)",
                                            lineHeight: 1.1,
                                        }}
                                    >
                                        {stat.figure}
                                    </dt>
                                    <dd
                                        className="text-[0.78rem] leading-snug"
                                        style={{ color: "var(--ca-sub)" }}
                                    >
                                        {stat.caption}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </aside>

                    <div className="ca-card ca-siv p-3">
                        <div className="flex h-full min-h-[420px] flex-col items-center justify-center rounded-[1.25rem] bg-white px-8 py-14 text-center">
                            <p
                                className="ca-label"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                Start a project
                            </p>
                            <p
                                className="ca-serif mt-5 text-[clamp(1.6rem,3.2vw,2.6rem)] leading-tight"
                                style={{ color: "var(--ca-ink)" }}
                            >
                                Tell us what needs to ship.
                            </p>
                            <p
                                className="mt-5 max-w-[30rem] text-[0.95rem] leading-relaxed"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                One paragraph is enough: what you are building,
                                what is blocking it, and when you need it live.
                                We will read it and reply with what the first
                                cycle would look like.
                            </p>
                            <div className="mt-8">
                                <CaCta href="/about" tone="dark">
                                    Start a project
                                </CaCta>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
