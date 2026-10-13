/**
 * Inline SVG icons. Text glyphs such as arrows and check marks depend on font
 * fallback and render as empty boxes on systems without a symbol font, so the
 * interface never relies on them.
 */
type IconProps = { size?: number; className?: string };

const base = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
};

export function ArrowUpRight({ size = 12, className }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" className={className} {...base}>
            <path d="M3 9 9 3M4 3h5v5" />
        </svg>
    );
}

export function CheckMark({ size = 12, className }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 12 12" className={className} {...base} strokeWidth={1.8}>
            <path d="m2.5 6.3 2.4 2.4 4.6-5" />
        </svg>
    );
}

export function CloseMark({ size = 16, className }: IconProps) {
    return (
        <svg width={size} height={size} viewBox="0 0 16 16" className={className} {...base}>
            <path d="m3.5 3.5 9 9m0-9-9 9" />
        </svg>
    );
}
