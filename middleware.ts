import { NextRequest, NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0 = new Auth0Client();

export async function middleware(req: NextRequest) {
  // Skip auth entirely if Auth0 is not configured (local dev)
  if (!process.env.AUTH0_SECRET) {
    return NextResponse.next();
  }

  // Let Auth0 handle its own routes (/auth/login, /auth/callback, etc.)
  // and enforce session on protected API routes
  return auth0.middleware(req);
}

export const config = {
  matcher: [
    "/api/transmit",
    "/api/save",
    "/auth/:path*",
  ],
};
