"use client";

import { MyTeam } from "@/components/MyTeam/MyTeam";
import { Suspense } from "react";

export default function MyTeamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MyTeam />
    </Suspense>
  );
}
