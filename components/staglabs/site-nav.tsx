"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CaCta, CaLogo } from "./primitives";
import RubberSegment from "./rubber-segment";
import { useLenis } from "./smooth-scroll";
import { CloseMark } from "./icons";

const NAV_LINKS = [
    { label: "Work", href: "/#work" },
    { label: "Method", href: "/#method" },
    { label: "Quality", href: "/#quality" },
    { label: "Outcomes", href: "/#outcomes" },
    { label: "FAQ", href: "/#faq" },
];

const MOBILE_LINKS = [
    ...NAV_LINKS,
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href.split("#")[1]);

export function SiteNav() {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState<string>(SECTION_IDS[0]);
    const burgerRef = useRef<HTMLButtonElement>(null);
    const lenis = useLenis();
    const router = useRouter();
    const pathname = usePathname();

    // While a nav click is driving the scroll, the spy is locked. Otherwise it
    // re-targets the thumb to every section the page passes on the way, so a
    // far jump makes the thumb stutter through each stop instead of gliding
    // straight to the destination.
    const spyLocked = useRef(false);
    const lockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    function pickActiveFromViewport() {
        const mid = window.innerHeight * 0.5;
        let best: string | null = null;
        for (const id of SECTION_IDS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const r = el.getBoundingClientRect();
            if (r.top <= mid && r.bottom >= mid) best = id;
        }
        if (best) setActive(best);
    }

    function releaseSpy() {
        clearTimeout(lockTimer.current);
        if (!spyLocked.current) return;
        spyLocked.current = false;
        pickActiveFromViewport();
    }

    // Scroll-spy: a thin band across the middle of the viewport. Whichever
    // section crosses it owns the thumb, so the marker tracks the page the way
    // the brand mark tracks a lane.
    useEffect(() => {
        const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
            (el): el is HTMLElement => el !== null,
        );
        if (!sections.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (spyLocked.current) return;
                entries.forEach((entry) => {
                    if (entry.isIntersecting) setActive(entry.target.id);
                });
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );

        sections.forEach((section) => observer.observe(section));

        // The visitor taking the wheel or keys back ends the programmatic scroll.
        const takeover = () => releaseSpy();
        window.addEventListener("wheel", takeover, { passive: true });
        window.addEventListener("touchstart", takeover, { passive: true });
        window.addEventListener("keydown", takeover);
        window.addEventListener("scrollend", takeover);

        return () => {
            observer.disconnect();
            window.removeEventListener("wheel", takeover);
            window.removeEventListener("touchstart", takeover);
            window.removeEventListener("keydown", takeover);
            window.removeEventListener("scrollend", takeover);
            clearTimeout(lockTimer.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    function handleSectionChange(id: string) {
        const target = document.getElementById(id);
        if (!target) {
            // Interior routes carry no sections — let the router jump to them.
            router.push(`/#${id}`);
            return;
        }
        spyLocked.current = true;
        setActive(id);
        // Safety net: never leave the spy locked if no completion event fires.
        clearTimeout(lockTimer.current);
        lockTimer.current = setTimeout(releaseSpy, 3000);

        if (lenis) {
            lenis.scrollTo(target, { offset: -96, onComplete: releaseSpy });
        } else {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        window.history.pushState(null, "", `#${id}`);
    }

    useEffect(() => {
        if (!open) return;

        function onKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                setOpen(false);
                burgerRef.current?.focus();
            }
        }

        document.addEventListener("keydown", onKeyDown);
        document.body.style.overflow = "hidden";
        // Pause Lenis too, or the damped wheel keeps driving the page behind
        // the overlay even though body overflow is hidden.
        lenis?.stop();

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = "";
            lenis?.start();
        };
    }, [open, lenis]);

    return (
        <>
            <nav className="ca-nav" aria-label="Main">
                <div className="ca-nav__space" aria-hidden="true" />
                <div className="ca-nav__row">
                    <div className="ca-nav__pillwrap">
                        <svg
                            className="ca-nav__corner ca-nav__corner--l"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M24 24C24 10.7452 13.2548 0 0 0H24V24Z"
                                fill="currentColor"
                            />
                        </svg>
                        <svg
                            className="ca-nav__corner ca-nav__corner--r"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            aria-hidden="true"
                        >
                            <path
                                d="M24 24C24 10.7452 13.2548 0 0 0H24V24Z"
                                fill="currentColor"
                            />
                        </svg>

                        <div className="ca-nav__pill">
                            <Link
                                href="/"
                                className="flex items-center gap-2.5"
                                style={{ textDecoration: "none" }}
                            >
                                <CaLogo size={26} />
                                <span
                                    className="ca-serif text-[1.3rem]"
                                    style={{ color: "var(--ca-ink)", lineHeight: 1 }}
                                >
                                    Staglabs
                                </span>
                            </Link>

                            <span className="ca-nav__segment">
                                <RubberSegment
                                    className="ca-segment"
                                    aria-label="Page sections"
                                    items={NAV_LINKS.map((link) => ({
                                        value: link.href.split("#")[1],
                                        label: link.label,
                                    }))}
                                    value={active}
                                    hideThumb={pathname !== "/"}
                                    onChange={handleSectionChange}
                                    trackColor="transparent"
                                    thumbColor="var(--ca-ink)"
                                    textColor="var(--ca-sub)"
                                    activeTextColor="#ffffff"
                                    size="md"
                                    radius={18}
                                    inset={3}
                                    equalSlots={false}
                                />
                            </span>

                            <span className="ca-nav__cta">
                                <CaCta href="/contact" tone="dark">
                                    Start a project
                                </CaCta>
                            </span>

                            <button
                                ref={burgerRef}
                                type="button"
                                className="ca-nav__burger"
                                aria-label="Open menu"
                                aria-expanded={open}
                                aria-controls="ca-mobile-menu"
                                onClick={() => setOpen(true)}
                            >
                                <span />
                                <span />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {open ? (
                <div
                    id="ca-mobile-menu"
                    className="ca-menu"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Menu"
                >
                    <div className="flex items-center justify-between">
                        <Link
                            href="/"
                            className="flex items-center gap-2.5"
                            style={{ textDecoration: "none" }}
                            onClick={() => setOpen(false)}
                        >
                            <CaLogo size={26} tone="white" />
                            <span
                                className="ca-serif text-[1.3rem]"
                                style={{ color: "#ffffff", lineHeight: 1 }}
                            >
                                Staglabs
                            </span>
                        </Link>
                        <button
                            type="button"
                            aria-label="Close menu"
                            onClick={() => {
                                setOpen(false);
                                burgerRef.current?.focus();
                            }}
                            className="cursor-pointer p-3 text-[1.1rem] leading-none"
                            style={{ color: "#ffffff" }}
                        >
                            <CloseMark />
                        </button>
                    </div>

                    <nav className="mt-6 flex flex-col" aria-label="Mobile">
                        {MOBILE_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="ca-menu__link"
                                onClick={() => setOpen(false)}
                            >
                                <span className="ca-dot" aria-hidden="true" />
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="mt-auto pt-10">
                        <CaCta href="/contact" tone="light">
                            Start a project
                        </CaCta>
                    </div>
                </div>
            ) : null}
        </>
    );
}
