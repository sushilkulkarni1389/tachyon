import { Auth0Client } from "@auth0/nextjs-auth0/server";
import type { NextRequest } from "next/server";

const auth0 = new Auth0Client();

const handler = (req: NextRequest) => auth0.middleware(req);

export const GET = handler;
export const POST = handler;
