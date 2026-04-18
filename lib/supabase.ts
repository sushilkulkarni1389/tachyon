import { createClient } from "@supabase/supabase-js";
import type { TachyonAnswers, Transmission } from "./prompts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const rand = Math.random().toString(36).slice(2, 8);
  return `${base || "signal"}-${rand}`;
}

export async function saveSignal(
  userId: string | null,
  answers: TachyonAnswers,
  transmissions: [Transmission, Transmission, Transmission],
  slug: string
) {
  const { error } = await supabase.from("signals").insert({
    user_id: userId,
    answers,
    transmissions,
    slug,
  });
  if (error) throw error;
}

export async function getSignalBySlug(slug: string) {
  const { data, error } = await supabase
    .from("signals")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}
