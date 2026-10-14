import type { Metadata } from "next";
import { FOUNDERS, personJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { TeamProfile, type TeamMember } from "@/components/staglabs/team-profile";

export const metadata: Metadata = pageMeta({
    title: "Ishan Patra | Co-founder, Staglabs",
    description:
        "Ishan Patra is co-founder of Staglabs, a product engineering studio. He runs delivery: scope, build cycles and the checkpoints that keep MVPs shipping.",
    path: "/about/ishan",
});

const member: TeamMember = {
    lead: "Ishan",
    em: "Patra",
    role: "Co-founder",
    intro:
        "Ishan is a co-founder of Staglabs, a software studio that builds and ships web products.",
    bio: [
        "Ishan is a co-founder of Staglabs, a software studio that builds and ships web products.",
        "He runs delivery: scope, build cycles, and the checkpoints between them. Small diffs, short cycles, and course corrections while they are still cheap.",
    ],
    links: [
        {
            label: "GitHub",
            url: "https://github.com/realishanpatra",
            display: "github.com/realishanpatra",
        },
        {
            label: "LinkedIn",
            url: "https://linkedin.com/in/ishan-patra-407a74257",
            display: "linkedin.com/in/ishan-patra-407a74257",
        },
    ],
    sibling: { label: "Chirag Dave", href: "/about/chirag" },
};

export default function IshanPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        personJsonLd({
                            id: FOUNDERS.ishan.id,
                            name: FOUNDERS.ishan.name,
                            path: FOUNDERS.ishan.path,
                            jobTitle: "Co-founder",
                            sameAs: [FOUNDERS.ishan.website, ...member.links.map((l) => l.url)],
                        }),
                    ),
                }}
            />
            <TeamProfile member={member} />
        </>
    );
}
