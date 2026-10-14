"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GetStartedButton } from "@/components/threeui/shaders/get-started-button/GetStartedButton";
import { CaCta } from "./primitives";

/** Must match the message posted by `lib/threeui-source-loader.js`. */
const CLICK_MESSAGE = "threeui:get-started:click";

/**
 * Hero "Start a project" control: the ThreeUI liquid-chrome Get Started button.
 *
 * The button runs inside a sandboxed iframe (`allow-scripts` only), which cannot
 * navigate this page. The loader adds a one-line click bridge that posts a
 * message here, and this component performs the navigation. A message is only
 * honoured when it comes from this slot's own iframe window, so no other frame
 * on the page can trigger it.
 */
export function HeroStartButton() {
    const router = useRouter();
    const slot = useRef<HTMLDivElement>(null);

    // The vendored wrapper decides it is "ready" from the iframe's onLoad. If
    // the iframe is server-rendered it finishes loading before React hydrates,
    // the handler is attached too late, and the button stays at opacity 0
    // forever. Mounting it on the client means onLoad exists before the iframe
    // does. The slot reserves the size meanwhile, so nothing shifts.
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    useEffect(() => {
        function onMessage(event: MessageEvent) {
            if (event.data?.type !== CLICK_MESSAGE) return;
            const frame = slot.current?.querySelector("iframe");
            if (!frame || event.source !== frame.contentWindow) return;
            router.push("/about");
        }
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [router]);

    return (
        <div ref={slot} className="ca-hero-start">
            {mounted ? (
                <GetStartedButton style={{ background: "transparent" }} />
            ) : null}
            {/* The button needs scripting. Without it, offer a plain link. */}
            <noscript>
                <CaCta href="/about" tone="dark">
                    Start a project
                </CaCta>
            </noscript>
        </div>
    );
}
