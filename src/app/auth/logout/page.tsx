"use client";

import { OAuthLoginCard } from "@/components/OAuthLoginCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.loadingAuth && !auth.user) {
      router.push("/auth/login");
    }
  }, [auth.loadingAuth]);

  return (
    // TODO: change the fallback to an actual skeleton loader fallback
    <Suspense fallback={<div>Loading...</div>}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Sign in with your UCSB google account to play.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex-col gap-2">
          <Button
            variant="destructive"
            className="w-full gap-0"
            onClick={() => auth.signOut()}
          >
            <span className="ml-2">Sign Out</span>
          </Button>
          <Button
            className="w-full"
            variant={"outline"}
            onClick={() => router.push("/")}
          >
            Return Home
          </Button>
        </CardFooter>
      </Card>
    </Suspense>
  );
}
