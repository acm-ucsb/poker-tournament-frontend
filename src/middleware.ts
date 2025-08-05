import { updateSession } from "@/lib/middlewares/supabase-auth";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Middleware function to handle requests involving authentication.
 * If the user is not authenticated, they will be redirected to the login page.
 *
 * @param req NextRequest
 * @returns
 */
export async function middleware(req: NextRequest) {
  return await updateSession(req);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/|$|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
