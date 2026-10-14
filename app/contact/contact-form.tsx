"use client";

import { useActionState } from "react";
import { ArrowUpRight } from "@/components/staglabs/icons";
import { CONTACT_EMAIL } from "@/lib/site";
import { sendContact } from "./actions";
import { INITIAL_CONTACT_STATE } from "./state";

const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "#ffffff",
    color: "var(--ca-ink)",
    border: "1px solid rgba(0,0,0,0.18)",
    borderRadius: "var(--ca-r-sm)",
    padding: "0.8rem 1rem",
    fontSize: "1rem",
    lineHeight: 1.4,
};

function FieldError({ id, text }: { id: string; text?: string }) {
    if (!text) return null;
    return (
        <p id={id} role="alert" className="mt-1.5 text-[0.85rem]" style={{ color: "#b3261e" }}>
            {text}
        </p>
    );
}

export function ContactForm() {
    const [state, action, pending] = useActionState(sendContact, INITIAL_CONTACT_STATE);
    const { errors, values } = state;

    const mailto =
        `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Project enquiry")}` +
        `&body=${encodeURIComponent(`${values.message}\n\n${values.name}`.trim())}`;

    return (
        <form action={action} noValidate className="ca-card flex flex-col gap-5 p-7">
            <div>
                <label htmlFor="c-name" className="ca-label" style={{ color: "var(--ca-ink)" }}>
                    NAME
                </label>
                <input
                    id="c-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    defaultValue={values.name}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "c-name-err" : undefined}
                    className="mt-2"
                    style={inputStyle}
                />
                <FieldError id="c-name-err" text={errors.name} />
            </div>

            <div>
                <label htmlFor="c-email" className="ca-label" style={{ color: "var(--ca-ink)" }}>
                    EMAIL
                </label>
                <input
                    id="c-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    data-mascot="email"
                    defaultValue={values.email}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "c-email-err" : undefined}
                    className="mt-2"
                    style={inputStyle}
                />
                <FieldError id="c-email-err" text={errors.email} />
            </div>

            <div>
                <label htmlFor="c-message" className="ca-label" style={{ color: "var(--ca-ink)" }}>
                    WHAT ARE YOU BUILDING?
                </label>
                <textarea
                    id="c-message"
                    name="message"
                    rows={6}
                    required
                    defaultValue={values.message}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "c-message-err" : undefined}
                    className="mt-2"
                    style={{ ...inputStyle, resize: "vertical" }}
                />
                <FieldError id="c-message-err" text={errors.message} />
            </div>

            {/* Honeypot. Hidden from people and assistive tech, bots fill it. */}
            <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
                <label htmlFor="c-company">Company</label>
                <input id="c-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="flex flex-wrap items-center gap-4">
                <button
                    type="submit"
                    disabled={pending}
                    className="ca-acta ca-acta--dark"
                    style={{ opacity: pending ? 0.7 : 1 }}
                >
                    <span className="ca-acta__bg" aria-hidden="true" />
                    <span className="ca-acta__label">{pending ? "Sending…" : "Send message"}</span>
                    <span className="ca-acta__chip" aria-hidden="true">
                        <ArrowUpRight />
                    </span>
                </button>
                <a className="ca-ilink text-[0.9rem]" href={mailto}>
                    or email {CONTACT_EMAIL}
                </a>
            </div>

            <div aria-live="polite">
                {state.status === "sent" ? (
                    <p className="text-[0.95rem]" style={{ color: "var(--ca-ink)" }}>
                        {state.message}
                    </p>
                ) : null}
                {state.status === "fallback" ? (
                    <p className="text-[0.95rem]" style={{ color: "#b3261e" }}>
                        {state.message}{" "}
                        <a className="ca-ilink" href={mailto}>
                            Open your email app
                        </a>
                    </p>
                ) : null}
                {state.status === "invalid" ? (
                    <p className="text-[0.95rem]" style={{ color: "#b3261e" }}>
                        {state.message}
                    </p>
                ) : null}
            </div>
        </form>
    );
}
