"use client";

import { useState } from "react";
import { CaSectionHead } from "./primitives";

const FAQS = [
    {
        question: "How do you ship faster without lowering the bar?",
        answer: "By removing waiting, not testing. Decisions get made early, work lands in small reviewable pieces, and verification runs alongside the build instead of at the end.",
    },
    {
        question: "Who owns the code?",
        answer: "You do. Repository, infrastructure, and documentation are yours from day one.",
    },
    {
        question: "What do you need from us to start?",
        answer: "A written problem, a decision-maker, and access to whatever system this touches. That is usually enough for the first cycle.",
    },
    {
        question: "Can you work with our existing stack?",
        answer: "Generally yes. We work in the stack you already run wherever it is sane to do so, and we will tell you when it is not.",
    },
    {
        question: "How is pricing structured?",
        answer: "Per agreed scope, split across the cycles it takes to reach the checkpoints. You know the cost of the next cycle before it begins.",
    },
    {
        question: "How long does a project take?",
        answer: "It depends on scope, and we would rather give you an honest cycle plan after the brief than a number before it.",
    },
];

export function FaqSection() {
    const [open, setOpen] = useState<number[]>([0]);

    function toggle(index: number) {
        setOpen((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index)
                : [...prev, index],
        );
    }

    return (
        <section id="faq" className="ca-anchor ca-sec" data-mood="thinking">
            <CaSectionHead
                eyebrow="05 · FAQ"
                lead="Frequently asked"
                em="questions"
                intro="The questions we get asked before the first call."
            />

            <div className="ca-cm mt-12">
                <div className="ca-siv flex flex-col gap-3">
                    {FAQS.map((item, index) => {
                        const isOpen = open.includes(index);

                        return (
                            <div
                                key={item.question}
                                className={`ca-faq ${isOpen ? "is-open" : ""}`.trim()}
                            >
                                <button
                                    type="button"
                                    id={`ca-faq-q-${index}`}
                                    className="ca-faq__q"
                                    aria-expanded={isOpen}
                                    aria-controls={`ca-faq-${index}`}
                                    onClick={() => toggle(index)}
                                >
                                    <span>{item.question}</span>
                                    <span
                                        className="ca-faq__icon"
                                        aria-hidden="true"
                                    >
                                        <svg
                                            width="12"
                                            height="12"
                                            viewBox="0 0 12 12"
                                            fill="none"
                                        >
                                            <path
                                                d="M6 1.5v9M1.5 6h9"
                                                stroke="#fff"
                                                strokeWidth="1.6"
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                    </span>
                                </button>

                                <div
                                    id={`ca-faq-${index}`}
                                    className="ca-faq__body"
                                    role="region"
                                    aria-labelledby={`ca-faq-q-${index}`}
                                >
                                    <div className="ca-faq__inner">
                                        <p
                                            className="px-7 pb-6 text-[0.95rem] leading-relaxed"
                                            style={{ color: "var(--ca-sub)" }}
                                        >
                                            {item.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
