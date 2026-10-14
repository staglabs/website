"use client";

import { useEffect } from "react";

/** Blocks that reveal as they scroll into view. */
const TARGETS = ".ca-siv, .ca-grow, .ca-tilt, .ca-split-head";

/**
 * Scroll reveal for the section blocks.
 *
 * The `.ca-siv` / `.ca-grow` / `.ca-tilt` classes have been on these blocks all
 * along, but the CSS behind them keyed off `data-anim="pending"`, which nothing
 * ever set — the system was written, applied, and never switched on. This
 * switches it on.
 *
 * Two properties matter:
 *
 *  - `data-anim="on"` is set here, from JS, and never rendered by the server.
 *    With scripting off, or if hydration throws before this effect runs, the
 *    attribute stays absent, no CSS rule matches, and every block renders
 *    visible. Nothing can be left stranded at opacity 0.
 *  - Reduced motion opts out entirely, so the page never depends on an observer
 *    to become readable.
 */
export function ScrollReveal() {
    useEffect(() => {
        const page = document.querySelector<HTMLElement>(".ca-page");
        if (!page) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        if (!("IntersectionObserver" in window)) return;

        const targets = Array.from(page.querySelectorAll<HTMLElement>(TARGETS));
        if (targets.length === 0) return;

        // Anything already on screen at load is shown straight away, before the
        // page is switched into its hidden state. Without this pass those blocks
        // would be hidden and re-revealed on the next frame — a visible flash on
        // every page load.
        // Cards that share a parent get an incremental delay so a row arrives
        // as a cascade rather than all at once.
        const seen = new Map<Element, number>();
        for (const el of targets) {
            if (!el.matches(".ca-grow")) continue;
            const parent = el.parentElement;
            if (!parent) continue;
            const n = seen.get(parent) ?? 0;
            el.style.setProperty("--stagger", `${Math.min(n, 5) * 90}ms`);
            seen.set(parent, n + 1);
        }

        const fold = window.innerHeight * 0.92;
        const pending: HTMLElement[] = [];

        for (const target of targets) {
            if (target.getBoundingClientRect().top < fold) {
                target.setAttribute("data-anim-in", "");
            } else {
                pending.push(target);
            }
        }

        page.setAttribute("data-anim", "on");

        if (pending.length === 0) {
            return () => {
                page.removeAttribute("data-anim");
            };
        }

        const waiting = new Set<HTMLElement>(pending);

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    // A block the visitor has already scrolled past (a fast
                    // jump or anchor link skips straight over it) is released
                    // too, so nothing is left hidden above the viewport.
                    const passed = entry.boundingClientRect.bottom < 0;
                    if (!entry.isIntersecting && !passed) continue;
                    entry.target.setAttribute("data-anim-in", "");
                    observer.unobserve(entry.target);
                    waiting.delete(entry.target as HTMLElement);
                }
            },
            // Triggers a little before the block is fully in view, so the
            // transition has finished by the time it is being read.
            { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
        );

        for (const target of pending) observer.observe(target);

        // An observer only reports when a block's visibility changes. A block
        // that goes from below the fold to far above it (anchor link, End key,
        // scrollbar drag) never becomes visible, so it would never be reported
        // and would stay hidden. Sweep for those on scroll, once per frame.
        let sweepFrame = 0;
        function sweep() {
            sweepFrame = 0;
            for (const el of waiting) {
                if (el.getBoundingClientRect().bottom < 0) {
                    el.setAttribute("data-anim-in", "");
                    observer.unobserve(el);
                    waiting.delete(el);
                }
            }
            if (waiting.size === 0) window.removeEventListener("scroll", requestSweep);
        }
        function requestSweep() {
            if (!sweepFrame) sweepFrame = requestAnimationFrame(sweep);
        }
        window.addEventListener("scroll", requestSweep, { passive: true });

        return () => {
            window.removeEventListener("scroll", requestSweep);
            if (sweepFrame) cancelAnimationFrame(sweepFrame);
            observer.disconnect();
            page.removeAttribute("data-anim");
        };
    }, []);

    return null;
}
