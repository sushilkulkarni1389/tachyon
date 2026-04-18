"use client";

import { useState } from "react";
import IntroScreen from "@/components/IntroScreen";
import FormScreen from "@/components/FormScreen";
import InterceptingScreen from "@/components/InterceptingScreen";
import ViewingScreen from "@/components/ViewingScreen";
import ShareScreen from "@/components/ShareScreen";
import type { TachyonAnswers, Transmission, TachyonResponse } from "@/lib/prompts";

type Phase = "intro" | "form" | "intercepting" | "viewing" | "share";

export default function Tachyon() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [transmissions, setTransmissions] = useState<[Transmission, Transmission, Transmission] | null>(null);
  const [apiReady, setApiReady] = useState(false);
  const [viewIdx, setViewIdx] = useState(0);
  const [answers, setAnswers] = useState<TachyonAnswers | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [shareSlug, setShareSlug] = useState<string | null>(null);

  const handleFormComplete = async (ans: TachyonAnswers) => {
    setAnswers(ans);
    setApiReady(false);
    setTransmissions(null);
    setApiError(null);
    setShareSlug(null);
    setPhase("intercepting");

    try {
      const res = await fetch("/api/transmit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ans),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Transmission failed");
      }

      const data: TachyonResponse = await res.json();
      setTransmissions(data.transmissions);
      setApiReady(true);

      // Non-blocking save — capture slug if it succeeds
      fetch("/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: ans, transmissions: data.transmissions }),
      })
        .then((r) => r.json())
        .then((d) => { if (d.slug) setShareSlug(d.slug); })
        .catch(() => {});
    } catch (e) {
      console.error(e);
      setApiError("SIGNAL LOST. RESTART AND TRY AGAIN.");
      setTimeout(() => {
        setPhase("intro");
        setApiError(null);
      }, 3000);
    }
  };

  const restart = () => {
    setPhase("intro");
    setTransmissions(null);
    setApiReady(false);
    setAnswers(null);
    setViewIdx(0);
  };

  return (
    <div className="tx-root">
      <div className="tx-scanlines" />
      <div className="tx-vignette" />
      <div className="tx-sweep" />

      {apiError && (
        <div
          style={{
            position: "fixed",
            top: 24,
            left: "50%",
            transform: "translateX(-50%)",
            color: "var(--red)",
            fontSize: 11,
            letterSpacing: ".1em",
            zIndex: 999,
            background: "var(--bg)",
            padding: "10px 20px",
            border: "1px solid rgba(255,68,68,.3)",
          }}
        >
          ⚠ {apiError}
        </div>
      )}

      {phase === "intro" && <IntroScreen onStart={() => setPhase("form")} />}
      {phase === "form" && <FormScreen onComplete={handleFormComplete} />}
      {phase === "intercepting" && (
        <InterceptingScreen
          isApiReady={apiReady}
          onDone={() => {
            setViewIdx(0);
            setPhase("viewing");
          }}
        />
      )}
      {phase === "viewing" && transmissions && answers && (
        <ViewingScreen
          transmissions={transmissions}
          viewIdx={viewIdx}
          answers={answers}
          onNext={() => setViewIdx((i) => i + 1)}
          onShare={() => setPhase("share")}
        />
      )}
      {phase === "share" && transmissions && answers && (
        <ShareScreen transmissions={transmissions} answers={answers} shareSlug={shareSlug} onRestart={restart} />
      )}
    </div>
  );
}
