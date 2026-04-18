"use client";

import GlitchedText from "./GlitchedText";

export default function ParsedText({ text }: { text: string }) {
  const parts = text.split(/(\[CORRUPTED\]|\[SIGNAL DEGRADED[^\]]*\])/g);
  return (
    <>
      {parts.map((p, i) =>
        /^\[(CORRUPTED|SIGNAL DEGRADED)/.test(p) ? (
          <GlitchedText key={i} text={p} />
        ) : (
          <span key={i}>{p}</span>
        )
      )}
    </>
  );
}
