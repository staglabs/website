import { CaCta, CaSectionHead } from "./primitives";
import { PageHero, PageShell } from "./page-shell";

export type TeamMember = {
    lead: string;
    em: string;
    role: string;
    intro: string;
    bio: string[];
    links: { label: string; url: string; display: string }[];
    sibling: { label: string; href: string };
};

export function TeamProfile({ member }: { member: TeamMember }) {
    return (
        <PageShell>
            <PageHero
                eyebrow="Staglabs / Team"
                lead={member.lead}
                em={member.em}
                intro={member.intro}
                image="/img/sky-night.avif"
                band="night"
            />

            <section className="ca-anchor ca-sec">
                <div className="ca-cm">
                    <div className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[1fr_2fr]">
                        <div>
                            <span className="ca-chip">{member.role}</span>
                            <p
                                className="ca-label mt-6"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                PROFILE
                            </p>
                        </div>

                        <div className="flex flex-col gap-5">
                            {member.bio.map((paragraph) => (
                                <p
                                    key={paragraph}
                                    className="text-[1.0625rem] leading-[1.7]"
                                    style={{ color: "var(--ca-sub)" }}
                                >
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="ca-sec">
                <CaSectionHead
                    eyebrow="Links"
                    lead="Find them"
                    em="elsewhere"
                />

                <div className="ca-cm mt-12">
                    <ul
                        className="flex flex-col"
                        style={{ borderTop: "1px solid var(--ca-hairline)" }}
                    >
                        {member.links.map((link) => (
                            <li
                                key={link.url}
                                style={{ borderBottom: "1px solid var(--ca-hairline)" }}
                            >
                                <a
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between"
                                    style={{ textDecoration: "none" }}
                                >
                                    <span
                                        className="text-[0.95rem] font-medium"
                                        style={{ color: "var(--ca-ink)" }}
                                    >
                                        {link.label}
                                    </span>
                                    <span
                                        className="ca-mono text-[0.78rem]"
                                        style={{ color: "var(--ca-sub)" }}
                                    >
                                        {link.display} ↗
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section className="ca-sec">
                <div className="ca-cm flex flex-col items-center gap-5 text-center">
                    <p className="ca-label" style={{ color: "var(--ca-sub)" }}>
                        KEEP READING
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <CaCta href="/about" tone="dark">
                            About Staglabs
                        </CaCta>
                        <CaCta href={member.sibling.href}>
                            {member.sibling.label}
                        </CaCta>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
