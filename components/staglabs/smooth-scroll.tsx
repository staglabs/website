"use client";

import Lenis from "lenis";
import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

const LenisContext = createContext<Lenis | null>(null);

/** Access the live Lenis instance, or null when smooth scrolling is off. */
export function useLenis() {
    return useContext(LenisContext);
}

/** Height of the floating nav pill plus breathing room. */
const ANCHOR_OFFSET = -96;

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Lenis-driven smooth scrolling.
 *
 * Degrades to native scrolling when the user asks for reduced motion, when the
 * library is unavailable, or before hydration — the page is always scrollable,
 * Lenis only changes how the wheel is damped.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
    const [lenis, setLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        if (prefersReducedMotion()) return;

        const instance = new Lenis({
            duration: 1.1,
            easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.6,
        });

        setLenis(instance);

        // Drive the loop explicitly rather than relying on `autoRaf`, so the
        // animation always advances regardless of how the instance is created.
        let frame = 0;
        function raf(time: number) {
            instance.raf(time);
            frame = requestAnimationFrame(raf);
        }
        frame = requestAnimationFrame(raf);

        // Route same-page anchor clicks through Lenis so the fixed nav pill
        // never covers the heading being scrolled to.
        //
        // Capture phase, and we stop propagation: Next's <Link> handles clicks
        // on the root container and calls preventDefault for client-side
        // navigation, which would otherwise jump the hash natively and skip
        // Lenis entirely.
        function onAnchorClick(event: MouseEvent) {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

            const anchor = (event.target as HTMLElement | null)?.closest?.(
                'a[href*="#"]',
            ) as HTMLAnchorElement | null;
            if (!anchor) return;

            const url = new URL(anchor.href, window.location.href);
            if (url.pathname !== window.location.pathname) return;
            if (!url.hash || url.hash === "#") return;

            const target = document.querySelector(url.hash);
            if (!target) return;

            event.preventDefault();
            event.stopPropagation();

            instance.scrollTo(target as HTMLElement, { offset: ANCHOR_OFFSET });

            // Keep the URL and history in step with a normal anchor jump.
            window.history.pushState(null, "", url.hash);
        }

        document.addEventListener("click", onAnchorClick, true);

        return () => {
            document.removeEventListener("click", onAnchorClick, true);
            cancelAnimationFrame(frame);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
