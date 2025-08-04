"use client";

import { OAuthSignInCard } from "@/components/OAuthSignInCard";
import { Suspense } from "react";

export default function SignIn() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthSignInCard />
    </Suspense>
  );
}
