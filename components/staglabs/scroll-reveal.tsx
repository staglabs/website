"use client";

import { useEffect } from "react";

/** Blocks that reveal as they scroll into view. */
const TARGETS = ".ca-siv, .ca-grow, .ca-tilt";

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

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    entry.target.setAttribute("data-anim-in", "");
                    observer.unobserve(entry.target);
                }
            },
            // Triggers a little before the block is fully in view, so the
            // transition has finished by the time it is being read.
            { rootMargin: "0px 0px -10% 0px", threshold: 0.01 },
        );

        for (const target of pending) observer.observe(target);

        return () => {
            observer.disconnect();
            page.removeAttribute("data-anim");
        };
    }, []);

    return null;
}
