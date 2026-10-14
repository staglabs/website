import type { ReactNode } from "react";
import { CaCheck, CaCta, CaSectionHead } from "./primitives";

/* ---------------------------------------------------------------- figures */

function Rows({
    items,
}: {
    items: { label: string; meta?: string; status?: string; tone?: string }[];
}) {
    return (
        <ul className="flex flex-col">
            {items.map((item, i) => (
                <li
                    key={item.label}
                    className="flex items-center gap-3 py-3"
                    style={
                        i ? { borderTop: "1px solid var(--ca-hairline)" } : undefined
                    }
                >
                    {item.meta ? (
                        <span
                            className="ca-mono text-[0.66rem]"
                            style={{ color: "var(--ca-sub)" }}
                        >
                            {item.meta}
                        </span>
                    ) : null}
                    <span
                        className="text-[0.88rem]"
                        style={{ color: "var(--ca-ink)" }}
                    >
                        {item.label}
                    </span>
                    {item.status ? (
                        <span
                            className={`ca-status ca-status--${item.tone} ml-auto`}
                        >
                            {item.status}
                        </span>
                    ) : null}
                </li>
            ))}
        </ul>
    );
}

function Checklist({ items }: { items: string[] }) {
    return (
        <ul className="flex flex-col gap-4">
            {items.map((item) => (
                <li key={item} className="flex items-start gap-3.5">
                    <span className="mt-px shrink-0">
                        <CaCheck />
                    </span>
                    <span
                        className="text-[0.9rem] leading-snug"
                        style={{ color: "var(--ca-ink)" }}
                    >
                        {item}
                    </span>
                </li>
            ))}
        </ul>
    );
}

/* ------------------------------------------------------------------ steps */

type Step = {
    n: string;
    stage: string;
    title: string;
    caption: string;
    body: string;
    note?: string;
    footnote: string;
    figure: ReactNode;
};

const STEPS: Step[] = [
    {
        n: "01",
        stage: "BRIEF",
        title: "Brief",
        caption: "Agreed scope",
        body: "We take the brief, the constraint, and the deadline you actually have, and turn them into a single written target.",
        note: "One page in.",
        footnote: "Written before a line of production code",
        figure: (
            <Checklist
                items={[
                    "The problem, written plainly",
                    "The constraint that actually binds",
                    "The deadline you are working to",
                ]}
            />
        ),
    },
    {
        n: "02",
        stage: "FRAME",
        title: "Frame",
        caption: "Signed direction",
        body: "Data, routes, and interface decisions get settled in the open so nobody discovers them late.",
        footnote: "Signed direction",
        figure: (
            <Rows
                items={[
                    { label: "Data model", status: "settled", tone: "blue" },
                    { label: "Routes", status: "settled", tone: "blue" },
                    { label: "Interface", status: "settled", tone: "blue" },
                ]}
            />
        ),
    },
    {
        n: "03",
        stage: "BUILD",
        title: "Build",
        caption: "Running preview",
        body: "Work lands in reviewable pieces you can see running, so course corrections stay cheap.",
        footnote: "Preview link live from the first cycle",
        figure: (
            <Rows
                items={[
                    { meta: "a1f9c02", label: "Scope doc", status: "merged", tone: "green" },
                    { meta: "7d3e114", label: "Data model wired", status: "merged", tone: "green" },
                    { meta: "b04c8e6", label: "First screen running", status: "merged", tone: "green" },
                ]}
            />
        ),
    },
    {
        n: "04",
        stage: "VERIFY",
        title: "Verify",
        caption: "Verified build",
        body: "The paths that cost money when they break get attention before launch, not after.",
        footnote: "Coverage shown to you, not summarised",
        figure: (
            <Rows
                items={[
                    { label: "Checkout", status: "passed", tone: "green" },
                    { label: "Auth", status: "passed", tone: "green" },
                    { label: "Edge cases", status: "in review", tone: "amber" },
                ]}
            />
        ),
    },
    {
        n: "05",
        stage: "SHIP",
        title: "Ship",
        caption: "Handover",
        body: "Deploy, document, and hand over a system your team can operate without us.",
        footnote: "Documentation lands with the code",
        figure: (
            <Checklist
                items={[
                    "Repository and access transferred",
                    "Runbook written",
                    "Walkthrough recorded",
                ]}
            />
        ),
    },
];

/* ---------------------------------------------------------------- section */

export function MethodSection() {
    return (
        <section id="method" className="ca-anchor ca-sec" data-mood="working">
            <CaSectionHead
                eyebrow="02 · Method"
                lead="From brief to"
                em="handover"
                intro="Every piece of work travels the same five checkpoints in order, and each checkpoint has something reviewable attached to it."
            />

            <div className="ca-cl mt-14">
                <div style={{ borderBottom: "1px solid var(--ca-hairline)" }}>
                    {STEPS.map((step, i) => {
                        const flip = i % 2 === 1;

                        return (
                            <article
                                key={step.n}
                                className="ca-siv py-11 lg:py-14"
                                style={{ borderTop: "1px solid var(--ca-hairline)" }}
                            >
                                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                                    <p
                                        className="ca-label text-[0.66rem]"
                                        style={{ color: "var(--ca-accent)" }}
                                    >
                                        Step {step.n} · {step.stage}
                                    </p>
                                </div>

                                <div className="mt-8 grid grid-cols-1 items-center gap-x-14 gap-y-9 lg:grid-cols-2">
                                    <div className={flip ? "lg:order-2" : ""}>
                                        <h3
                                            className="ca-serif ca-h4"
                                            style={{ color: "var(--ca-ink)" }}
                                        >
                                            {step.title}
                                        </h3>
                                        <p
                                            className="mt-4 max-w-[540px] text-[1rem] leading-[1.65]"
                                            style={{ color: "var(--ca-sub)" }}
                                        >
                                            {step.body}
                                        </p>
                                        {step.note ? (
                                            <p
                                                className="mt-3 text-[0.88rem] italic"
                                                style={{ color: "var(--ca-ink)" }}
                                            >
                                                {step.note}
                                            </p>
                                        ) : null}
                                    </div>

                                    <div className={flip ? "lg:order-1" : ""}>
                                        <div className="ca-card flex min-h-[300px] flex-col p-6 sm:p-7">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className="ca-mono text-[0.66rem] tracking-[0.18em]"
                                                    style={{ color: "var(--ca-accent)" }}
                                                >
                                                    FIG. {step.n}
                                                </span>
                                                <span
                                                    className="ca-label text-[0.6rem]"
                                                    style={{ color: "var(--ca-sub)" }}
                                                >
                                                    {step.caption}
                                                </span>
                                            </div>

                                            <div className="flex flex-1 items-center justify-center py-6">
                                                <div className="w-full max-w-[360px]">
                                                    {step.figure}
                                                </div>
                                            </div>

                                            <p
                                                className="ca-label mt-5 text-center text-[0.58rem]"
                                                style={{ color: "var(--ca-sub)" }}
                                            >
                                                {step.footnote}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        );
                    })}
                </div>

                <div className="ca-siv mt-12 flex flex-col items-center gap-5">
                    <p className="ca-label" style={{ color: "var(--ca-sub)" }}>
                        EVERY PROJECT TRAVELS THE SAME FIVE CHECKPOINTS
                    </p>
                    <CaCta href="/about" tone="dark">
                        Start a project
                    </CaCta>
                </div>
            </div>
        </section>
    );
}
