import { CaSectionHead } from "./primitives";

/**
 * Selected work, taken from the studio's own /work page. Descriptions are
 * verbatim. There are no client metrics, dates, or links to invent, so each
 * cell is a plain article rather than a dead link.
 */
type Project = {
    index: string;
    discipline: string;
    title: string;
    body: string;
};

const FEATURED = {
    index: "01",
    discipline: "E-COMMERCE",
    title: "E-Commerce Redesign",
    body: "A complete overhaul of a fashion brand's online store.",
};

const PROJECTS: Project[] = [
    {
        index: "02",
        discipline: "FINTECH",
        title: "Fintech Dashboard",
        body: "Real-time data visualization for a trading platform.",
    },
    {
        index: "03",
        discipline: "MOBILE",
        title: "Mobile App Interface",
        body: "UX/UI design for a health and fitness application.",
    },
    {
        index: "04",
        discipline: "SAAS",
        title: "SaaS Landing Page",
        body: "High-conversion landing page for a B2B software.",
    },
    {
        index: "05",
        discipline: "BRAND",
        title: "AI Research Lab",
        body: "Brand identity and website for an AI startup.",
    },
    {
        index: "06",
        discipline: "CULTURE",
        title: "Art Gallery Portfolio",
        body: "Minimalist portfolio for a contemporary art gallery.",
    },
];

/**
 * Monochrome interface skeleton — a drawn artifact standing in for a project
 * visual. Grows to fill whatever height its card has.
 */
function StorefrontSkeleton() {
    const tiles = [0, 1, 2, 3, 4, 5];

    return (
        <div className="ca-console flex h-full flex-col p-4" aria-hidden="true">
            <div className="flex items-center gap-2.5">
                {[0.5, 0.35, 0.22].map((o) => (
                    <span
                        key={o}
                        className="ca-dot"
                        style={{
                            width: "0.4rem",
                            height: "0.4rem",
                            background: "var(--ca-sub)",
                            opacity: o,
                        }}
                    />
                ))}
                <span
                    className="ml-2 h-4 flex-1 rounded-full"
                    style={{ background: "var(--ca-table)" }}
                />
            </div>

            <div className="mt-4 grid flex-1 grid-cols-3 gap-2.5">
                {tiles.map((t) => (
                    <div
                        key={t}
                        className="rounded-md"
                        style={{ background: "var(--ca-table)" }}
                    />
                ))}
            </div>

            <div className="mt-3 flex items-center gap-2.5">
                <span
                    className="h-2 flex-1 rounded-full"
                    style={{ background: "var(--ca-hairline)" }}
                />
                <span
                    className="h-2 w-[22%] rounded-full"
                    style={{ background: "var(--ca-ink)", opacity: 0.75 }}
                />
            </div>
        </div>
    );
}

/** Three checkpoints on a rail — the brand mark, used as a quiet motif. */
function Rail() {
    return (
        <svg
            width="46"
            height="14"
            viewBox="0 0 46 14"
            fill="none"
            aria-hidden="true"
            style={{ display: "block" }}
        >
            <rect x="0" y="6.5" width="46" height="1" fill="var(--ca-ink)" opacity="0.28" />
            <rect x="2" y="4" width="5" height="5" transform="rotate(45 4.5 6.5)" stroke="var(--ca-ink)" strokeWidth="1" opacity="0.4" />
            <rect x="20.5" y="4" width="5" height="5" transform="rotate(45 23 6.5)" fill="var(--ca-accent)" />
            <rect x="39" y="4" width="5" height="5" transform="rotate(45 41.5 6.5)" stroke="var(--ca-ink)" strokeWidth="1" opacity="0.4" />
        </svg>
    );
}

/**
 * Copy sits at the top and the description is bottom-anchored, so each cell
 * has content at both edges and reads deliberate rather than half-empty.
 */
function SmallCell({ project }: { project: Project }) {
    return (
        <article className="ca-card ca-grow flex flex-col p-6 transition-transform duration-300 hover:-translate-y-0.5">
            <div className="flex items-baseline justify-between gap-3">
                <span
                    className="ca-mono text-[0.66rem] tracking-[0.18em]"
                    style={{ color: "var(--ca-sub)" }}
                >
                    {project.index}
                </span>
                <span
                    className="ca-label text-[0.58rem]"
                    style={{ color: "var(--ca-sub)" }}
                >
                    {project.discipline}
                </span>
            </div>

            <h3
                className="ca-serif mt-4 text-[1.25rem] leading-tight"
                style={{ color: "var(--ca-ink)" }}
            >
                {project.title}
            </h3>

            <p
                className="mt-auto pt-4 text-[0.84rem] leading-relaxed"
                style={{ color: "var(--ca-sub)" }}
            >
                {project.body}
            </p>
        </article>
    );
}

export function WorkSection() {
    return (
        <section id="work" className="ca-anchor ca-sec" data-mood="curious">
            <CaSectionHead
                eyebrow="01 · Selected work"
                lead="What the studio has"
                em="shipped"
                intro="A selection of recent projects, from brand identity to production dashboards."
                wide
            />

            <div className="ca-cx mt-14">
                <div className="grid grid-cols-1 gap-5 md:auto-rows-[13rem] md:grid-cols-3">
                    {/* Featured project — two columns wide, two rows tall. */}
                    <article className="ca-card flex flex-col p-6 transition-transform duration-300 hover:-translate-y-0.5 sm:p-7 md:col-span-2 md:row-span-2">
                        <div className="flex items-baseline justify-between gap-3">
                            <span
                                className="ca-mono text-[0.66rem] tracking-[0.18em]"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                {FEATURED.index}
                            </span>
                            <span
                                className="ca-label text-[0.58rem]"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                {FEATURED.discipline}
                            </span>
                        </div>

                        <h3
                            className="ca-serif ca-h4 mt-5 max-w-[16ch] [text-wrap:balance]"
                            style={{ color: "var(--ca-ink)" }}
                        >
                            {FEATURED.title}
                        </h3>
                        <p
                            className="mt-3 max-w-[34rem] text-[1rem] leading-[1.6]"
                            style={{ color: "var(--ca-sub)" }}
                        >
                            {FEATURED.body}
                        </p>

                        {/* Absorbs the remaining height so the card never reads empty. */}
                        <div className="mt-6 min-h-[9rem] flex-1">
                            <StorefrontSkeleton />
                        </div>

                        <div className="mt-6 flex items-end justify-between gap-6">
                            <Rail />
                            <span
                                className="ca-label text-[0.58rem]"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                SELECTED WORK
                            </span>
                        </div>
                    </article>

                    {PROJECTS.map((project) => (
                        <SmallCell key={project.title} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
