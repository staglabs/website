import type { Metadata } from "next";
import Link from "next/link";
import { CaCta, CaSectionHead } from "@/components/staglabs/primitives";
import { PageHero, PageShell } from "@/components/staglabs/page-shell";

export const metadata: Metadata = {
    title: "About — Staglabs",
    description:
        "Staglabs is a software studio that designs, builds, and ships web products fast.",
};

const PRINCIPLES = [
    {
        tag: "SCOPE",
        title: "Small scope first",
        body: "We cut down to the smallest version that is genuinely useful, then ship that.",
    },
    {
        tag: "PROOF",
        title: "Working software",
        body: "Progress is measured in what runs in production, not in what was planned.",
    },
    {
        tag: "CYCLES",
        title: "Short cycles",
        body: "Build, review, adjust. Few moving parts, no long handoffs between layers.",
    },
];

const TEAM = [
    {
        name: "Chirag Dave",
        role: "Co-founder",
        href: "/about/chirag",
        body: "Builds the product surfaces and the systems behind them.",
    },
    {
        name: "Ishan Patra",
        role: "Co-founder",
        href: "/about/ishan",
        body: "Runs delivery: scope, cycles, and the checkpoints between them.",
    },
];

export default function AboutPage() {
    return (
        <PageShell>
            <PageHero
                eyebrow="Staglabs / About"
                lead="A software studio built for"
                em="short runways"
                intro="Staglabs is a software studio. We take a product idea and turn it into working, shipped software, quickly."
            />

            <section id="principles" className="ca-anchor ca-sec">
                <CaSectionHead
                    eyebrow="01 · Principles"
                    lead="How we"
                    em="work"
                    intro="Three habits that keep a short runway from turning into a long one."
                />

                <div className="ca-cx mt-14">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                        {PRINCIPLES.map((item) => (
                            <article
                                key={item.title}
                                className="ca-card flex flex-col p-6"
                            >
                                <span className="ca-chip self-start">
                                    {item.tag}
                                </span>
                                <h3
                                    className="ca-serif ca-h6 mt-5"
                                    style={{ color: "var(--ca-ink)" }}
                                >
                                    {item.title}
                                </h3>
                                <p
                                    className="mt-3 text-[0.92rem] leading-relaxed"
                                    style={{ color: "var(--ca-sub)" }}
                                >
                                    {item.body}
                                </p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="team" className="ca-anchor ca-sec">
                <CaSectionHead
                    eyebrow="02 · Team"
                    lead="Two people, one"
                    em="lane"
                    intro="Small on purpose. The people who scope the work are the people who build it."
                />

                <div className="ca-cx mt-14">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {TEAM.map((person) => (
                            <Link
                                key={person.href}
                                href={person.href}
                                className="ca-card flex flex-col p-7"
                                style={{ textDecoration: "none" }}
                            >
                                <span className="ca-chip self-start">
                                    {person.role}
                                </span>
                                <h3
                                    className="ca-serif ca-h5 mt-5"
                                    style={{ color: "var(--ca-ink)" }}
                                >
                                    {person.name}
                                </h3>
                                <p
                                    className="mt-3 text-[0.92rem] leading-relaxed"
                                    style={{ color: "var(--ca-sub)" }}
                                >
                                    {person.body}
                                </p>
                                <span className="ca-ilink mt-6 text-[0.9rem]">
                                    Profile ↗
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="ca-sec">
                <div className="ca-cm flex flex-col items-center gap-5 text-center">
                    <p className="ca-label" style={{ color: "var(--ca-sub)" }}>
                        START A PROJECT
                    </p>
                    <CaCta href="/#outcomes" tone="dark">
                        Start a project
                    </CaCta>
                </div>
            </section>
        </PageShell>
    );
}
