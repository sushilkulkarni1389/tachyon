"use client";

import { useState, useEffect, useRef } from "react";
import { QUESTIONS } from "@/lib/constants";
import type { TachyonAnswers } from "@/lib/prompts";

export default function FormScreen({
  onComplete,
}: {
  onComplete: (answers: TachyonAnswers) => void;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [val, setVal] = useState("");
  const [sel, setSel] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const inputRef = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  const q = QUESTIONS[step];

  useEffect(() => {
    setVal("");
    setSel(null);
    setErr("");
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    return () => clearTimeout(t);
  }, [step]);

  const next = () => {
    const value = q.type === "choice" ? sel : val.trim();
    if (!value) {
      setErr("// INPUT REQUIRED");
      return;
    }
    if (q.id === "age" && (isNaN(+value) || +value < 1 || +value > 99)) {
      setErr("// INVALID AGE [1–99]");
      return;
    }
    const newAns = { ...answers, [q.id]: value };
    setAnswers(newAns);
    if (step < QUESTIONS.length - 1) {
      setStep((s) => s + 1);
    } else {
      onComplete(newAns as unknown as TachyonAnswers);
    }
  };

  return (
    <div className="tx-screen">
      <div style={{ width: "100%", maxWidth: 600 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40 }}>
          <span className="vt" style={{ color: "var(--green-dim)", fontSize: 22, letterSpacing: ".22em" }}>
            TACHYON
          </span>
          <span style={{ color: "var(--green-dark)", fontSize: 10, letterSpacing: ".12em" }}>
            QUERY {String(step + 1).padStart(2, "0")} / {QUESTIONS.length}
          </span>
        </div>

        {/* Steps */}
        <div className="tx-steps">
          {QUESTIONS.map((_, i) => (
            <div key={i} className={`tx-step ${i <= step ? "act" : ""}`} />
          ))}
        </div>

        {/* Question */}
        <div
          className="vt"
          style={{
            fontSize: "clamp(22px, 3.8vw, 34px)",
            color: "var(--green)",
            letterSpacing: ".08em",
            marginBottom: 36,
            lineHeight: 1.2,
          }}
        >
          {q.label}
        </div>

        {/* Input types */}
        {(q.type === "text" || q.type === "number") && (
          <div style={{ textAlign: "center" }}>
            <span style={{ color: "var(--green-mid)", fontSize: 14, marginRight: 6 }}>▶</span>
            <input
              ref={inputRef as React.RefObject<HTMLInputElement>}
              className="tx-input"
              type={q.type === "number" ? "number" : "text"}
              value={val}
              placeholder={q.placeholder}
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
            />
          </div>
        )}

        {q.type === "textarea" && (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            className="tx-textarea"
            value={val}
            placeholder={q.placeholder}
            onChange={(e) => setVal(e.target.value)}
          />
        )}

        {q.type === "choice" && (
          <div className="tx-choices">
            {q.options!.map((o) => (
              <button key={o} className={`tx-opt ${sel === o ? "sel" : ""}`} onClick={() => setSel(o)}>
                <span style={{ opacity: sel === o ? 1 : 0 }}>▶ </span>
                {o}
              </button>
            ))}
          </div>
        )}

        {err && (
          <div style={{ color: "var(--red)", fontSize: 10, marginTop: 12, letterSpacing: ".08em" }}>{err}</div>
        )}

        {/* Actions */}
        <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <button className="tx-btn" onClick={next}>
            {step < QUESTIONS.length - 1 ? "▶ CONFIRM" : "▶ INITIATE TRANSMISSION"}
          </button>
          {step > 0 && (
            <button className="tx-btn sm" onClick={() => setStep((s) => s - 1)}>
              ◄ BACK
            </button>
          )}
        </div>

        {/* Hint */}
        {(q.type === "text" || q.type === "number") && (
          <div style={{ color: "var(--green-dark)", fontSize: 9, marginTop: 16, letterSpacing: ".1em" }}>
            PRESS ENTER TO CONFIRM
          </div>
        )}
      </div>
    </div>
  );
}
