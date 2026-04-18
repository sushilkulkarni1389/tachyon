"use client";

import { useState } from "react";
import ParsedText from "./ParsedText";
import { PATH_META, integrityColor, planetaryColor } from "@/lib/constants";
import type { Transmission, TachyonAnswers } from "@/lib/prompts";

export default function ShareScreen({
  transmissions,
  answers,
  shareSlug,
  onRestart,
}: {
  transmissions: [Transmission, Transmission, Transmission];
  answers: TachyonAnswers;
  shareSlug: string | null;
  onRestart: () => void;
}) {
  const [active, setActive] = useState(2);
  const t = transmissions[active];
  const path = PATH_META[active];

  const pullQuote = t.text
    .replace(/\[CORRUPTED\]|\[SIGNAL DEGRADED[^\]]*\]/g, "...")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 20)
    .slice(0, 2)
    .join(" ");

  return (
    <div className="tx-screen">
      <div style={{ width: "100%", maxWidth: 660 }}>
        <div
          className="vt"
          style={{
            textAlign: "center",
            color: "var(--green-dim)",
            fontSize: 16,
            letterSpacing: ".32em",
            marginBottom: 36,
          }}
        >
          ── ALL TRANSMISSIONS RECEIVED ──
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, justifyContent: "center" }}>
          {PATH_META.map((p, i) => (
            <button
              key={i}
              className={`tx-tab ${active === i ? "act" : ""}`}
              style={active === i ? { borderColor: p.color, color: p.color } : {}}
              onClick={() => setActive(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Card */}
        <div className="tx-card" style={{ borderColor: `${path.color}33` }}>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: `linear-gradient(90deg, transparent, ${path.color}, transparent)`,
              opacity: 0.5,
            }}
          />

          {/* Card header */}
          <div style={{ borderBottom: "1px solid var(--green-dark)", paddingBottom: 16, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span className="vt" style={{ fontSize: 22, letterSpacing: ".22em", color: "var(--green-dim)" }}>
                TACHYON
              </span>
              <span className="tx-badge" style={{ borderColor: path.color, color: path.color, marginBottom: 0 }}>
                {path.label}
              </span>
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: "var(--green-dim)", letterSpacing: ".06em", lineHeight: 1.8 }}>
              FROM: {answers.name.toUpperCase()}, AGE {parseInt(answers.age, 10) + 24}&nbsp;&nbsp;·&nbsp;&nbsp; ORIGIN:{" "}
              {t.origin_city.toUpperCase()}
              {t.origin_flag ? " " + t.origin_flag : ""}
            </div>
            <div style={{ marginTop: 6, display: "flex", gap: 20, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10, color: integrityColor(t.signal_integrity), letterSpacing: ".06em" }}>
                INTEGRITY: {t.signal_integrity}%
              </span>
              <span style={{ fontSize: 10, color: planetaryColor(t.planetary_index), letterSpacing: ".06em" }}>
                PLANETARY: {t.planetary_index}/100
              </span>
              <span style={{ fontSize: 10, color: "var(--amber)", letterSpacing: ".06em" }}>
                CO₂: {t.co2_ppm}ppm · {t.temp_delta}
              </span>
            </div>
          </div>

          {/* Pull quote */}
          <div className="tx-quote">&ldquo;{pullQuote}&rdquo;</div>

          {/* Footer */}
          <div
            style={{
              borderTop: "1px solid var(--green-dark)",
              paddingTop: 14,
              marginTop: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            <span style={{ color: "var(--green-dark)", fontSize: 8, letterSpacing: ".18em" }}>
              TACHYON · EARTH DAY 2026
            </span>
            <span style={{ color: "var(--green-dark)", fontSize: 8, letterSpacing: ".12em" }}>
              THREE TIMELINES. ONE CHOICE.
            </span>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            color: "var(--green-dark)",
            fontSize: 9,
            letterSpacing: ".1em",
            marginTop: 10,
            marginBottom: 28,
          }}
        >
          SCREENSHOT TO SHARE YOUR TRANSMISSION
        </div>

        {shareSlug && (
          <div
            style={{
              textAlign: "center",
              fontSize: 11,
              letterSpacing: ".08em",
              marginBottom: 28,
              color: "var(--green-dim)",
            }}
          >
            SIGNAL LINK:{" "}
            <span style={{ color: "var(--green)" }}>
              tachyon.app/signal/{shareSlug}
            </span>
          </div>
        )}

        {/* Full text */}
        <div style={{ border: "1px solid var(--green-dark)", padding: "20px 24px" }}>
          <div style={{ fontSize: 9, color: "var(--green-dim)", letterSpacing: ".2em", marginBottom: 16 }}>
            FULL TRANSMISSION TEXT:
          </div>
          <div className="tx-scroll">
            <div style={{ fontSize: 12, color: "var(--text)", lineHeight: 2.0 }}>
              <ParsedText text={t.text} />
            </div>
          </div>
        </div>

        <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="tx-btn" onClick={onRestart}>
            ▶ NEW TRANSMISSION
          </button>
        </div>
      </div>
    </div>
  );
}
