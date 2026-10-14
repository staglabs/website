import type { AvatarDefinition } from "@bible-strong/avatar-core";

/**
 * Recolours an avatar definition. Geometry, expressions, animations and
 * timings are never touched: the only fields written are colour values.
 */
export type AvatarPalette = {
    body: `#${string}`;
    eyes: `#${string}`;
    /** Body colour for the avatar's "angry" expression (the sample uses red). */
    bodyAngry: `#${string}`;
    /** Body colour for its "uneasy" expression (the sample uses pale blue). */
    bodyUneasy: `#${string}`;
};

export function themeAvatar<T extends object>(source: T, palette: AvatarPalette): T {
    const def = structuredClone(source) as unknown as AvatarDefinition;
    def.colors = { body: palette.body, eyes: palette.eyes };
    for (const [key, expression] of Object.entries(def.expressions)) {
        const c = expression.colors;
        if (!c) continue;
        if (c.body) c.body = key.startsWith("angry") ? palette.bodyAngry : palette.bodyUneasy;
        if (c.eyes) c.eyes = palette.eyes;
    }
    return def as unknown as T;
}
