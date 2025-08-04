"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CSSProperties, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase-client";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
};

type Provider = "google";

export function OAuthLoginCard({ disabled = false, style = {} }: Props) {
  const supabaseClient = createSupabaseClient();

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectUrl = (searchParams.get("redirect") as string) || "/";

  const isDisabled = disabled || loading;

  const handleOAuth = async (provider: Provider) => {
    setLoading(true);

    supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
      },
    });

    return;
  };

  return (
    <Card className="w-full max-w-sm" style={style}>
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
          disabled={isDisabled}
          onClick={() => handleOAuth("google")}
        >
          {loading ? (
            <Loader2Icon className="animate-spin" />
          ) : (
            <IconBrandGoogle />
          )}
          <span className="ml-2">Sign in with Google</span>
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
  );
}
