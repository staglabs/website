import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __dirname = dirname(fileURLToPath(import.meta.url));
const compat = new FlatCompat({ baseDirectory: __dirname });

const config = [
    { ignores: [".next/**", "node_modules/**", "next-env.d.ts"] },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        rules: {
            // Cover imagery ships as pre-optimised AVIF and is sized by CSS
            // (`.ca-fill img`), so next/image would add a loader without
            // improving delivery.
            "@next/next/no-img-element": "off",
        },
    },
];

export default config;
