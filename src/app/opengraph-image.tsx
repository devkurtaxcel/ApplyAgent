import { ImageResponse } from "next/og";

export const alt = "ApplyAgent: an AI job-application agent that asks before it acts";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(150deg, #09090b 0%, #18181b 60%, #3f3f46 140%)",
          color: "#fafafa",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 40, fontWeight: 800 }}>ApplyAgent</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 80, fontWeight: 800, lineHeight: 1.05 }}>Authorized to Act</div>
          <div style={{ fontSize: 36, color: "#a1a1aa", maxWidth: 960, lineHeight: 1.3 }}>
            An AI job-application agent where you approve every send
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#d4d4d8" }}>
          <span>applyagent.kurtaxcel.com</span>
          <span>Built by Kurt Axcel</span>
        </div>
      </div>
    ),
    size,
  );
}
