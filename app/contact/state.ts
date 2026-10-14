export type ContactState = {
    status: "idle" | "sent" | "fallback" | "invalid";
    message: string;
    errors: Partial<Record<"name" | "email" | "message", string>>;
    /** Echoed back so a failed submit does not wipe what the visitor typed. */
    values: { name: string; email: string; message: string };
};

export const INITIAL_CONTACT_STATE: ContactState = {
    status: "idle",
    message: "",
    errors: {},
    values: { name: "", email: "", message: "" },
};
