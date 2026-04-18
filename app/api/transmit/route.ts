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

  // ── Call Gemini ────────────────────────────────────────
  try {
    const geminiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: buildUserPrompt(answers),
      config: {
        systemInstruction: buildSystemPrompt(),
        responseMimeType: "application/json",
        temperature: 0.9,
        maxOutputTokens: 4096,
      },
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
    const message = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : '';
    console.error('[transmit] Gemini error message:', message);
    console.error('[transmit] Gemini error stack:', stack);
    console.error('[transmit] Gemini error raw:', err);
    return NextResponse.json({ error: 'Gemini call failed', detail: message }, { status: 502 });
  }
}
