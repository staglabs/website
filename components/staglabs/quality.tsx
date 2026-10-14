import { CaCta, CaSectionHead } from "./primitives";

type Gate = {
    chip: string;
    title: string;
    body: string;
    console: {
        title: string;
        status: string;
        tone: "blue" | "green" | "amber";
        meta: string;
        actions: string[];
        footerLabel: string;
        footerBody: string;
    };
    stats: { figure: string; caption: string }[];
};

const GATES: Gate[] = [
    {
        chip: "Gate 01 · Scope",
        title: "Nothing enters the build blind",
        body: "Nothing enters the build without a written target and an owner.",
        console: {
            title: "Scope",
            status: "Opened",
            tone: "blue",
            meta: "Opened before the first commit",
            actions: ["Written target agreed", "Owner named"],
            footerLabel: "SCOPE DOC · ATTACHED",
            footerBody:
                "The target is written down before anything is built, and there is a name against it.",
        },
        stats: [
            { figure: "Written", caption: "target, not a conversation" },
            { figure: "1", caption: "owner named per project" },
        ],
    },
    {
        chip: "Gate 02 · Review",
        title: "Nothing merges unreviewed",
        body: "No change merges unreviewed, including ours.",
        console: {
            title: "Review",
            status: "Passed",
            tone: "green",
            meta: "Runs on every pull request",
            actions: ["Diff read line by line", "Reviewer signed off"],
            footerLabel: "REVIEW · COMPLETE",
            footerBody:
                "Every change is read before it lands. Our own commits go through the same gate.",
        },
        stats: [
            { figure: "100%", caption: "of changes reviewed before merge" },
            { figure: "0", caption: "direct pushes to main" },
        ],
    },
    {
        chip: "Gate 03 · Test",
        title: "Critical paths are covered",
        body: "Critical paths are covered before launch, and the coverage is shown to you.",
        console: {
            title: "Verification",
            status: "Passed",
            tone: "green",
            meta: "Runs before launch, not after",
            actions: [
                "Money paths tested",
                "Failure paths tested",
                "Results shared with you",
            ],
            footerLabel: "COVERAGE · SHOWN TO YOU",
            footerBody:
                "What was tested and what it returned goes to you, not into a drawer.",
        },
        stats: [
            { figure: "Before", caption: "launch, never after" },
            { figure: "Shown", caption: "to you, in full" },
        ],
    },
    {
        chip: "Gate 04 · Handover",
        title: "Docs land with the code",
        body: "Documentation and access land with the code, not months later.",
        console: {
            title: "Handover",
            status: "Complete",
            tone: "green",
            meta: "Delivered with the final deploy",
            actions: [
                "Documentation written",
                "Access transferred",
                "Walkthrough recorded",
            ],
            footerLabel: "HANDOVER · DELIVERED",
            footerBody:
                "Another team could pick this up without having to ask us anything.",
        },
        stats: [
            { figure: "Day one", caption: "access and ownership are yours" },
            { figure: "Written", caption: "runbook, not tribal knowledge" },
        ],
    },
];

export function QualitySection() {
    return (
        <section
            id="quality"
            data-mood="proud"
            className="ca-anchor ca-sec"
            style={{ background: "#ffffff" }}
        >
            <CaSectionHead
                eyebrow="03 · Quality"
                lead="Speed does not mean"
                em="skipping"
                intro="Fast is only useful if the result holds up, so four gates stay in place on every project."
            />

            <div className="ca-cx mt-14">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    {GATES.map((gate) => (
                        <article
                            key={gate.chip}
                            className="ca-card ca-grow flex flex-col p-6"
                        >
                            <span className="ca-chip self-start">{gate.chip}</span>

                            <h3
                                className="ca-serif ca-h6 mt-5"
                                style={{ color: "var(--ca-ink)" }}
                            >
                                {gate.title}
                            </h3>

                            <p
                                className="mt-3 text-[0.92rem] leading-relaxed lg:min-h-[4rem]"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                {gate.body}
                            </p>

                            <div className="ca-console mt-6 h-[16.5rem] p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <span
                                        className="text-[0.88rem] font-medium"
                                        style={{ color: "var(--ca-ink)" }}
                                    >
                                        {gate.console.title}
                                    </span>
                                    <span
                                        className={`ca-status ca-status--${gate.console.tone}`}
                                    >
                                        {gate.console.status}
                                    </span>
                                </div>

                                <p
                                    className="ca-mono mt-2 text-[0.66rem]"
                                    style={{ color: "var(--ca-sub)" }}
                                >
                                    {gate.console.meta}
                                </p>

                                <ul className="mt-3 flex flex-col gap-1.5">
                                    {gate.console.actions.map((action) => (
                                        <li
                                            key={action}
                                            className="ca-mono flex items-start gap-2 text-[0.68rem] leading-snug"
                                            style={{ color: "var(--ca-sub)" }}
                                        >
                                            <span
                                                className="ca-dot mt-[0.3rem]"
                                                style={{ opacity: 0.45 }}
                                                aria-hidden="true"
                                            />
                                            {action}
                                        </li>
                                    ))}
                                </ul>

                                <p
                                    className="ca-label mt-3 text-[0.58rem]"
                                    style={{ color: "var(--ca-accent)" }}
                                >
                                    {gate.console.footerLabel}
                                </p>

                                <p
                                    className="mt-1.5 text-[0.78rem] leading-snug"
                                    style={{ color: "var(--ca-ink)" }}
                                >
                                    {gate.console.footerBody}
                                </p>

                                <div
                                    className="ca-console__fade"
                                    aria-hidden="true"
                                />
                            </div>

                            <div
                                className="mt-auto flex items-start justify-between gap-4 border-t pt-5"
                                style={{ borderColor: "#e7e7ea" }}
                            >
                                {gate.stats.map((stat) => (
                                    <div key={stat.caption} className="min-w-0 flex-1">
                                        <p
                                            className="ca-serif text-[1.6rem]"
                                            style={{
                                                color: "var(--ca-ink)",
                                                lineHeight: 1,
                                            }}
                                        >
                                            {stat.figure}
                                        </p>
                                        <p
                                            className="mt-1 text-[0.74rem] leading-snug"
                                            style={{ color: "var(--ca-sub)" }}
                                        >
                                            {stat.caption}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </article>
                    ))}
                </div>

                <div className="ca-siv mt-12 flex flex-col items-center gap-5">
                    <p
                        className="ca-label text-center"
                        style={{ color: "var(--ca-sub)" }}
                    >
                        FOUR GATES, EVERY PROJECT
                    </p>
                    <CaCta href="/about" tone="dark">
                        Start a project
                    </CaCta>
                </div>
            </div>
        </section>
    );
}
