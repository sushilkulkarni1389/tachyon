"use client";

import { useState, useEffect, useRef } from "react";
import { SCAN_STATUSES, FAKE_LOGS } from "@/lib/constants";

export default function InterceptingScreen({
  isApiReady,
  onDone,
}: {
  isApiReady: boolean;
  onDone: () => void;
}) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState(SCAN_STATUSES[0][1]);
  const [logs, setLogs] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const ivRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let p = 0;
    ivRef.current = setInterval(() => {
      p = Math.min(p + 0.9, 94);
      setProgress(p);
      const found = [...SCAN_STATUSES].reverse().find(([t]) => p >= t);
      if (found) setStatus(found[1]);
      if (p >= 94) clearInterval(ivRef.current!);
    }, 75);

    let li = 0;
    const lv = setInterval(() => {
      if (li < FAKE_LOGS.length) {
        setLogs((l) => [...l.slice(-8), FAKE_LOGS[li++]]);
      }
    }, 480);

    return () => {
      clearInterval(ivRef.current!);
      clearInterval(lv);
    };
  }, []);

  useEffect(() => {
    if (isApiReady && progress >= 85 && !done) {
      setDone(true);
      clearInterval(ivRef.current!);
      setProgress(100);
      setStatus("TRANSMISSION RECEIVED — DECRYPTION COMPLETE");
      setTimeout(onDone, 1600);
    }
  }, [isApiReady, progress, done, onDone]);

  return (
    <div className="tx-screen" style={{ textAlign: "center" }}>
      <div style={{ color: "var(--green-dark)", fontSize: 10, letterSpacing: ".32em", marginBottom: 44 }}>
        ◄ TACHYON SIGNAL INTERCEPT ►
      </div>

      <div
        className="vt"
        style={{
          fontSize: "clamp(18px, 3.5vw, 30px)",
          color: progress >= 100 ? "var(--green)" : "var(--green-mid)",
          letterSpacing: ".12em",
          marginBottom: 44,
          maxWidth: 540,
          lineHeight: 1.4,
          transition: "color .5s",
        }}
      >
        {status}
      </div>

      <div style={{ width: "100%", maxWidth: 500 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 10,
            color: "var(--green-dim)",
            marginBottom: 10,
            letterSpacing: ".12em",
          }}
        >
          <span>SIGNAL STRENGTH</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="tx-progress-track">
          <div className="tx-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div style={{ marginTop: 40, textAlign: "left", maxWidth: 460, width: "100%" }}>
        {logs.map((l, i) => (
          <div
            key={i}
            className="tx-log"
            style={{ color: i === logs.length - 1 ? "var(--green-dim)" : "var(--green-dark)" }}
          >
            {">"} {l}
          </div>
        ))}
      </div>
    </div>
  );
}
