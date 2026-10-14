/**
 * Pre-loader for the vendored `threeui.css`.
 *
 * The file declares one @font-face, "ThreeUI Fragment Mono", whose src is
 * `./fonts/fragment-mono.woff2`. The registered source bundle ships no assets
 * (`assets: []`), the file is not served upstream (404), and only other ThreeUI
 * components use that face, not the Get Started button. An unresolvable url()
 * fails the whole build, so this removes that one declaration rather than
 * inventing a font file. The rules that name the family keep their
 * `ui-monospace, monospace` fallback.
 *
 * Like `threeui-source-loader.js`, the removal must match exactly once, so a
 * ThreeUI update that moves it fails the build instead of changing silently.
 */
const FACE =
    /@font-face\s*\{\s*font-family:\s*"ThreeUI Fragment Mono";[^}]*fragment-mono\.woff2[^}]*\}\s*/g;

module.exports = function threeuiCssLoader(source) {
    const css = String(source);
    const n = (css.match(FACE) || []).length;
    if (n !== 1) {
        throw new Error(
            `threeui-css-loader: expected exactly 1 Fragment Mono @font-face, found ${n}`,
        );
    }
    return css.replace(FACE, "");
};
