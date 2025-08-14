"use client";

import { Session } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";
import { useLocalStorage } from "@mantine/hooks";
import { useData } from "./DataProvider";

type GlobalNotificationProviderProps = {
  children: ReactNode;
};

const GlobalNotificationContext = createContext({});

export function GlobalNotificationProvider({
  children,
}: GlobalNotificationProviderProps) {
  const { data, tourneyData } = useData();

  // Global notifications
  const prevTableStatus = useRef(data?.team?.table);
  const prevTourneyStatus = useRef(tourneyData?.status);

  useEffect(() => {
    if (data?.team?.table && data?.team?.table !== prevTableStatus.current) {
      toast.info(
        `You have been assigned a table! You can watch your table play, or watch other tables now.`,
        {
          richColors: true,
        }
      );
    }
  }, [data?.team?.table]);

  useEffect(() => {
    if (
      tourneyData?.status === "active" &&
      tourneyData?.status !== prevTourneyStatus.current
    ) {
      toast.info(
        `The tournament has started! Tables have been created and assigned. You can now view your table or watch other tables.`,
        {
          richColors: true,
        }
      );
    }
  }, [tourneyData?.status]);

  return (
    <GlobalNotificationContext.Provider value={{}}>
      {children}
    </GlobalNotificationContext.Provider>
  );
}
