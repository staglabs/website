import type { Metadata } from "next";
import { TeamProfile, type TeamMember } from "@/components/staglabs/team-profile";

export const metadata: Metadata = {
    title: "Ishan Patra — Staglabs",
    alternates: { canonical: "/about/ishan" },
    description: "Ishan Patra is a co-founder of Staglabs.",
};

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
    return <TeamProfile member={member} />;
}
