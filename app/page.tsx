import type { Metadata } from "next";
import { faqJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { FAQS } from "@/components/staglabs/faq-data";
import { CtaBand } from "@/components/staglabs/cta-band";
import { FaqSection } from "@/components/staglabs/faq";
import { Hero } from "@/components/staglabs/hero";
import { MethodSection } from "@/components/staglabs/method";
import { OutcomesSection } from "@/components/staglabs/outcomes";
import { PageShell } from "@/components/staglabs/page-shell";
import { QualitySection } from "@/components/staglabs/quality";
import { QuoteBand } from "@/components/staglabs/quote";
import { WorkSection } from "@/components/staglabs/work";

export const metadata: Metadata = pageMeta({
    title: "Staglabs | MVP & Product Development Agency for Startups",
    description:
        "Staglabs builds production-ready MVPs, web apps and internal tools for startups in short, visible cycles. Ship fast without cutting corners.",
    path: "/",
});

export default function HomePage() {
    return (
        <PageShell>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd(FAQS)) }}
            />
            <Hero />
            <WorkSection />
            <MethodSection />
            <QualitySection />
            <QuoteBand />
            <OutcomesSection />
            <FaqSection />
            <CtaBand />
        </PageShell>
    );
}
