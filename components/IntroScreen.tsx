"use client";

export default function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="tx-screen" style={{ textAlign: "center", gap: 0 }}>
      <div style={{ color: "var(--green-dark)", fontSize: 10, letterSpacing: ".35em", marginBottom: 32 }}>
        ◄ TEMPORAL SIGNAL INTERCEPT SYSTEM v2.4.1 ►
      </div>

      <div className="tx-logo">TACHYON</div>

      <div style={{ color: "var(--green-dim)", fontSize: 11, letterSpacing: ".18em", marginTop: 20, lineHeight: 2.2 }}>
        A TRANSMISSION FROM YOUR FUTURE SELF<br />
        TRAVELING BACKWARDS THROUGH TIME
      </div>

      <div style={{ color: "var(--green-dark)", letterSpacing: ".2em", marginTop: 32, fontSize: 10 }}>
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
      </div>

      <div style={{ color: "var(--green-dark)", fontSize: 11, marginTop: 20, lineHeight: 2, letterSpacing: ".1em", maxWidth: 380 }}>
        INPUT YOUR CURRENT LIFESTYLE.<br />
        RECEIVE THREE SIGNALS FROM 2050.<br />
        THREE POSSIBLE FUTURES. ONE IS YOURS.
      </div>

      <button className="tx-btn" onClick={onStart} style={{ marginTop: 52 }}>
        ▶ INITIATE SEQUENCE
      </button>

      <div style={{ color: "var(--green-faint)", fontSize: 9, letterSpacing: ".12em", marginTop: 64 }}>
        EARTH DAY 2026 · TACHYON RESEARCH COLLECTIVE
      </div>

      {/* Corner decorations */}
      <div style={{ position: "fixed", top: 20, left: 20, color: "var(--green-dark)", fontSize: 10, letterSpacing: ".1em" }}>
        ◄ TCH-2450-B
      </div>
      <div style={{ position: "fixed", top: 20, right: 20, color: "var(--green-dark)", fontSize: 10, letterSpacing: ".1em" }}>
        ACTIVE ►
      </div>
      <div style={{ position: "fixed", bottom: 20, left: 20, color: "var(--green-dark)", fontSize: 9 }}>
        <span className="tx-pulse">●</span> STANDING BY
      </div>
    </div>
  );
}
