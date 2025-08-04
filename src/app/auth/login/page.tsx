"use client";

import { OAuthLoginCard } from "@/components/OAuthLoginCard";
import { Suspense } from "react";

export default function Login() {
  return (
    // TODO: change the fallback to an actual skeleton loader fallback
    <Suspense fallback={<div>Loading...</div>}>
      <OAuthLoginCard />
    </Suspense>
  );
}
