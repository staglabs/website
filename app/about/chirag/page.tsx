import type { Metadata } from "next";
import { FOUNDERS, personJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { TeamProfile, type TeamMember } from "@/components/staglabs/team-profile";

export const metadata: Metadata = pageMeta({
    title: "Chirag Dave | Co-founder, Staglabs",
    description:
        "Chirag Dave is co-founder of Staglabs, a product engineering studio. He builds the interfaces, data models and systems behind startup web products.",
    path: "/about/chirag",
});

const member: TeamMember = {
    lead: "Chirag",
    em: "Dave",
    role: "Co-founder",
    intro:
        "Chirag is a co-founder of Staglabs, a software studio that builds and ships web products.",
    bio: [
        "Chirag is a co-founder of Staglabs, a software studio that builds and ships web products.",
        "He works on the product side: interfaces, data models, and the systems that hold them up. The work is measured in what runs in production, not in what was planned.",
    ],
    links: [
        {
            label: "GitHub",
            url: "https://github.com/definitelynotchirag",
            display: "github.com/definitelynotchirag",
        },
        {
            label: "LinkedIn",
            url: "https://linkedin.com/in/chirag-dave-751a91249",
            display: "linkedin.com/in/chirag-dave-751a91249",
        },
    ],
    sibling: { label: "Ishan Patra", href: "/about/ishan" },
};

export default function ChiragPage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(
                        personJsonLd({
                            id: FOUNDERS.chirag.id,
                            name: FOUNDERS.chirag.name,
                            path: FOUNDERS.chirag.path,
                            jobTitle: "Co-founder",
                            sameAs: [FOUNDERS.chirag.website, ...member.links.map((l) => l.url)],
                        }),
                    ),
                }}
            />
            <TeamProfile member={member} />
        </>
    );
}
