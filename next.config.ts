import path from "node:path";
import type { NextConfig } from "next";

const threeuiLoader = path.resolve(__dirname, "lib/threeui-source-loader.js");
const threeuiCssLoader = path.resolve(__dirname, "lib/threeui-css-loader.js");

const nextConfig: NextConfig = {
    // ThreeUI components import their HTML with Vite's `?raw`, and their
    // stylesheet points at a font the bundle does not ship. Both are adapted by
    // strict loaders (see lib/threeui-*-loader.js). Production builds use
    // webpack, `next dev --turbopack` uses the Turbopack rules.
    turbopack: {
        rules: {
            "*.html": { loaders: [threeuiLoader], as: "*.js" },
        },
    },
    webpack(config) {
        config.module.rules.push(
            {
                test: /\.html$/,
                resourceQuery: /raw/,
                use: [{ loader: threeuiLoader }],
                type: "javascript/auto",
            },
            {
                test: /threeui[\\/]shaders[\\/]threeui\.css$/,
                enforce: "pre",
                use: [{ loader: threeuiCssLoader }],
            },
        );
        return config;
    },
};

export default nextConfig;
