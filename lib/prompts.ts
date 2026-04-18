// lib/prompts.ts
// TACHYON — Prompt builders for Gemini 2.5 Flash
// Strategy: plain system role + few-shot example + rich user context

export interface TachyonAnswers {
  name: string;
  age: string;
  location: string;
  transport: string;
  diet: string;
  flights: string;
  energy: string;
  commitment: string;
}

export interface Transmission {
  signal_integrity: number;
  planetary_index: number;
  origin_city: string;
  origin_flag: string;
  co2_ppm: number;
  temp_delta: string;
  text: string;
}

export interface TachyonResponse {
  transmissions: [Transmission, Transmission, Transmission];
}

function parseCity(location: string): string {
  return location.split(",")[0].trim();
}

function futureAge(currentAge: string): number {
  return parseInt(currentAge, 10) + 24;
}

// ─────────────────────────────────────────────────────────
// System Prompt
// Plain role + output rules + one complete correct example.
// Removed all negative prompting ("never garble", "never scramble")
// to prevent the model from roleplaying the text corruption.
// ─────────────────────────────────────────────────────────

export function buildSystemPrompt(): string {
  return `You are a creative fiction writer who generates structured JSON output.

Your task: write three short fictional monologues (~200 words each) from the perspective of a person writing to their younger self from the year 2050. The three monologues represent three different futures based on choices made in the present.

OUTPUT FORMAT: Return only valid JSON matching this exact structure. No markdown. No explanation. No code fences. The response must begin with { and end with }.

TEXT GENERATION RULES: 
1. Write exclusively in standard, highly readable, grammatically flawless English prose. 
2. Write clearly, like a published short story author.

THE TEXT INJECTION MECHANIC: In transmission 1 only, you must insert literal text strings into the narrative. Insert 2-3 of these exact strings at moments of peak emotional weight, substituting a word or short phrase:
  [CORRUPTED]
  [SIGNAL DEGRADED — 1.4s]

IMPORTANT: Treat these strings as if they were normal words. The surrounding narrative MUST remain perfectly spelled, perfectly readable, standard English prose. 

HERE IS A COMPLETE CORRECT EXAMPLE of one transmission text field:

"Forty-three now. The city held, mostly. The mangroves came back along Mahim Creek — nobody predicted that, but [CORRUPTED] used to say the water remembers. I still take the train. The line expanded north after the 2041 floods pushed everyone inland, but the original route runs clean. Sometimes I think about the years I kept flying, kept eating what I ate, kept pretending the numbers were someone else's problem. My knees ache in the heat. The heat is [SIGNAL DEGRADED — 1.4s] different now — not just temperature, a quality to it, a thickness. The morning chai still exists. The stall outside Dadar station is run by the same family, third generation. Small mercies. I am not broken. But I carry the particular exhaustion of someone who watched and did not act early enough. The world is functional. Functional is what we have."

Notice: normal readable prose, two text tags placed at emotional peaks, surrounding text fully readable.`;
}

// ─────────────────────────────────────────────────────────
// User Prompt
// All the creative context + specific person details live here
// ─────────────────────────────────────────────────────────

export function buildUserPrompt(answers: TachyonAnswers): string {
  const city = parseCity(answers.location);
  const age2050 = futureAge(answers.age);

  return `Write three fictional monologues for this person. All text must be standard, readable English prose.

PERSON:
- Name: ${answers.name}
- Age in 2050: ${age2050}
- City: ${answers.location}
- Transport: ${answers.transport}
- Diet: ${answers.diet}
- Flights per year: ${answers.flights}
- Home energy: ${answers.energy}
- One commitment they could make: "${answers.commitment}"

WORLD CONTEXT FOR 2050 (weave in as texture, never explain directly):
- Coastal cities face regular flooding in dark timelines; some recovered where action was taken early
- Internal climate displacement is common and bureaucratic — "relocated" is mundane, not dramatic
- ${city} summers are extreme in dark timeline; in bright timeline, the city held and specific things returned
- CO2: 480-498ppm in dark timeline, 390-420ppm in bright timeline

TRANSMISSION 1 — UNCHANGED PATH:
${answers.name} changed nothing. Write the quiet, specific cost of that. Resigned but not broken. Voice calibrated for age ${age2050}. Insert 2-3 literal "[CORRUPTED]" or "[SIGNAL DEGRADED — 1.4s]" strings at emotional peaks. Keep all other text as standard English.
Metadata: signal_integrity 55-65, planetary_index 48-58, co2_ppm 480-498, temp_delta +2.2 to +2.8°C
Origin: a geographically plausible inland relocation from ${city} with origin_flag "[relocated]"

TRANSMISSION 2 — ONE CHANGE:
Exactly the commitment above was made and held. Show how it rippled in unexpected ways. Cautious hope. Future-self is a little surprised. Do not use any inserted tags.
Metadata: signal_integrity 74-82, planetary_index 67-76, co2_ppm 445-462, temp_delta +1.6 to +2.0°C
Origin: a city near or adjacent to ${city}, origin_flag ""

TRANSMISSION 3 — RADICAL SHIFT:
${answers.name} acted fully and it spread. Write what ${city} feels like when it held. Specific small joys. Alive and grateful. Do not use any inserted tags.
Metadata: signal_integrity 90-96, planetary_index 84-92, co2_ppm 390-420, temp_delta +0.9 to +1.3°C
Origin: "${city}", origin_flag ""

Return this exact JSON structure:
{
  "transmissions": [
    {
      "signal_integrity": <integer>,
      "planetary_index": <integer>,
      "origin_city": "<string>",
      "origin_flag": "<string>",
      "co2_ppm": <integer>,
      "temp_delta": "<string>",
      "text": "<~200 words of fluent English prose>"
    },
    { ...same structure... },
    { ...same structure... }
  ]
}`;
}