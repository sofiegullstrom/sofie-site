import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#2C1A0E",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
        }}
      >
        <span
          style={{
            color: "#FAF7F2",
            fontSize: 14,
            fontWeight: 300,
            letterSpacing: "0.08em",
            fontFamily: "serif",
          }}
        >
          SG
        </span>
      </div>
    ),
    { ...size }
  );
}
