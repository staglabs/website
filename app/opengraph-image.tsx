import { ImageResponse } from "next/og";

export const alt = "Staglabs — software agency built for short runways";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    backgroundColor: "#ffffff",
                    color: "#131313",
                    padding: "72px",
                    borderTop: "14px solid #131313",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 20,
                        letterSpacing: 6,
                        color: "#4c4c4c",
                    }}
                >
                    <span>STAGLABS</span>
                    <span>BUILT FOR SHORT RUNWAYS</span>
                </div>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: 92,
                        lineHeight: 1.05,
                        letterSpacing: -2,
                    }}
                >
                    <span>Fast shipping,</span>
                    <span style={{ color: "#4c4c4c" }}>
                        without the shortcuts.
                    </span>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: 20,
                        letterSpacing: 6,
                        color: "#4c4c4c",
                        borderTop: "1px solid #efeff2",
                        paddingTop: 28,
                    }}
                >
                    <span>BRIEF / FRAME / BUILD / VERIFY / SHIP</span>
                    <span>PRODUCTION SOFTWARE IN SHORT CYCLES</span>
                </div>
            </div>
        ),
        size
    );
}
