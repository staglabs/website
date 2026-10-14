"use client";

import { createAvatar } from "@bible-strong/avatar-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import raw from "./strobi.avatar.json";
import { themeAvatar, type AvatarPalette } from "@/lib/avatar-theme";

/**
 * Chrome grey, to sit with the metal Start button. Chosen by rendering four
 * monochrome candidates on white, ink and mid-grey: ink vanished into the dark
 * bands, silver and chrome read on all three, and chrome keeps its angry and
 * uneasy tints distinct from the body.
 */
const PALETTE: AvatarPalette = {
    body: "#c4c4c9",
    eyes: "#1d1d1d",
    bodyAngry: "#7c7c82",
    bodyUneasy: "#e6e6ea",
};

type Mood = keyof typeof raw.animations;

const FALLBACK: Mood = "idle";
const HOVER: Mood = "surprised";
const CLICK: Mood = "laughing";
const CLICK_MS = 2600;

export function Mascot() {
    const Strobi = useMemo(() => createAvatar(themeAvatar(raw, PALETTE)), []);
    const pathname = usePathname();
    const [mood, setMood] = useState<Mood>(FALLBACK);
    const [hover, setHover] = useState(false);
    const [clicked, setClicked] = useState(false);
    const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // The section under the middle of the viewport sets the mood, the same band
    // the nav uses for its marker.
    useEffect(() => {
        const sections = Array.from(
            document.querySelectorAll<HTMLElement>("[data-mood]"),
        );
        if (sections.length === 0) {
            setMood(FALLBACK);
            return;
        }
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const next = (entry.target as HTMLElement).dataset.mood as Mood;
                    if (next in raw.animations) setMood(next);
                }
            },
            { rootMargin: "-45% 0px -50% 0px" },
        );
        sections.forEach((s) => observer.observe(s));
        return () => observer.disconnect();
    }, [pathname]);

    useEffect(() => () => clearTimeout(clickTimer.current), []);

    function onClick() {
        setClicked(true);
        clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => setClicked(false), CLICK_MS);
    }

    const animation: Mood = clicked ? CLICK : hover ? HOVER : mood;

    return (
        // Decorative: it duplicates nothing a screen reader needs, and it has no
        // keyboard action, so it is hidden from assistive tech and the tab order.
        <div
            className="ca-mascot"
            data-animation={animation}
            aria-hidden="true"
            onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
            onPointerLeave={() => setHover(false)}
            onClick={onClick}
        >
            <Strobi animation={animation} size="100%" ariaLabel="" />
        </div>
    );
}
