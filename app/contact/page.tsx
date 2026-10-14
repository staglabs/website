import type { Metadata } from "next";
import { PageHero, PageShell } from "@/components/staglabs/page-shell";
import { CaSectionHead } from "@/components/staglabs/primitives";
import { pageMeta } from "@/lib/seo";
import { CONTACT_EMAIL } from "@/lib/site";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = pageMeta({
    title: "Contact Staglabs | Start Your MVP or Product Build",
    description:
        "Tell Staglabs what you are building. Send a short brief and a founder replies by email to scope your MVP, web app or internal tool for your startup.",
    path: "/contact",
});

export default function ContactPage() {
    return (
        <PageShell>
            <PageHero
                eyebrow="Staglabs / Contact"
                lead="Tell us what you are"
                em="building"
                intro="A few lines is enough. We reply by email with questions or a proposed first cycle."
                image="/img/sky-night.avif"
                band="night"
            />

            <section id="contact" className="ca-anchor ca-sec">
                <CaSectionHead
                    eyebrow="Get in touch"
                    lead="Start a"
                    em="project"
                    intro="Describe the problem, who it is for, and any deadline."
                />

                <div className="ca-cm mt-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
                        <ContactForm />

                        <aside className="flex flex-col gap-3">
                            <p className="ca-label" style={{ color: "var(--ca-sub)" }}>
                                EMAIL
                            </p>
                            <a
                                href={`mailto:${CONTACT_EMAIL}`}
                                className="ca-serif ca-h6 break-all"
                                style={{ color: "var(--ca-ink)" }}
                            >
                                {CONTACT_EMAIL}
                            </a>
                            <p
                                className="mt-2 text-[0.92rem] leading-relaxed"
                                style={{ color: "var(--ca-sub)" }}
                            >
                                Prefer to write directly? Send the brief to this address.
                            </p>
                        </aside>
                    </div>
                </div>
            </section>
        </PageShell>
    );
}
