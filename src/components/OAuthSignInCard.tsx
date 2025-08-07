"use client";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CSSProperties, useState } from "react";
import { Loader2Icon } from "lucide-react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { DEFAULT_SIGNIN_REDIRECT_URL } from "@/lib/constants";
import { ButtonWrapper } from "./ButtonWrapper";
import { useAuth } from "@/providers/AuthProvider";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  style?: CSSProperties;
};

type Provider = "google";

export function OAuthSignInCard({ disabled = false, style = {} }: Props) {
  const auth = useAuth();

  const supabaseClient = createSupabaseClient();

  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const redirectUrl = searchParams.get("redirect") as string;

  const isDisabled = disabled || loading || !!auth.user;

  const handleOAuth = async (provider: Provider) => {
    setLoading(true);

    supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(redirectUrl)}`,
        queryParams: {
          hd: "ucsb.edu", // Restrict to UCSB Google accounts
        },
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
        <ButtonWrapper
          variant="destructive"
          className="w-full gap-0"
          disabled={isDisabled}
          loading={loading || auth.loadingAuth}
          onClick={() => handleOAuth("google")}
        >
          {!!auth.user ? (
            <span>You're signed in as {auth.user.email}</span>
          ) : (
            <>
              <IconBrandGoogle />
              <span className="ml-2">Sign in with Google</span>
            </>
          )}
        </ButtonWrapper>
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
