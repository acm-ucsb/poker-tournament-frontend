"use server";

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/supabase-server";
import { DEFAULT_SIGNIN_REDIRECT_URL } from "@/lib/constants";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next");
  const redirectTo =
    next && next !== "null" ? next : DEFAULT_SIGNIN_REDIRECT_URL;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`);
    }
  }

  // send a 403 response if the code is invalid or missing
  return NextResponse.json(
    { error: "Invalid or missing code" },
    { status: 403 }
  );
}
