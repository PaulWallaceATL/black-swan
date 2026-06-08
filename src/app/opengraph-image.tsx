import { ImageResponse } from "next/og";

export const alt = "Black Swan — The intelligence layer for misogyny risk";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const swanSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#f0d9f5"/><stop offset="50%" stop-color="#a06bff"/><stop offset="100%" stop-color="#b567e0"/>
</linearGradient></defs>
<path d="M8 44 C 8 35 15 29 25 30 C 20 26 17 20 19 14 C 21 8 27 6 31 9 C 28 11 28 15 32 18 C 38 22 43 28 43 36 C 49 35 51 31 50 27 C 52 33 49 39 41 41 C 33 47 17 49 8 44 Z" fill="url(#g)"/>
<path d="M30 9 L38 8 L32 14 Z" fill="#efb366"/>
<circle cx="27" cy="13" r="1.4" fill="#16111d"/>
<path d="M16 41 C 23 33 34 33 41 39 C 34 36 25 37 19 43 C 17 43 16 42 16 41 Z" fill="#c79bf2"/>
</svg>`;

const swanDataUri = `data:image/svg+xml,${encodeURIComponent(swanSvg)}`;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#140f1b",
          backgroundImage:
            "radial-gradient(900px 520px at 16% 14%, rgba(160,107,255,0.30), transparent 70%), radial-gradient(700px 500px at 95% 100%, rgba(181,103,224,0.20), transparent 70%)",
          padding: "76px",
          color: "#f5eefb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
          <img src={swanDataUri} width={128} height={128} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 68,
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              Black Swan
            </div>
            <div
              style={{
                fontSize: 22,
                marginTop: 12,
                color: "#c9b3e0",
                letterSpacing: "0.34em",
              }}
            >
              INTELLIGENCE LAYER
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 54,
            lineHeight: 1.15,
            fontWeight: 600,
            maxWidth: "940px",
          }}
        >
          Detect, measure, and rate misogyny risk — before harm scales.
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            color: "#a99bbd",
          }}
        >
          <span>Proprietary AI for gendered-harm detection &amp; governance</span>
          <span style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 9999,
                backgroundColor: "#a06bff",
                display: "flex",
              }}
            />
            blackswan.ai
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
