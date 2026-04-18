import Link from "next/link";
import { getSignalBySlug } from "@/lib/supabase";
import type { Transmission, TachyonAnswers } from "@/lib/prompts";
import SignalViewer from "./SignalViewer";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function SignalPage({ params }: Props) {
  const { slug } = await params;
  const signal = await getSignalBySlug(slug);

  if (!signal) {
    return (
      <div className="tx-root">
        <div className="tx-scanlines" />
        <div className="tx-vignette" />
        <div className="tx-screen" style={{ textAlign: "center" }}>
          <div className="vt" style={{ fontSize: 28, letterSpacing: ".2em", color: "var(--red)", marginBottom: 24 }}>
            SIGNAL NOT FOUND
          </div>
          <div style={{ color: "var(--green-dark)", fontSize: 11, letterSpacing: ".1em", marginBottom: 40, lineHeight: 2 }}>
            NO TRANSMISSION MATCHING THIS FREQUENCY.<br />
            THE SIGNAL MAY HAVE DECAYED OR NEVER EXISTED.
          </div>
          <Link href="/" className="tx-btn" style={{ textDecoration: "none" }}>
            ▶ RETURN TO ORIGIN
          </Link>
        </div>
      </div>
    );
  }

  const answers = signal.answers as TachyonAnswers;
  const transmissions = signal.transmissions as [Transmission, Transmission, Transmission];

  return (
    <div className="tx-root">
      <div className="tx-scanlines" />
      <div className="tx-vignette" />
      <SignalViewer answers={answers} transmissions={transmissions} />
    </div>
  );
}
