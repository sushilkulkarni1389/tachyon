import { NextRequest, NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";
import { saveSignal, generateSlug } from "@/lib/supabase";
import type { TachyonAnswers, Transmission } from "@/lib/prompts";

const auth0 = new Auth0Client();

interface SaveBody {
  answers: TachyonAnswers;
  transmissions: [Transmission, Transmission, Transmission];
}

export async function POST(req: NextRequest) {
  try {
    let userId = "anonymous";
    if (process.env.AUTH0_SECRET) {
      const session = await auth0.getSession();
      if (session) userId = session.user.sub;
    }

    const body: SaveBody = await req.json();
    const slug = generateSlug(body.answers.name);
    await saveSignal(userId, body.answers, body.transmissions, slug);
    return NextResponse.json({ ok: true, slug });
  } catch (err) {
    console.error("[save] Failed to save signal:", err);
    return NextResponse.json(
      { ok: false, error: "Failed to save" },
      { status: 500 }
    );
  }
}
