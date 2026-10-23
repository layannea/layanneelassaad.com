import { ImageResponse } from "next/og";
import { site } from "./data/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = site.name;

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#fafafa",
          color: "#0a0a0a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 22, color: "#8a8a8a", letterSpacing: 1 }}>
          {`${site.role.toUpperCase()}  |  ${site.location.toUpperCase()}`}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 88, fontWeight: 600, letterSpacing: -3, lineHeight: 1 }}>
            {site.name}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#5f5f5f", maxWidth: 900, lineHeight: 1.35 }}>
            {site.intro}
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#8a8a8a" }}>layanneelassaad.com</div>
      </div>
    ),
    size
  );
}
