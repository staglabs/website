import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
/* Component stylesheets are imported here rather than from the components
   themselves: this project's bundler does not pick up plain CSS imported by a
   client component, so the rules never reached the page. Order matters —
   staglabs.css comes last so its theme overrides win. */
import "@/components/staglabs/particle-text.css";
import "@/components/staglabs/rubber-segment.css";
import "@/components/threeui/shaders/threeui.css";
import "@bible-strong/avatar-react/styles.css";
import "./staglabs.css";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { organizationJsonLd } from "@/lib/jsonld";

const roboto = Roboto({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"],
    variable: "--font-roboto-ca",
    display: "swap",
});

const robotoMono = Roboto_Mono({
    subsets: ["latin"],
    weight: ["400", "500"],
    variable: "--font-robotomono-ca",
    display: "swap",
});

const title = "Staglabs | MVP & Product Development Agency for Startups";
const description =
    "Staglabs builds production-ready MVPs, web apps and internal tools for startups in short, visible cycles. Ship fast without cutting corners.";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: "%s" },
    description,
    icons: {
        icon: [{ url: "/icon.png", type: "image/png" }],
        apple: [{ url: "/icon.png", type: "image/png" }],
    },
    openGraph: {
        title,
        description,
        siteName: SITE_NAME,
        url: SITE_URL,
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title,
        description,
    },
    robots: {
        index: true,
        follow: true,
    },
    category: "technology",
    keywords: [
        "Staglabs",
        "software agency",
        "product engineering",
        "web development",
        "internal tools",
        "MVP development",
        "startup software development",
        "Next.js development",
    ],
    authors: [
        { name: "Chirag", url: "https://chirxg.is-a.dev" },
        { name: "Ishan", url: "https://ishanpatra.com" },
    ],
    creator: "Chirag",
    publisher: "Staglabs",
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd()),
                    }}
                />
                {children}
            </body>
        </html>
    );
}
