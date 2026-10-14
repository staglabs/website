"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

/**
 * The mascot is decorative, but the avatar library validates its JSON in the
 * browser with a full schema validator, about 190 KB of script. Loading it with
 * the page costs main-thread time while the visitor is still waiting for the
 * page. So it waits: it is fetched on the visitor's first scroll, pointer move,
 * touch or key press, and failing any of those, a few seconds after load.
 * Nothing about the page depends on it.
 */
const Mascot = dynamic(() => import("./mascot").then((m) => m.Mascot), {
    ssr: false,
});

const FALLBACK_MS = 6000;
const EVENTS = ["scroll", "pointermove", "touchstart", "keydown"] as const;

export function MascotLoader() {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        let done = false;
        let timer: ReturnType<typeof setTimeout> | undefined;

        const go = () => {
            if (done) return;
            done = true;
            cleanup();
            setReady(true);
        };
        const cleanup = () => {
            for (const e of EVENTS) window.removeEventListener(e, go);
            clearTimeout(timer);
        };

        for (const e of EVENTS) window.addEventListener(e, go, { passive: true, once: true });
        const arm = () => {
            timer = setTimeout(go, FALLBACK_MS);
        };
        if (document.readyState === "complete") arm();
        else window.addEventListener("load", arm, { once: true });

        return () => {
            done = true;
            cleanup();
            window.removeEventListener("load", arm);
        };
    }, []);

    return ready ? <Mascot /> : null;
}
