"use server";

import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";
import { INITIAL_CONTACT_STATE, type ContactState } from "./state";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function field(form: FormData, key: string, max: number): string {
    const v = form.get(key);
    return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/**
 * Contact form handler.
 *
 * Delivery is optional and needs no extra package: when `RESEND_API_KEY` and
 * `CONTACT_FROM` are set it sends through Resend's HTTP API. Without them the
 * message is only logged on the server, and the visitor is told so honestly and
 * given a prefilled mailto link instead of a false "sent".
 */
export async function sendContact(
    _prev: ContactState,
    form: FormData,
): Promise<ContactState> {
    // Honeypot: real visitors never see or fill this field.
    if (field(form, "company", 200)) {
        return { ...INITIAL_CONTACT_STATE, status: "sent", message: "Thanks. We will be in touch." };
    }

    const values = {
        name: field(form, "name", 120),
        email: field(form, "email", 200),
        message: field(form, "message", 4000),
    };
    const errors: ContactState["errors"] = {};
    if (values.name.length < 2) errors.name = "Tell us your name.";
    if (!EMAIL_RE.test(values.email)) errors.email = "Enter a valid email address.";
    if (values.message.length < 10) errors.message = "A sentence or two about the project helps.";
    if (Object.keys(errors).length) {
        return { status: "invalid", message: "Please fix the highlighted fields.", errors, values };
    }

    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM;

    if (apiKey && from) {
        try {
            const res = await fetch("https://api.resend.com/emails", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    from,
                    to: [CONTACT_EMAIL],
                    reply_to: values.email,
                    subject: `${SITE_NAME} enquiry from ${values.name}`,
                    text: `Name: ${values.name}\nEmail: ${values.email}\n\n${values.message}`,
                }),
            });
            if (res.ok) {
                return {
                    status: "sent",
                    message: "Thanks. We got your message and will reply by email.",
                    errors: {},
                    values: INITIAL_CONTACT_STATE.values,
                };
            }
            console.error("[contact] Resend rejected the message", res.status, await res.text());
        } catch (error) {
            console.error("[contact] Resend request failed", error);
        }
    } else {
        console.log("[contact] No mail provider configured. Message logged only:", {
            name: values.name,
            email: values.email,
            message: values.message,
        });
    }

    return {
        status: "fallback",
        message: `We could not send this automatically. Please email ${CONTACT_EMAIL} directly.`,
        errors: {},
        values,
    };
}
