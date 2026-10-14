/**
 * Where the mascot stops, in page order, and what it says there.
 *
 * `target` is the element it lands beside. `mood` is one of the avatar's
 * animations. Selectors are matched in order and a stop whose element is not on
 * the current page is skipped, so the same list serves the home page and the
 * interior routes.
 *
 * Voice: dry, a bit cheeky, never pushy. No invented numbers, no promises about
 * timelines. The site has no public email and no form, so no line asks for one.
 */
export type Stop = {
    id: string;
    target: string;
    line: string;
    mood: string;
    /** Which pages this stop belongs to. Defaults to the home page. */
    on?: "home" | "about" | "profile" | "notfound";
};

export const STOPS: Stop[] = [
    // ------------------------------------------------------------------ home
    {
        id: "hero",
        target: ".ca-hero-start",
        line: "Go on, press it. It does not bite. The pen is just for show.",
        mood: "curious",
    },
    {
        id: "work",
        target: "#work .ca-card",
        line: "Some of the things we have made. Yes, I checked them myself.",
        mood: "proud",
    },
    {
        id: "method",
        target: "#method .ca-card",
        line: "Five checkpoints, every time. Boring on purpose.",
        mood: "working",
    },
    {
        id: "method-cta",
        target: "#method a.ca-acta",
        line: "Seen enough steps? This one starts the walk.",
        mood: "playful",
    },
    {
        id: "quality",
        target: "#quality .ca-card",
        line: "Four gates. Nothing ships through a hole in the fence.",
        mood: "suspicious",
    },
    {
        id: "quote",
        target: "blockquote",
        line: "Fast is what it looks like when the process does the work.",
        mood: "happy",
    },
    {
        id: "outcomes-list",
        target: "#outcomes aside li",
        line: "Not every brief is a fit. They tell you before you spend a thing.",
        mood: "suspicious",
    },
    {
        id: "outcomes",
        target: "#outcomes a.ca-acta",
        line: "One honest paragraph is enough. We read all of it.",
        mood: "listening",
    },
    {
        id: "faq",
        target: "#faq button",
        line: "Questions? Poke one. They open. I tested.",
        mood: "thinking",
    },
    {
        id: "cta",
        target: "#start a.ca-acta",
        line: "Last chance to look busy. Hit the button instead.",
        mood: "excited",
    },
    {
        id: "footer",
        target: "footer a.ca-acta",
        line: "You scrolled all the way here. I respect that. Now press it.",
        mood: "celebrate",
    },
    // ----------------------------------------------------------------- about
    {
        id: "about-principles",
        target: "#principles article",
        line: "Small scope first. It is the whole trick.",
        mood: "proud",
        on: "about",
    },
    {
        id: "about-team",
        target: "#team a",
        line: "Two humans, no committee. Say hi.",
        mood: "happy",
        on: "about",
    },
    // --------------------------------------------------------------- profile
    {
        id: "profile-links",
        target: "main ul li a",
        line: "Their corners of the internet. Be nice.",
        mood: "curious",
        on: "profile",
    },
    // -------------------------------------------------------------- notfound
    {
        id: "notfound",
        target: "main a.ca-acta",
        line: "Wrong turn. It happens to the best of us. Back this way.",
        mood: "confused",
        on: "notfound",
    },
];

/**
 * If a real contact form with an email field is ever added, give the input
 * `data-mascot="email"` and this line will be used beside it automatically.
 */
export const EMAIL_STOP: Stop = {
    id: "email",
    target: '[data-mascot="email"]',
    line: "Hey, what are you thinking? Just put your email already.",
    mood: "playful",
};
