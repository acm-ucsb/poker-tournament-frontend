"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loadingAuth, signOut } = useAuth();
  const [signingOut, setSigningOut] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      {loadingAuth ? (
        <Loader2Icon size={50} color="white" className="animate-spin" />
      ) : (
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>
              {user ? (
                <>Welcome, {user.email}</>
              ) : (
                <>Please log in to continue</>
              )}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col gap-2">
            {user ? (
              <Button
                variant="destructive"
                className="w-full gap-0"
                onClick={() => {
                  setSigningOut(true);
                  signOut().then(() => window.location.reload());
                }}
                disabled={signingOut}
              >
                {signingOut ? <Loader2Icon className="animate-spin" /> : null}
                <span className="ml-2">Sign Out</span>
              </Button>
            ) : (
              <Button
                variant="default"
                className="w-full gap-0"
                onClick={() => router.push("/auth/login")}
              >
                <span className="ml-2">Sign In</span>
              </Button>
            )}
          </CardFooter>
        </Card>
      )}
    </main>
  );
}
