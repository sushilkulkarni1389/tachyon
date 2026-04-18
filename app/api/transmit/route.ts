export const maxDuration = 60; // seconds

import { NextRequest, NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { GoogleGenAI } from "@google/genai";
import {
  buildSystemPrompt,
  buildUserPrompt,
  type TachyonAnswers,
  type TachyonResponse,
} from "@/lib/prompts";

const auth0 = new Auth0Client();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const REQUIRED_FIELDS: (keyof TachyonAnswers)[] = [
  "name",
  "age",
  "location",
  "transport",
  "diet",
  "flights",
  "energy",
  "commitment",
];

export async function POST(req: NextRequest) {
  // ── Auth gate ──────────────────────────────────────────
  let userId = "anonymous";
  if (process.env.AUTH0_SECRET) {
    const session = await auth0.getSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized — no active session" },
        { status: 401 }
      );
    }
    userId = session.user.sub;
  }

  // ── Parse & validate body ──────────────────────────────
  let answers: TachyonAnswers;
  try {
    answers = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const missing = REQUIRED_FIELDS.filter(
    (f) => typeof answers[f] !== "string" || answers[f].trim() === ""
  );
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing fields: ${missing.join(", ")}` },
      { status: 400 }
    );
  }

  // ── Call Gemini (with fallback model) ───────────────────
  const models = ["gemini-2.5-flash", "gemini-3-flash-preview"];
  const config = {
    systemInstruction: buildSystemPrompt(),
    responseMimeType: "application/json" as const,
    temperature: 0.9,
    maxOutputTokens: 8192,
  };
  const contents = buildUserPrompt(answers);

  let lastError: unknown;
  for (const model of models) {
    try {
      console.log(`[transmit] Trying model: ${model}`);
      const geminiResponse = await ai.models.generateContent({
        model,
        contents,
        config,
      });

      const raw = geminiResponse.text;
      if (!raw) throw new Error("Empty response from Gemini");
      const result = JSON.parse(raw) as TachyonResponse;

      if (
        !result.transmissions ||
        !Array.isArray(result.transmissions) ||
        result.transmissions.length !== 3
      ) {
        return NextResponse.json(
          { error: "Gemini response missing 3 transmissions", raw: result },
          { status: 502 }
        );
      }

      return NextResponse.json(result);
    } catch (err: unknown) {
      lastError = err;
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[transmit] ${model} failed:`, message);
      // Try next model
    }
  }

  const message = lastError instanceof Error ? lastError.message : String(lastError);
  console.error('[transmit] All models failed. Last error:', message);
  return NextResponse.json({ error: 'Gemini call failed', detail: message }, { status: 502 });
}
