import Link from "next/link";
import ParticleText from "./particle-text";
import { CaCta, CaLogo } from "./primitives";

const PAGES = [
    { label: "Home", href: "/" },
    { label: "Work", href: "/#work" },
    { label: "Method", href: "/#method" },
    { label: "Quality", href: "/#quality" },
    { label: "Outcomes", href: "/#outcomes" },
    { label: "FAQ", href: "/#faq" },
];

const TEAM = [
    { label: "About Staglabs", href: "/about" },
    { label: "Chirag Dave", href: "/about/chirag" },
    { label: "Ishan Patra", href: "/about/ishan" },
];

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="ca-anchor pt-20" style={{ background: "#ffffff" }}>
            <div className="ca-cl">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
                    <div className="max-w-[26rem]">
                        <span className="flex items-center gap-3">
                            <CaLogo size={26} />
                            <span
                                className="ca-serif text-[1.5rem]"
                                style={{ color: "var(--ca-ink)", lineHeight: 1 }}
                            >
                                Staglabs
                            </span>
                        </span>

                        <p
                            className="mt-5 text-[0.95rem] leading-relaxed"
                            style={{ color: "var(--ca-sub)" }}
                        >
                            Staglabs builds production software for teams on
                            short runways — in tight, visible increments, with
                            the parts that keep it standing left in.
                        </p>

                        <div className="mt-7">
                            <CaCta href="/about" tone="dark">
                                Start a project
                            </CaCta>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p
                                className="ca-label"
                                style={{ color: "var(--ca-ink)" }}
                            >
                                PAGES
                            </p>
                            <ul className="mt-5 flex flex-col gap-3">
                                {PAGES.map((link) => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="ca-flink text-[0.95rem]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <p
                                className="ca-label"
                                style={{ color: "var(--ca-ink)" }}
                            >
                                TEAM
                            </p>
                            <ul className="mt-5 flex flex-col gap-3">
                                {TEAM.map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="ca-flink text-[0.95rem]"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-16 flex flex-wrap items-center justify-between gap-3 border-t py-6"
                    style={{ borderColor: "var(--ca-hairline)" }}
                >
                    <p
                        className="text-[0.78rem]"
                        style={{ color: "var(--ca-sub)" }}
                    >
                        © {year} Staglabs. All rights reserved.
                    </p>
                    <p
                        className="ca-label text-[0.62rem]"
                        style={{ color: "var(--ca-sub)" }}
                    >
                        Built by Chirag Dave and Ishan Patra
                    </p>
                </div>
            </div>

            <div className="ca-wordmark-clip">
                <ParticleText
                    text="STAGLABS"
                    className="ca-wordmark-particle"
                    fontFamily={'"Libre Caslon Condensed", "Times New Roman", serif'}
                    fontSize="13.5vw"
                    fontWeight={400}
                    particleSize={7}
                    density={3}
                    color="#131313"
                    highlightColor="#131313"
                    /*
                     * scatter is 0, not the 180 default. The gather animation
                     * converged only intermittently here — on some loads the
                     * word never formed and the footer read as static noise.
                     * Starting particles at their targets makes the wordmark
                     * deterministic. Cursor repel and idle drift still run, so
                     * the field is alive; only the intro gather is dropped.
                     */
                    scatter={0}
                    gatherDuration={1500}
                    stagger={380}
                    /*
                     * glow stays OFF. The component sets ctx.shadowBlur per
                     * particle when glow is on, which costs a blur pass for
                     * every one of ~3k particles every frame — enough to stall
                     * the main thread and stop the gather ever completing.
                     * It also reads as grey smudge on this white ground.
                     */
                    glow={false}
                    trigger="hover"
                />
            </div>
        </footer>
    );
}
