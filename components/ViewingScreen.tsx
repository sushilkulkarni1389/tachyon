"use client";

import { useState, useEffect, useRef } from "react";
import ParsedText from "./ParsedText";
import { PATH_META, BETWEEN, integrityColor, planetaryColor, bar } from "@/lib/constants";
import type { Transmission, TachyonAnswers } from "@/lib/prompts";

export default function ViewingScreen({
  transmissions,
  viewIdx,
  answers,
  onNext,
  onShare,
}: {
  transmissions: [Transmission, Transmission, Transmission];
  viewIdx: number;
  answers: TachyonAnswers;
  onNext: () => void;
  onShare: () => void;
}) {
  const t = transmissions[viewIdx];
  const path = PATH_META[viewIdx];
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  const [metaVis, setMetaVis] = useState(false);
  const metaTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTyped("");
    setDone(false);
    setMetaVis(false);

    metaTimerRef.current = setTimeout(() => {
      setMetaVis(true);
      typeTimerRef.current = setTimeout(() => {
        let i = 0;
        intervalRef.current = setInterval(() => {
          if (i < t.text.length) {
            setTyped((p) => p + t.text[i++]);
          } else {
            clearInterval(intervalRef.current!);
            setDone(true);
          }
        }, 13);
      }, 700);
    }, 300);

    return () => {
      if (metaTimerRef.current) clearTimeout(metaTimerRef.current);
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [viewIdx, t.text]);

  const skipTyping = () => {
    if (!done) {
      if (typeTimerRef.current) clearTimeout(typeTimerRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTyped(t.text);
      setDone(true);
    }
  };

  const metaRows = [
    { k: "FROM", v: `${answers.name.toUpperCase()}, AGE ${parseInt(answers.age, 10) + 24}` },
    { k: "TIMESTAMP", v: "APR 22 2050  ·  06:42 UTC" },
    {
      k: "ORIGIN",
      v: `${t.origin_city.toUpperCase()}${t.origin_flag ? "  " + t.origin_flag : ""}`,
      c: t.origin_flag ? "var(--amber)" : "var(--green)",
    },
    { k: "INTEGRITY", v: `[${bar(t.signal_integrity)}]  ${t.signal_integrity}%`, c: integrityColor(t.signal_integrity) },
    { k: "PLANETARY", v: `[${bar(t.planetary_index)}]  ${t.planetary_index} / 100`, c: planetaryColor(t.planetary_index) },
    { k: "CO₂", v: `${t.co2_ppm} ppm` },
    { k: "TEMP Δ", v: `${t.temp_delta} above 1990 baseline`, c: "var(--amber)" },
  ];

  return (
    <div className="tx-screen top" style={{ alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 740, padding: "0 4px" }}>
        {/* Path badge */}
        <div className="tx-badge" style={{ borderColor: path.color, color: path.color }}>
          {path.label}
        </div>
        <div style={{ color: "var(--green-dark)", fontSize: 9, letterSpacing: ".12em", marginBottom: 24 }}>
          {path.sub}
        </div>

        {/* Terminal */}
        <div className="tx-terminal">
          <div className="vt" style={{ fontSize: 12, letterSpacing: ".3em", color: "var(--green-dim)", marginBottom: 14 }}>
            ━━ TACHYON SIGNAL RECEIVED ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </div>

          {metaVis &&
            metaRows.map((row, i) => (
              <div key={i} className="tx-meta-row" style={{ animationDelay: `${i * 75}ms` }}>
                <span className="tx-meta-key">{row.k}</span>
                <span className="tx-meta-colon">:</span>
                <span style={{ color: row.c || "var(--green)" }}>{row.v}</span>
              </div>
            ))}

          <hr className="tx-sep" style={{ marginTop: 18 }} />

          {/* Transmission text — click to skip */}
          <div className="tx-text" onClick={skipTyping} title={done ? "" : "Click to skip"}>
            <ParsedText text={typed} />
            {!done && <span className="tx-cursor" />}
          </div>

          {/* Progress dots */}
          <div className="tx-dots">
            {[0, 1, 2].map((i) => (
              <div key={i} className="tx-dot" style={{ background: i === viewIdx ? path.color : "var(--green-dark)" }} />
            ))}
            <span style={{ color: "var(--green-dim)", fontSize: 9, letterSpacing: ".1em", marginLeft: 8 }}>
              {viewIdx + 1} / 3
            </span>
          </div>
        </div>

        {/* CTAs */}
        {done && (
          <div style={{ marginTop: 32 }}>
            {viewIdx < 2 && (
              <div>
                <div style={{ color: "var(--green-dark)", fontSize: 10, letterSpacing: ".1em", marginBottom: 16 }}>
                  {BETWEEN[viewIdx].q}
                </div>
                <button className={`tx-btn ${viewIdx === 0 ? "amber" : ""}`} onClick={onNext}>
                  {BETWEEN[viewIdx].cta}
                </button>
              </div>
            )}
            {viewIdx === 2 && (
              <button className="tx-btn" onClick={onShare}>
                ▶ VIEW ALL TRANSMISSIONS
              </button>
            )}
          </div>
        )}

        {!done && (
          <div style={{ marginTop: 20, color: "var(--green-dark)", fontSize: 9, letterSpacing: ".1em" }}>
            RECEIVING TRANSMISSION... CLICK TO SKIP
          </div>
        )}
      </div>
    </div>
  );
}
