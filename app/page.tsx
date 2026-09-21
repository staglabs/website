import { CtaBand } from "@/components/staglabs/cta-band";
import { FaqSection } from "@/components/staglabs/faq";
import { Hero } from "@/components/staglabs/hero";
import { MethodSection } from "@/components/staglabs/method";
import { OutcomesSection } from "@/components/staglabs/outcomes";
import { PageShell } from "@/components/staglabs/page-shell";
import { QualitySection } from "@/components/staglabs/quality";
import { QuoteBand } from "@/components/staglabs/quote";
import { WorkSection } from "@/components/staglabs/work";

export default function HomePage() {
    return (
        <PageShell>
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
