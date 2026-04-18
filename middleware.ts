import { NextRequest, NextResponse } from "next/server";
import { Auth0Client } from "@auth0/nextjs-auth0/server";

const auth0 = new Auth0Client();

export async function middleware(req: NextRequest) {
  const isAuthRoute = req.nextUrl.pathname.startsWith("/auth/");

  // Auth0 must always handle its own routes (login/callback/logout)
  if (isAuthRoute) {
    return auth0.middleware(req);
  }

  // For API routes: skip auth if Auth0 is not configured (local dev)
  if (!process.env.AUTH0_SECRET) {
    return NextResponse.next();
  }

  return auth0.middleware(req);
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/api/transmit",
    "/api/save",
  ],
};
