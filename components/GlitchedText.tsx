"use client";

import { useState, useEffect } from "react";
import { GLITCH_CHARS } from "@/lib/constants";

export default function GlitchedText({ text }: { text: string }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const iv = setInterval(() => {
      setDisplay(
        text
          .split("")
          .map((c) =>
            Math.random() < 0.22
              ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
              : c
          )
          .join("")
      );
    }, 90);
    return () => clearInterval(iv);
  }, [text]);

  return <span style={{ color: "#ff4444" }}>{display}</span>;
}
