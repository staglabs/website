"use client";

import { useEffect } from "react";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Scroll-linked motion.
 *
 * One passive scroll listener, batched to a single requestAnimationFrame per
 * frame, writes CSS custom properties. Every visual rule lives in
 * `staglabs.css`, so this file only measures. It touches nothing while an
 * element is off screen.
 *
 *  - `--bp`  on each cover band (`.ca-pc__inner`): 0 as it enters at the bottom
 *            of the viewport, 1 as it leaves at the top. Drives the photo drift.
 *  - `--hp`  on the hero: 0 at the top of the page, 1 once it has scrolled away.
 *  - `--cp`  on each tilted feed card's band, mapped to the card's own
 *            translate and rotation so the cards travel as the page moves.
 *  - `--sp`  on `<html>`: whole-page progress for the top progress bar.
 *
 * Reduced motion opts out entirely. Nothing here is required for content to be
 * visible, so with scripting off the page simply renders static.
 */
export function ScrollMotion() {
    useEffect(() => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const root = document.documentElement;
        const page = document.querySelector<HTMLElement>(".ca-page");
        if (!page) return;

        const bands = Array.from(page.querySelectorAll<HTMLElement>(".ca-pc__inner"));
        const hero = page.querySelector<HTMLElement>("header#top");
        const tiltBands = bands.filter((b) => b.querySelector(".ca-tilt"));

        let frame = 0;

        function update() {
            frame = 0;
            const vh = window.innerHeight;

            const doc = document.documentElement;
            const max = doc.scrollHeight - vh;
            root.style.setProperty("--sp", String(max > 0 ? clamp(window.scrollY / max, 0, 1) : 0));

            for (const band of bands) {
                const r = band.getBoundingClientRect();
                if (r.bottom < -vh * 0.25 || r.top > vh * 1.25) continue;
                const p = clamp((vh - r.top) / (vh + r.height), 0, 1);
                band.style.setProperty("--bp", p.toFixed(4));
            }

            if (hero) {
                const r = hero.getBoundingClientRect();
                const p = clamp(-r.top / Math.max(1, r.height * 0.75), 0, 1);
                hero.style.setProperty("--hp", p.toFixed(4));
            }

            for (const band of tiltBands) {
                const r = band.getBoundingClientRect();
                if (r.bottom < -vh * 0.25 || r.top > vh * 1.25) continue;
                // -1 when the band's centre is a full viewport below the
                // viewport centre, +1 when it is a full viewport above.
                const centre = r.top + r.height / 2;
                const cp = clamp((vh / 2 - centre) / vh, -1, 1);
                band.style.setProperty("--cp", cp.toFixed(4));
            }
        }

        function request() {
            if (!frame) frame = requestAnimationFrame(update);
        }

        page.setAttribute("data-scroll-motion", "on");
        update();
        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", request);

        return () => {
            window.removeEventListener("scroll", request);
            window.removeEventListener("resize", request);
            if (frame) cancelAnimationFrame(frame);
            page.removeAttribute("data-scroll-motion");
            root.style.removeProperty("--sp");
        };
    }, []);

    return null;
}
