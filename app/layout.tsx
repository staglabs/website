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

const title = "Staglabs — Software agency built for short runways";
const description =
    "Staglabs is a software agency built for short runways. We build production software in tight, visible increments — fast shipping without skipping the parts that keep it standing.";

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
        "short runways",
        "fast shipping",
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
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ProfessionalService",
                            name: SITE_NAME,
                            url: SITE_URL,
                            description,
                            logo: `${SITE_URL}/staglabs-mark.png`,
                            founder: [
                                { "@type": "Person", name: "Chirag Dave", url: "https://chirxg.is-a.dev" },
                                { "@type": "Person", name: "Ishan Patra", url: "https://ishanpatra.com" },
                            ],
                        }),
                    }}
                />
                {children}
            </body>
        </html>
    );
}
