/**
 * Source loader for ThreeUI `*.html?raw` imports.
 *
 * The vendored ThreeUI files under `components/threeui/` are kept byte-identical
 * to the registered source (SHA-256 checked). They import their HTML with Vite's
 * `?raw` suffix, which Next does not understand, so this loader turns the file
 * into `export default "<html>"`.
 *
 * It is also the single place where this project adapts the authored HTML. Every
 * edit is an exact-token replacement that must match exactly once: if a ThreeUI
 * update changes the source so a token moves, the build fails loudly instead of
 * silently shipping an unadapted button. Shaders, geometry, motion and pointer
 * behaviour are not touched.
 *
 *   1. body background -> transparent. The authored page is an opaque dark grey
 *      desk. Here the button sits over the hero photograph, so the desk must not
 *      paint a box around it.
 *   2. label "SIGN UP" -> "START", aria-label -> "Start a project". The embedded
 *      Geist Mono subset has only A-Z, space and "o" (lower-case and digits fall
 *      back to another font), and between the pill's left edge and the crystal
 *      there is room for about ten characters at the authored size, so
 *      "START A PROJECT" (15) cannot fit without changing the authored type.
 *   3. size contract. The authored `--u` unit is derived from a 1080px square
 *      stage (`100vw/1080`, `100vh/1080`), which suits a full-page demo but would
 *      shrink the button to a few pixels inside a small slot. It is re-derived
 *      from the frame instead: 826 design units wide (the 706 pill plus ring and
 *      canvas margin) and 780 tall (the 232 pill plus 274 of room above and
 *      below, because the drop shadow reaches about 300 units under the pill and
 *      a frame cannot paint outside its own box). hero-start-button.css keeps
 *      the frame at exactly that 826:780 shape.
 *   4. click bridge. The button lives in a sandboxed iframe that cannot navigate
 *      the parent, and its script never reports a click. This posts one message
 *      to the parent, which owns the navigation (see hero-start-button.tsx).
 */
const SWAPS = [
    [
        "body{margin:0;background:var(--bg);",
        "body{margin:0;background:transparent;",
    ],
    [
        '<button class="cta" type="button" aria-label="Sign up">',
        '<button class="cta" type="button" aria-label="Start a project">',
    ],
    [
        '<span class="label" aria-hidden="true">SIGN UP</span>',
        '<span class="label" aria-hidden="true">START</span>',
    ],
    [
        "--u: min(calc(100vw / 1080), calc(100vh / 1080), 0.62px);",
        "--u: min(calc(100vw / 826), calc(100vh / 780), 1px);",
    ],
    [
        "  const cta = document.querySelector('.cta');\n",
        "  const cta = document.querySelector('.cta');\n" +
            "  cta.addEventListener('click', () => parent.postMessage({ type: 'threeui:get-started:click' }, '*'));\n",
    ],
];

function countOf(haystack, needle) {
    return haystack.split(needle).length - 1;
}

module.exports = function threeuiSourceLoader(source) {
    let html = String(source);

    // Only adapt the Get Started button. Any other .html import passes through.
    if (!html.includes("<title>Sign Up</title>")) {
        return `export default ${JSON.stringify(html)};`;
    }

    for (const [from, to] of SWAPS) {
        const n = countOf(html, from);
        if (n !== 1) {
            throw new Error(
                `threeui-source-loader: expected exactly 1 match, found ${n} for:\n  ${from.slice(0, 80)}`,
            );
        }
        html = html.replace(from, () => to);
    }

    return `export default ${JSON.stringify(html)};`;
};
