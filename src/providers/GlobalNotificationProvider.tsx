"use client";

import { createContext, ReactNode, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useData } from "./DataProvider";
import { usePathname } from "next/navigation";

type GlobalNotificationProviderProps = {
  children: ReactNode;
};

const GlobalNotificationContext = createContext({});

export function GlobalNotificationProvider({
  children,
}: GlobalNotificationProviderProps) {
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
