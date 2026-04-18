export const GLITCH_CHARS = "▓█░▒▐▌╬╫▲▼◄►■□▪╔╗╚╝";

export interface Question {
  id: string;
  label: string;
  type: "text" | "number" | "choice" | "textarea";
  placeholder?: string;
  options?: string[];
}

export const QUESTIONS: Question[] = [
  { id: "name", label: "IDENTIFY YOURSELF", type: "text", placeholder: "Enter designation..." },
  { id: "age", label: "CURRENT AGE [YEARS]", type: "number", placeholder: "00" },
  { id: "location", label: "CURRENT LOCATION [CITY, COUNTRY]", type: "text", placeholder: "Mumbai, India..." },
  {
    id: "transport", label: "PRIMARY LOCOMOTION VECTOR", type: "choice",
    options: ["Walk / Cycle", "Public Transit", "Personal Vehicle", "Electric Vehicle"],
  },
  {
    id: "diet", label: "BIOLOGICAL FUEL CONFIGURATION", type: "choice",
    options: ["Primarily Plants", "Balanced Omnivore", "Meat with Most Meals", "Heavy Meat"],
  },
  {
    id: "flights", label: "ATMOSPHERIC CROSSINGS [PER YEAR]", type: "choice",
    options: ["Zero", "1–2 Flights", "3–6 Flights", "7+ Flights"],
  },
  {
    id: "energy", label: "DOMICILE ENERGY SOURCE", type: "choice",
    options: ["Renewable / Solar", "Mixed Grid", "Fossil Fuel Primary", "Unknown"],
  },
  {
    id: "commitment",
    label: "ONE ALTERATION YOU WOULD GENUINELY MAKE",
    type: "textarea",
    placeholder: "Be specific. This determines your alternate timeline...",
  },
];

export const SCAN_STATUSES: [number, string][] = [
  [0,  "SCANNING TEMPORAL FREQUENCIES..."],
  [18, "QUANTUM ENTANGLEMENT ESTABLISHED..."],
  [38, "CALIBRATING CHRONOLOGICAL OFFSET: 24.0 YEARS"],
  [60, "DECODING TACHYON SIGNAL PACKET..."],
  [78, "RECONSTRUCTING TRANSMISSION DATA..."],
  [92, "SIGNAL LOCK ACHIEVED — DECRYPTING..."],
];

export const FAKE_LOGS = [
  "TACHYON_FIELD: 1.44e-12 Hz DETECTED",
  "CHRONO_OFFSET: -8766.23 days",
  "RETROCAUSAL_LINK: ESTABLISHED",
  "DECODING_ALGO: HAWKING-PENROSE v3.1",
  "ENTROPY_REVERSAL: 0.0041%",
  "TIMELINE_BRANCHES: 3 DETECTED",
  "BIOMASS_SIGNATURE: MATCH 99.7%",
  "QUANTUM_KEY: ████████████ VALID",
  "DECRYPTION: IN PROGRESS...",
  "PACKETS_RECEIVED: 3 / 3",
];

export const PATH_META = [
  { label: "[ PATH: UNCHANGED ]",      color: "#ff4444", sub: "No alterations in timeline detected" },
  { label: "[ PATH: ONE ALTERATION ]", color: "#ffb700", sub: "Single commitment integrated" },
  { label: "[ PATH: RADICAL SHIFT ]",  color: "#00ff41", sub: "Full commitment cascade detected" },
];

export const BETWEEN = [
  { q: "But what if you made that one change?",  cta: "▶ RECEIVE ALTERNATE SIGNAL" },
  { q: "What if you went all in?",               cta: "▶ RECEIVE FINAL TRANSMISSION" },
];

// ── Display helpers ────────────────────────────────────

export function integrityColor(v: number): string {
  return v < 65 ? "#ff4444" : v < 80 ? "#ffb700" : "#00ff41";
}

export function planetaryColor(v: number): string {
  return v < 60 ? "#ff4444" : v < 75 ? "#ffb700" : "#00ff41";
}

export function bar(value: number, total = 10): string {
  const f = Math.min(total, Math.max(0, Math.round(value / total)));
  return "█".repeat(f) + "░".repeat(total - f);
}
