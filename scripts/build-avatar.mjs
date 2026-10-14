#!/usr/bin/env node
/**
 * Builds a published `*.avatar.json` for one avatar in the Bible Strong Avatar
 * Studio's default document.
 *
 * The studio keeps ONE shared behaviour library (27 expressions, 23 animations)
 * and gives each avatar only its own body, colours and neutral eyes. An export
 * combines them. This is a direct port of `createAvatarDefinition` and
 * `applyAvatarEyeDefaults` from the lab repo (src/features/avatar), nothing
 * invented: an expression's eye values are RELATIVE, so each is shifted by how
 * far this avatar's eyes sit from the studio defaults.
 *
 * Correctness is established by regeneration: running this for "Strobi" must
 * reproduce the published `strobi.avatar.json` exactly. See `--check`.
 *
 *   node scripts/build-avatar.mjs <studio.json> <AvatarName> [out.json]
 *   node scripts/build-avatar.mjs <studio.json> Strobi --check <published.json>
 */
import { readFileSync, writeFileSync } from "node:fs";

// presets.ts defaultExpression
const DEFAULT_EXPRESSION = {
    id: "expression-neutral",
    headX: 0, headY: 0, headZ: 0,
    widthLeft: 20, widthRight: 20, heightLeft: 50, heightRight: 50, spacing: 35,
    positionXLeft: 0, positionXRight: 0, positionYLeft: -7, positionYRight: -7,
    leftAngle: 0, rightAngle: 0, perspective: 1, eyeMotion: "none", bodyMotion: "none",
};
const NEUTRAL_ID = DEFAULT_EXPRESSION.id;

// avatars.ts defaultAvatarEyes: the same eleven fields the studio stores per avatar
const DEFAULT_EYES = {
    widthLeft: 20, widthRight: 20, heightLeft: 50, heightRight: 50, spacing: 35,
    positionXLeft: 0, positionXRight: 0, positionYLeft: -7, positionYRight: -7,
    leftAngle: 0, rightAngle: 0,
};
const EYE_FIELDS = Object.keys(DEFAULT_EYES);

function applyAvatarEyeDefaults(expression, eyes) {
    const result = { ...expression };
    for (const f of EYE_FIELDS) result[f] = expression[f] + eyes[f] - DEFAULT_EYES[f];
    result.widthLeft = Math.max(10, result.widthLeft);
    result.widthRight = Math.max(10, result.widthRight);
    result.heightLeft = Math.max(10, result.heightLeft);
    result.heightRight = Math.max(10, result.heightRight);
    return result;
}

const mapSurface = (s) => ({
    type: s.type, width: s.width, height: s.height, depth: s.depth, roundness: s.roundness,
    ...(s.morphRoundness === undefined ? {} : { morphRoundness: s.morphRoundness }),
    ...(s.tipRoundness === undefined ? {} : { tipRoundness: s.tipRoundness }),
    ...(s.baseRoundness === undefined ? {} : { baseRoundness: s.baseRoundness }),
});

const mapExpression = (e) => ({
    head: { x: e.headX, y: e.headY, z: e.headZ },
    eyes: {
        left: { width: e.widthLeft, height: e.heightLeft, x: e.positionXLeft, y: e.positionYLeft, angle: e.leftAngle },
        right: { width: e.widthRight, height: e.heightRight, x: e.positionXRight, y: e.positionYRight, angle: e.rightAngle },
        spacing: e.spacing,
    },
    perspective: e.perspective,
    motion: { eyes: e.eyeMotion, body: e.bodyMotion },
    ...(e.bodyColor || e.eyeColor
        ? { colors: { ...(e.bodyColor ? { body: e.bodyColor } : {}), ...(e.eyeColor ? { eyes: e.eyeColor } : {}) } }
        : {}),
});

export function buildDefinition(studio, avatarName) {
    const avatar = studio.library.avatars.find((a) => a.name === avatarName);
    if (!avatar) throw new Error(`No avatar named "${avatarName}" in the studio document`);
    const behavior = { expressions: studio.expressions, sequences: studio.sequences };

    const keyById = new Map();
    for (const e of behavior.expressions) keyById.set(e.id, e.semanticKey);
    for (const seq of behavior.sequences)
        for (const step of seq.steps)
            if (step.expressionId !== NEUTRAL_ID && !keyById.has(step.expressionId))
                throw new Error(`Animation "${seq.semanticKey}" references unknown expression ${step.expressionId}`);

    const expressions = { neutral: mapExpression(applyAvatarEyeDefaults(DEFAULT_EXPRESSION, avatar.eyes)) };
    for (const e of behavior.expressions) expressions[e.semanticKey] = mapExpression(applyAvatarEyeDefaults(e, avatar.eyes));

    const animations = Object.fromEntries(
        behavior.sequences.map((seq) => [
            seq.semanticKey,
            {
                playbackMode: seq.playbackMode,
                steps: seq.steps.map((st) => ({
                    expression: st.expressionId === NEUTRAL_ID ? "neutral" : keyById.get(st.expressionId),
                    holdMs: st.holdMs, transitionMs: st.transitionMs, transition: st.transition,
                })),
                blink: { ...seq.blink },
                metadata: { label: seq.name, description: seq.description, group: seq.group },
            },
        ]),
    );

    return {
        schema: "bible-strong/avatar-definition",
        schemaVersion: 1,
        ...(avatar.name ? { name: avatar.name } : {}),
        body: {
            primary: mapSurface(avatar.body.primary),
            nodes: avatar.body.nodes.map((n) => ({ surface: mapSurface(n.surface), position: [...n.position], rotation: [...n.rotation] })),
        },
        colors: { body: avatar.colors.body, eyes: avatar.colors.eyes },
        expressions,
        expressionOrder: ["neutral", ...behavior.expressions.map((e) => e.semanticKey)],
        animations,
        animationOrder: behavior.sequences.map((s) => s.semanticKey),
    };
}

// ------------------------------------------------------------------------- CLI
const [, , studioPath, name, ...rest] = process.argv;
if (studioPath && name) {
    const studio = JSON.parse(readFileSync(studioPath, "utf8"));
    const def = buildDefinition(studio, name);
    if (rest[0] === "--check") {
        const published = JSON.parse(readFileSync(rest[1], "utf8"));
        const a = JSON.stringify(def), b = JSON.stringify(published);
        // compare numbers with a tolerance of 1e-9: the published file went through
        // a different float serialiser, so 42.377734374999996 can read 42.37773437499999
        const walk = (x, y, path, diffs) => {
            if (typeof x === "number" && typeof y === "number") { if (Math.abs(x - y) > 1e-9) diffs.push(`${path}: ${x} vs ${y}`); return; }
            if (x && y && typeof x === "object" && typeof y === "object") {
                const keys = new Set([...Object.keys(x), ...Object.keys(y)]);
                for (const k of keys) {
                    if (!(k in x)) diffs.push(`${path}/${k}: missing in generated`);
                    else if (!(k in y)) diffs.push(`${path}/${k}: missing in published`);
                    else walk(x[k], y[k], `${path}/${k}`, diffs);
                }
                return;
            }
            if (x !== y) diffs.push(`${path}: ${JSON.stringify(x)} vs ${JSON.stringify(y)}`);
        };
        const diffs = [];
        walk(def, published, "", diffs);
        console.log(`exact-string identical: ${a === b}`);
        console.log(`structural diffs (tolerance 1e-9): ${diffs.length}`);
        diffs.slice(0, 10).forEach((d) => console.log("  " + d));
        console.log(`expressions ${Object.keys(def.expressions).length} vs ${Object.keys(published.expressions).length}, animations ${Object.keys(def.animations).length} vs ${Object.keys(published.animations).length}`);
        process.exit(diffs.length ? 1 : 0);
    } else if (rest[0]) {
        writeFileSync(rest[0], JSON.stringify(def, null, 2) + "\n");
        console.log(`wrote ${rest[0]} (${JSON.stringify(def).length} bytes)`);
    } else {
        process.stdout.write(JSON.stringify(def, null, 2) + "\n");
    }
}
