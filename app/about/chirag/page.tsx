import type { Metadata } from "next";
import { TeamProfile, type TeamMember } from "@/components/staglabs/team-profile";

export const metadata: Metadata = {
    title: "Chirag Dave — Staglabs",
    description: "Chirag Dave is a co-founder of Staglabs.",
};

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
    return <TeamProfile member={member} />;
}
