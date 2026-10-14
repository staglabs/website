"use client";

import { createAvatar } from "@bible-strong/avatar-react";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import raw from "./cloudee.avatar.json";
import { themeAvatar, type AvatarPalette } from "@/lib/avatar-theme";
import { place, type Box, type Placement } from "./place";
import { EMAIL_STOP, STOPS, type Stop } from "./stops";

/**
 * Cloudee's own body is already a soft light grey (#c9cbcf), within a few levels
 * of the chrome grey the site settled on, so the body is kept as authored. Only
 * the two expression tints that the studio paints red and pale blue are brought
 * into the monochrome palette, the same rule used for the avatar before it.
 */
const PALETTE: AvatarPalette = {
    body: "#c9cbcf",
    eyes: "#111316",
    bodyAngry: "#7c7c82",
    bodyUneasy: "#e6e6ea",
};

type Mood = keyof typeof raw.animations;
const FALLBACK: Mood = "idle";
const CLICK: Mood = "laughing";
const CLICK_MS = 2400;

/** Anything the mascot or its bubble must never sit on top of. */
const HARD_SELECTOR = [
    "a[href]",
    "button",
    "input",
    "textarea",
    "select",
    "label",
    "summary",
    "[role='button']",
    ".ca-hero-start",
    // The Start button's frame is taller than the pill (room for its shadow) and
    // takes pointer events across all of it.
    "iframe",
    ".ca-nav",
    ".ca-acta",
].join(",");

/** Text the mascot should avoid when it can. */
const SOFT_SELECTOR = "h1,h2,h3,h4,p,blockquote,li,.ca-label,.ca-pill";

const NAV_CLEAR = 96;

/**
 * An element's box at rest. Blocks that reveal on scroll slide up about a rem
 * as they arrive, and a rect read mid-slide is where the block is, not where it
 * will be. Placing against that put the mascot on a row that then settled into
 * it. The slide is a translateY on the revealing ancestor, so it is subtracted.
 */
function restBox(el: Element, r: DOMRect = el.getBoundingClientRect()): Box {
    const reveal = el.closest(".ca-siv, .ca-grow");
    let dy = 0;
    if (reveal) {
        const t = getComputedStyle(reveal).transform;
        if (t && t !== "none") dy = new DOMMatrixReadOnly(t).f;
    }
    return { l: r.left, r: r.right, t: r.top - dy, b: r.bottom - dy };
}

function pageKind(path: string): Stop["on"] {
    if (path === "/") return "home";
    if (/^\/about\/[^/]+/.test(path)) return "profile";
    if (path.startsWith("/about")) return "about";
    return "notfound";
}

type Active = {
    stop: Stop;
    el: HTMLElement;
};

export function Mascot() {
    const Avatar = useMemo(() => createAvatar(themeAvatar(raw, PALETTE)), []);
    const pathname = usePathname();

    const hostRef = useRef<HTMLDivElement>(null);
    const bubbleRef = useRef<HTMLDivElement>(null);
    const [active, setActive] = useState<Active | null>(null);
    const [hover, setHover] = useState(false);
    const [clicked, setClicked] = useState(false);
    const [flying, setFlying] = useState(false);
    const [bubbleVisible, setBubbleVisible] = useState(false);
    const [tail, setTail] = useState<Placement["tail"]>("l");
    const [phone, setPhone] = useState(false);
    const [hidden, setHidden] = useState(false);
    const requestRef = useRef<() => void>(() => {});
    const clickTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    // ------------------------------------------------------------- stop list
    const stops = useMemo(() => {
        const kind = pageKind(pathname);
        return [...STOPS, EMAIL_STOP].filter((s) => (s.on ?? "home") === kind || s.id === "email");
    }, [pathname]);

    // The animation shown: a click or hover beats the stop's own mood.
    const mood: Mood = clicked
        ? CLICK
        : hover
          ? "surprised"
          : ((active?.stop.mood as Mood) ?? FALLBACK);

    // ----------------------------------------------------------- the engine
    const state = useRef({
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        tx: 0,
        ty: 0,
        placed: false,
        stopId: "",
        prefer: null as { dx: number; dy: number } | null,
        raf: 0,
        last: 0,
        reduce: false,
    });

    useEffect(() => {
        const st = state.current;
        const host = hostRef.current;
        if (!host) return;
        st.reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const mq = window.matchMedia("(max-width: 640px)");
        const onMq = () => setPhone(mq.matches);
        onMq();
        mq.addEventListener("change", onMq);

        let frame = 0;
        let resolved: Active | null = null;
        let flightTimer: ReturnType<typeof setTimeout> | undefined;

        const size = () => {
            const w = window.innerWidth;
            return w < 640 ? 44 : w < 1024 ? 52 : 64;
        };

        // A stop matches EVERY element its selector finds (all FAQ questions,
        // all cards in a section), so the mascot keeps pace down a list instead
        // of letting go of it when the first item scrolls away.
        type Group = { stop: Stop; els: HTMLElement[] };
        const resolveStops = (): Group[] => {
            const out: Group[] = [];
            for (const s of stops) {
                const els = Array.from(document.querySelectorAll<HTMLElement>(s.target));
                if (els.length) out.push({ stop: s, els });
            }
            return out;
        };
        let list = resolveStops();

        const pick = (): Active | null => {
            // The target closest to the middle of the viewport, among those
            // actually on screen.
            const mid = window.innerHeight * 0.5;
            let best: Active | null = null;
            let bestD = Infinity;
            for (const g of list) {
                for (const el of g.els) {
                    const r = restBox(el);
                    if (r.b - r.t === 0) continue;
                    if (r.b < NAV_CLEAR || r.t > window.innerHeight) continue;
                    const d = Math.abs((r.t + r.b) / 2 - mid);
                    if (d < bestD) {
                        bestD = d;
                        best = { stop: g.stop, el };
                    }
                }
            }
            return best;
        };

        const obstacles = (target: HTMLElement) => {
            const hard: Box[] = [];
            const soft: Box[] = [];
            const vh = window.innerHeight;
            document.querySelectorAll<HTMLElement>(HARD_SELECTOR).forEach((e) => {
                if (host.contains(e)) return;
                const dr = e.getBoundingClientRect();
                if (dr.width === 0 || dr.height === 0) return;
                let r = restBox(e, dr);
                // The Start button lives in a frame far taller than the button
                // (room for its shadow). Only the button, plus its ring, takes
                // clicks, so that is what must stay clear. Design units: the
                // frame is 826 x 780 and the pill with ring spans x 33-793,
                // y 247-533.
                if (e.tagName === "IFRAME" && e.closest(".ca-hero-start")) {
                    const w = r.r - r.l;
                    const h = r.b - r.t;
                    r = {
                        l: r.l + (33 / 826) * w,
                        r: r.l + (793 / 826) * w,
                        t: r.t + (247 / 780) * h,
                        b: r.t + (533 / 780) * h,
                    };
                }
                if (r.b < -40 || r.t > vh + 40) return;
                hard.push(r);
            });
            document.querySelectorAll<HTMLElement>(SOFT_SELECTOR).forEach((e) => {
                if (host.contains(e) || e.closest(HARD_SELECTOR)) return;
                const dr = e.getBoundingClientRect();
                if (dr.width === 0 || dr.height === 0) return;
                // measure the text itself, not a full-width block around it
                const rg = document.createRange();
                rg.selectNodeContents(e);
                const tr = rg.getBoundingClientRect();
                const r = restBox(e, tr.width && tr.height ? tr : dr);
                if (r.b < 0 || r.t > vh) return;
                soft.push(r);
            });
            void target;
            return { hard, soft };
        };

        // Bubble size comes from layout (offsetWidth/Height), never from
        // getBoundingClientRect: the bubble pops in with a scale transform, and
        // a transformed rect is smaller mid-animation. Measuring that fed a
        // shrunken size back into the solver, which shrank it again on the next
        // pass until nothing fitted. The width is also set from the viewport
        // each time, never from the previous measurement.
        const measureBubble = (width: number) => {
            const b = bubbleRef.current;
            if (!b) return { w: width, h: 70 };
            b.style.width = `${width}px`;
            return { w: width, h: b.offsetHeight || 70 };
        };

        const apply = (landed: boolean) => {
            host.style.transform = `translate3d(${st.x}px, ${st.y}px, 0)`;
            const b = bubbleRef.current;
            if (b && landed) b.dataset.landed = "1";
        };

        const solve = (a: Active, force = false) => {
            const M = size();
            const raw: Box = restBox(a.el);
            const isPhone = window.innerWidth < 640;
            // a tall target (a card, an aside) is represented by its visible part,
            // so the mascot lands beside what is on screen, not off-screen
            const vh = window.innerHeight;
            const t: Box = {
                l: raw.l,
                r: raw.r,
                t: Math.max(raw.t, NAV_CLEAR),
                b: Math.min(raw.b, vh - 8),
            };
            if (t.b - t.t < 24) {
                t.t = Math.min(Math.max(raw.t, NAV_CLEAR), vh - 40);
                t.b = t.t + 24;
            }
            const bw = Math.min(isPhone ? 208 : 244, window.innerWidth - 24);
            const bubble = measureBubble(bw);
            const p = place({
                target: t,
                raw,
                viewport: { w: window.innerWidth, h: vh },
                top: NAV_CLEAR,
                mascot: M,
                bubble,
                obstacles: obstacles(a.el),
                prefer: st.stopId === a.stop.id ? st.prefer : null,
            });
            st.prefer = { dx: p.mascot.l - raw.l, dy: p.mascot.t - raw.t };
            st.tx = p.mascot.l;
            st.ty = p.mascot.t;
            setTail(p.tail);
            const b = bubbleRef.current;
            if (b) {
                b.style.setProperty("--tail-at", `${(p.tailAt * 100).toFixed(1)}%`);
                // bubble is positioned relative to the mascot
                const bx = p.bubble.l - p.mascot.l;
                const by = p.bubble.t - p.mascot.t;
                b.style.transform = `translate3d(${bx}px, ${by}px, 0)`;
            }
            // a bubble that would cover something is not shown
            setBubbleVisible(!p.degraded);
            if (!st.placed || force) {
                // first placement: appear at the spot, no flight from (0,0)
                st.x = st.tx;
                st.y = st.ty;
                st.vx = st.vy = 0;
                st.placed = true;
                apply(true);
            }
            if (p.score === Infinity) {
                // Nowhere is clear of every link and button. A corner is not
                // known to be clear either, so the only safe move is to hide.
                setHidden(true);
                setBubbleVisible(false);
            } else {
                setHidden(false);
            }
            host.style.width = host.style.height = `${M}px`;
        };

        // spring toward (tx, ty). Underdamped enough to feel alive, stiff enough
        // to settle in well under a second.
        const K = 170;
        const C = 24;
        const tick = (now: number) => {
            st.raf = 0;
            const dt = Math.min(0.032, (now - (st.last || now)) / 1000);
            st.last = now;
            if (st.reduce) {
                st.x = st.tx;
                st.y = st.ty;
                st.vx = st.vy = 0;
            } else {
                st.vx += (K * (st.tx - st.x) - C * st.vx) * dt;
                st.vy += (K * (st.ty - st.y) - C * st.vy) * dt;
                st.x += st.vx * dt;
                st.y += st.vy * dt;
            }
            apply(false);
            const dist = Math.hypot(st.tx - st.x, st.ty - st.y);
            const speed = Math.hypot(st.vx, st.vy);
            // Landed means close to the spot, not motionless: while the page is
            // still scrolling the spot itself keeps moving and the mascot trails
            // it by design, so waiting for zero speed would never end.
            if (dist < 20) setFlying(false);
            if (dist > 0.4 || speed > 6) {
                st.raf = requestAnimationFrame(tick);
            } else {
                st.x = st.tx;
                st.y = st.ty;
                apply(true);
                setFlying(false);
            }
        };
        const kick = () => {
            // Start the clock only when the loop is not already running. Resetting
            // it on every scroll event made each tick see dt = 0, so the spring
            // never advanced while the page was scrolling.
            if (st.raf) return;
            st.last = 0;
            st.raf = requestAnimationFrame(tick);
        };

        const update = () => {
            frame = 0;
            const next = pick();
            if (!next) {
                // Nothing on screen to land beside. Fade out rather than sit
                // over whatever scrolls underneath, and reappear in place.
                setHidden(true);
                setBubbleVisible(false);
                st.placed = false;
                resolved = null;
                return;
            }
            setHidden(false);
            const changed = !resolved || resolved.stop.id !== next.stop.id;
            resolved = next;
            if (changed) {
                st.stopId = next.stop.id;
                st.prefer = null;
                setActive(next);
                if (st.placed && !st.reduce) {
                    setFlying(true);
                    clearTimeout(flightTimer);
                    flightTimer = setTimeout(() => setFlying(false), 1600);
                }
            }
            solve(next, !st.placed);
            kick();
        };
        const request = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        requestRef.current = request;

        const onResize = () => {
            list = resolveStops();
            st.placed = false;
            request();
        };

        list = resolveStops();
        request();
        window.addEventListener("scroll", request, { passive: true });
        window.addEventListener("resize", onResize);
        // Content that appears late (fonts, lazy images, accordions) moves
        // targets without a scroll, so re-solve on layout changes too.
        const ro = new ResizeObserver(request);
        ro.observe(document.body);
        // the bubble text arrives after the first render
        const t1 = setTimeout(request, 120);

        return () => {
            window.removeEventListener("scroll", request);
            window.removeEventListener("resize", onResize);
            mq.removeEventListener("change", onMq);
            ro.disconnect();
            clearTimeout(t1);
            clearTimeout(flightTimer);
            if (frame) cancelAnimationFrame(frame);
            if (st.raf) cancelAnimationFrame(st.raf);
            st.placed = false;
        };
    }, [stops]);

    // Re-solve once the bubble holds the new line, so it is measured at its real
    // height. This must NOT reset placement: doing so makes the mascot teleport
    // instead of flying to the new stop.
    useLayoutEffect(() => {
        requestRef.current();
    }, [active?.stop.id, phone]);

    useEffect(() => () => clearTimeout(clickTimer.current), []);

    function onClick() {
        setClicked(true);
        clearTimeout(clickTimer.current);
        clickTimer.current = setTimeout(() => setClicked(false), CLICK_MS);
    }

    const line = active?.stop.line ?? "";
    const show = bubbleVisible && !flying && !hidden && !!active;

    return (
        // The mascot is decoration. The speech bubble is text, so it is a live
        // status region only when it changes, politely. Neither takes the tab
        // order and neither captures pointer events except the mascot itself.
        <div className="ca-roam" aria-hidden="false">
            <div
                ref={hostRef}
                className="ca-roam__mascot"
                data-flying={flying ? "1" : "0"}
                data-animation={mood}
                data-stop={active?.stop.id ?? ""}
                data-hidden={hidden ? "1" : "0"}
                aria-hidden="true"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
                onPointerLeave={() => setHover(false)}
                onClick={onClick}
            >
                <div className="ca-roam__body">
                    <Avatar animation={mood} size="100%" ariaLabel="" />
                </div>
                <div
                    ref={bubbleRef}
                    className="ca-roam__bubble"
                    data-show={show ? "1" : "0"}
                    data-tail={tail}
                    role="presentation"
                >
                    <span className="ca-roam__tag">CLOUDEE</span>
                    <p>{line}</p>
                </div>
            </div>
            <p className="sr-only" role="status" aria-live="polite">
                {show ? line : ""}
            </p>
        </div>
    );
}
