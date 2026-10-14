/**
 * Placement for the travelling mascot and its speech bubble.
 *
 * Pure geometry, no DOM writes, so it can be reasoned about and tested on its
 * own. Everything is in viewport coordinates, measured at the moment of
 * placement, and every box is {l, t, r, b}.
 *
 * The rules, in priority order:
 *   1. HARD: the mascot and the bubble never overlap an "interactive" box
 *      (links, buttons, inputs, the Start button frame, the nav). A candidate
 *      that does is discarded, no matter how nice it would look.
 *   2. HARD: both stay fully inside the viewport, clear of the fixed nav.
 *   3. SOFT: avoid covering readable text (headings and paragraphs).
 *   4. SOFT: prefer to land beside the target, on the side with more room, with
 *      the bubble on the outside so the mascot sits between bubble and target.
 *
 * Fallback tiers: (1) both clear, (2) mascot clear but the bubble is not, so the
 * mascot stays and the bubble is dropped (`degraded`), (3) nothing is clear, so
 * `score` is Infinity and the caller parks the mascot out of the way.
 */
export type Box = { l: number; t: number; r: number; b: number };

export type Placement = {
    mascot: Box;
    bubble: Box;
    /** Which side of the bubble the tail leaves from, towards the mascot. */
    tail: "l" | "r" | "t" | "b";
    /** Where the tail meets the bubble edge, 0..1 along that edge. */
    tailAt: number;
    degraded: boolean;
    score: number;
};

export type Obstacles = {
    /** Must never be covered. */
    hard: Box[];
    /** Should not be covered if avoidable. */
    soft: Box[];
};

export const GAP = 10;

const overlaps = (a: Box, b: Box, pad = 0) =>
    a.l < b.r + pad && a.r > b.l - pad && a.t < b.b + pad && a.b > b.t - pad;

const overlapArea = (a: Box, b: Box) => {
    const w = Math.min(a.r, b.r) - Math.max(a.l, b.l);
    const h = Math.min(a.b, b.b) - Math.max(a.t, b.t);
    return w > 0 && h > 0 ? w * h : 0;
};

export function place(opts: {
    target: Box;
    viewport: { w: number; h: number };
    /** Space reserved at the top for the fixed nav. */
    top: number;
    mascot: number;
    bubble: { w: number; h: number };
    obstacles: Obstacles;
    /**
     * Mascot offset from the target's top-left that was used last time. Candidates
     * near it get a bonus, so the mascot keeps its side while the page scrolls
     * instead of flipping to an equally good one.
     */
    prefer?: { dx: number; dy: number } | null;
    /** Raw target box, for measuring `prefer`. Defaults to `target`. */
    raw?: Box;
}): Placement {
    const { target, viewport: vp, top, mascot: M, bubble: B, obstacles } = opts;
    const raw = opts.raw ?? target;
    const margin = 8;
    const inView = (b: Box) =>
        b.l >= margin && b.r <= vp.w - margin && b.t >= top && b.b <= vp.h - margin;

    const tcx = (target.l + target.r) / 2;
    const tcy = (target.t + target.b) / 2;
    const candidates: Placement[] = [];

    const add = (m: Box, bubble: Box, tail: Placement["tail"], tailAt: number) => {
        candidates.push({
            mascot: m,
            bubble,
            tail,
            tailAt: Math.min(0.88, Math.max(0.12, tailAt)),
            degraded: false,
            score: 0,
        });
    };

    // Mascot positions around the target: left, right, above, below, and the
    // four corners, each tried at a few offsets along the edge.
    const sides: { name: string; m: Box }[] = [];
    const mk = (l: number, t: number): Box => ({ l, t, r: l + M, b: t + M });
    for (const f of [0, 0.5, 1]) {
        const y = target.t + (target.b - target.t - M) * f;
        const x = target.l + (target.r - target.l - M) * f;
        sides.push({ name: "L", m: mk(target.l - GAP - M, y) });
        sides.push({ name: "R", m: mk(target.r + GAP, y) });
        sides.push({ name: "T", m: mk(x, target.t - GAP - M) });
        sides.push({ name: "B", m: mk(x, target.b + GAP) });
    }
    // Inside the target, against its left or right edge. Only used when nothing
    // outside is clear (a full-width card on a phone has no margin beside it),
    // so these carry a heavy penalty and lose to any clean outside position.
    const wide = target.r - target.l > M * 3;
    const inside: { m: Box }[] = [];
    if (wide) {
        for (const f of [0.15, 0.5, 0.85]) {
            const y = target.t + (target.b - target.t - M) * f;
            inside.push({ m: mk(target.r - M - 6, y) }, { m: mk(target.l + 6, y) });
        }
    }
    sides.push(
        { name: "TL", m: mk(target.l - GAP - M, target.t - GAP - M) },
        { name: "TR", m: mk(target.r + GAP, target.t - GAP - M) },
        { name: "BL", m: mk(target.l - GAP - M, target.b + GAP) },
        { name: "BR", m: mk(target.r + GAP, target.b + GAP) },
    );

    const insideSet = new Set(inside.map((i) => i.m));
    const emit = (m: Box) => {
        const mcx = (m.l + m.r) / 2;
        const mcy = (m.t + m.b) / 2;
        // The bubble sits against one of the mascot's four sides and can slide
        // along that side (start, centre or end aligned). Sliding matters: a
        // narrow margin between a list and the viewport edge only fits a bubble
        // that hangs off one end of the mascot.
        for (const al of ["c", "s", "e"] as const) {
            const vy = al === "c" ? mcy - B.h / 2 : al === "s" ? m.t : m.b - B.h;
            const hx = al === "c" ? mcx - B.w / 2 : al === "s" ? m.l : m.r - B.w;
            const sets: [Box, Placement["tail"]][] = [
                [{ l: m.l - GAP - B.w, t: vy, r: m.l - GAP, b: vy + B.h }, "r"],
                [{ l: m.r + GAP, t: vy, r: m.r + GAP + B.w, b: vy + B.h }, "l"],
                [{ l: hx, t: m.t - GAP - B.h, r: hx + B.w, b: m.t - GAP }, "b"],
                [{ l: hx, t: m.b + GAP, r: hx + B.w, b: m.b + GAP + B.h }, "t"],
            ];
            for (const [bub, tail] of sets) {
                // Slide along the axis to stay on screen. Tail points at the mascot.
                if (tail === "b" || tail === "t") {
                    const shift = Math.max(margin - bub.l, 0) - Math.max(bub.r - (vp.w - margin), 0);
                    const bx = { ...bub, l: bub.l + shift, r: bub.r + shift };
                    add(m, bx, tail, (mcx - bx.l) / B.w);
                } else {
                    const shift = Math.max(top - bub.t, 0) - Math.max(bub.b - (vp.h - margin), 0);
                    const bx = { ...bub, t: bub.t + shift, b: bub.b + shift };
                    add(m, bx, tail, (mcy - bx.t) / B.h);
                }
            }
        }
    };
    for (const { m } of [...sides, ...inside]) emit(m);

    const pad = 6;
    let best: Placement | null = null;
    // Tier 2: the mascot is clear but the bubble is not. Show the mascot, drop
    // the bubble.
    let bestMascotOnly: Placement | null = null;
    let bestAny: Placement | null = null;

    for (const c of candidates) {
        const onscreen = inView(c.mascot) && inView(c.bubble);
        const mascotHit = obstacles.hard.some((o) => overlaps(c.mascot, o, pad));
        const bubbleHit = obstacles.hard.some((o) => overlaps(c.bubble, o, pad));
        // bubble and mascot must not overlap each other
        const selfHit = overlaps(c.mascot, c.bubble, 2);

        let score = 0;
        for (const o of obstacles.soft) {
            score += overlapArea(c.mascot, o) * 2 + overlapArea(c.bubble, o);
        }
        // prefer the mascot close to the target, the bubble on the far side
        const mcx = (c.mascot.l + c.mascot.r) / 2;
        const mcy = (c.mascot.t + c.mascot.b) / 2;
        score += Math.hypot(mcx - tcx, mcy - tcy) * 4;
        const bcx = (c.bubble.l + c.bubble.r) / 2;
        const bcy = (c.bubble.t + c.bubble.b) / 2;
        if (Math.hypot(bcx - tcx, bcy - tcy) < Math.hypot(mcx - tcx, mcy - tcy)) score += 800;
        if (opts.prefer) {
            const d = Math.hypot(c.mascot.l - raw.l - opts.prefer.dx, c.mascot.t - raw.t - opts.prefer.dy);
            if (d < 120) score -= 2500 - d * 20;
        }
        if (insideSet.has(c.mascot)) score += 6000;
        c.score = score;

        if (!inView(c.mascot)) continue;
        if (!bestAny || score < bestAny.score) bestAny = c;
        if (mascotHit) continue;
        if (!bubbleHit && onscreen && !selfHit) {
            if (!best || score < best.score) best = c;
        } else if (!bestMascotOnly || score < bestMascotOnly.score) {
            bestMascotOnly = c;
        }
    }

    // Second pass. The ring around the target is where the mascot would like to
    // be, but a full-width card on a phone leaves no margin there and the best
    // ring spot then sits on text. Search the free space nearby instead.
    const POOR = 2500;
    if (!best || best.score > POOR) {
        const before = candidates.length;
        const R = 300;
        const step = 52;
        for (let y = Math.max(top, tcy - R); y <= Math.min(vp.h - M - margin, tcy + R); y += step) {
            for (let x = Math.max(margin, tcx - R); x <= Math.min(vp.w - M - margin, tcx + R); x += step) {
                emit(mk(x, y));
            }
        }
        for (let i = before; i < candidates.length; i++) {
            const c = candidates[i];
            const mascotHit = obstacles.hard.some((o) => overlaps(c.mascot, o, pad));
            const bubbleHit = obstacles.hard.some((o) => overlaps(c.bubble, o, pad));
            const onscreen = inView(c.mascot) && inView(c.bubble);
            const selfHit = overlaps(c.mascot, c.bubble, 2);
            let score = 0;
            for (const o of obstacles.soft) {
                score += overlapArea(c.mascot, o) * 2 + overlapArea(c.bubble, o);
            }
            const mcx = (c.mascot.l + c.mascot.r) / 2;
            const mcy = (c.mascot.t + c.mascot.b) / 2;
            score += Math.hypot(mcx - tcx, mcy - tcy) * 4;
            c.score = score;
            if (mascotHit) continue;
            if (!bubbleHit && onscreen && !selfHit) {
                if (!best || score < best.score) best = c;
            } else if (!bestMascotOnly || score < bestMascotOnly.score) {
                bestMascotOnly = c;
            }
        }
    }

    if (best) return best;
    if (bestMascotOnly) return { ...bestMascotOnly, degraded: true };
    // Last resort: nothing is clear of every interactive box. Flag it so the
    // caller hides the bubble and parks the mascot out of the way.
    return { ...(bestAny ?? candidates[0]), degraded: true, score: Infinity };
}

export const boxOf = (r: DOMRect): Box => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
