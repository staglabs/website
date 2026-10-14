import { CONTACT_EMAIL, SITE_NAME, SITE_URL, SOCIAL } from "@/lib/site";

/** One stable id for the organisation, referenced (never redefined) elsewhere. */
export const ORG_ID = `${SITE_URL}/#organization`;

export const ORG_DESCRIPTION =
    "Staglabs builds production-ready MVPs, web apps and internal tools for startups in short, visible cycles.";

export const FOUNDERS = {
    chirag: {
        id: `${SITE_URL}/about/chirag#person`,
        name: "Chirag Dave",
        path: "/about/chirag",
        website: "https://chirxg.is-a.dev",
    },
    ishan: {
        id: `${SITE_URL}/about/ishan#person`,
        name: "Ishan Patra",
        path: "/about/ishan",
        website: "https://ishanpatra.com",
    },
} as const;

/** The single Organization entity, emitted once per page by the root layout. */
export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE_NAME,
        url: SITE_URL,
        description: ORG_DESCRIPTION,
        logo: `${SITE_URL}/staglabs-mark.png`,
        email: CONTACT_EMAIL,
        sameAs: [SOCIAL.github, SOCIAL.x],
        areaServed: "Worldwide",
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "sales",
            email: CONTACT_EMAIL,
            url: `${SITE_URL}/contact`,
            availableLanguage: "English",
        },
        founder: Object.values(FOUNDERS).map((f) => ({
            "@type": "Person",
            "@id": f.id,
            name: f.name,
            url: `${SITE_URL}${f.path}`,
        })),
    };
}

export function faqJsonLd(items: readonly { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: items.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
    };
}

export function personJsonLd(input: {
    id: string;
    name: string;
    path: string;
    jobTitle: string;
    sameAs: string[];
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": input.id,
        name: input.name,
        jobTitle: input.jobTitle,
        url: `${SITE_URL}${input.path}`,
        // A reference to the one organisation entity, not a second definition.
        worksFor: { "@id": ORG_ID },
        sameAs: input.sameAs,
    };
}
