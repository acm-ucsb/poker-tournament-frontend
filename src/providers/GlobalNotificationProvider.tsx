"use client";

import { createContext, ReactNode, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useData } from "./DataProvider";
import { usePathname } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";

type BlindsIncreaseNotification = {
  currentBlinds: string;
  nextBlinds: string;
};

type GlobalNotificationProviderProps = {
  children: ReactNode;
};

const GlobalNotificationContext = createContext({});

export function GlobalNotificationProvider({
  children,
}: GlobalNotificationProviderProps) {
  const supabase = createSupabaseClient();
  const { data, tourneyData } = useData();

  const pathname = usePathname();
  const isHomePage = pathname === "/";

  // Global notifications
  const prevTableStatus = useRef(data?.team?.table);
  const prevTourneyStatus = useRef(tourneyData?.status);

  useEffect(() => {
    if (isHomePage) return;

    if (
      data?.team?.table &&
      data?.team?.table !== prevTableStatus.current &&
      !data?.is_admin
    ) {
      toast.info(
        `You have been assigned a table! You can watch your table play, or watch other tables now.`,
        {
          richColors: true,
          duration: 10000,
        }
      );
    }
  }, [data?.team?.table]);

  useEffect(() => {
    if (isHomePage) return;

    if (
      tourneyData?.status === "active" &&
      tourneyData?.status !== prevTourneyStatus.current &&
      !data?.is_admin
    ) {
      toast.info(
        `The tournament has started! Tables have been created and assigned. You can now view your table if you are a player or watch other tables.`,
        {
          richColors: true,
          duration: 10000,
        }
      );
    }
  }, [tourneyData?.status]);

  // Tournament notifications

  useEffect(() => {
    // Join broadcast channel for tournament updates
    const channel = supabase.channel(
      `tournament:${UCSB_ACTIVE_POKER_TOURNEY_ID}`
    );

    // Listen for blind increases
    channel.on(
      "broadcast",
      { event: "tournament:increase-blinds" },
      ({ payload }: { payload: BlindsIncreaseNotification }) => {
        toast.error(
          <>
            Blinds have increased from{" "}
            <span className="font-bold">{payload.currentBlinds}</span> to{" "}
            <span className="font-bold">{payload.nextBlinds}</span>!
          </>,
          {
            richColors: true,
            duration: 10000,
          }
        );
      }
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <GlobalNotificationContext.Provider value={{}}>
      {children}
    </GlobalNotificationContext.Provider>
  );
}
