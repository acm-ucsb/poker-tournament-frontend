"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";
import { useData } from "./DataProvider";
import { usePathname } from "next/navigation";
import { BACKEND_ENGINE_BASE_URL, POLL_INTERVAL_MS } from "@/lib/constants";
import { useWindowEvent } from "@mantine/hooks";
import axios from "axios";
import { useAuth } from "./AuthProvider";

type AdminGameLoopProviderProps = {
  children: ReactNode;
};

type AdminGameLoopContextType = {
  intervalId: NodeJS.Timeout | null;
  onStartTables: () => Promise<void>;
  onStopTables: () => void;
};

const AdminGameLoopContext = createContext({
  intervalId: null as NodeJS.Timeout | null,
  onStartTables: async () => {},
  onStopTables: () => {},
});

export function AdminGameLoopProvider({
  children,
}: AdminGameLoopProviderProps) {
  const { data } = useData();
  const { session } = useAuth();

  const [pollIntervalId, setPollIntervalId] = useState<NodeJS.Timeout | null>(
    null
  );

  const onStopTables = () => {
    if (!data?.is_admin) return;

    toast.loading("Stopping tables...", {
      id: "stop-tables",
      richColors: true,
    });

    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      setPollIntervalId(null);
      toast.success("Tables stopped.", {
        id: "stop-tables",
        richColors: true,
      });
    }
  };

  const onStartTables = async () => {
    if (!data?.is_admin) return;

    toast.loading("Starting tables...", {
      id: "start-tables",
      richColors: true,
    });

    if (pollIntervalId) {
      clearInterval(pollIntervalId);
    }

    const intervalId = setInterval(async () => {
      toast.loading("Stepping to next hand...", {
        id: "stepping-hand",
        richColors: true,
      });

      try {
        const response = await axios.post(
          `${BACKEND_ENGINE_BASE_URL}/admin/tables/move`,
          null,
          {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
          }
        );

        console.log(response);

        if (response.status !== 200) {
          throw new Error("Failed to step to next hand.");
        }

        toast.success("Stepped to next hand.", {
          id: "stepping-hand",
          richColors: true,
        });
      } catch (error: any) {
        toast.error(`Error: ${String(error)}`, {
          id: "stepping-hand",
          richColors: true,
        });
      }
    }, POLL_INTERVAL_MS);

    setPollIntervalId(intervalId);

    toast.success("Tables started.", {
      id: "start-tables",
      richColors: true,
    });
  };

  // Reload or close warning
  useWindowEvent("beforeunload", (e) => {
    if (!data?.is_admin) return;

    if (pollIntervalId) {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? The tournament is still running.";
    }
  });

  const value = useMemo(
    () => ({
      intervalId: pollIntervalId,
      onStartTables,
      onStopTables,
    }),
    [pollIntervalId]
  );

  if (!data?.is_admin) return children;

  return (
    <AdminGameLoopContext.Provider value={value}>
      {children}
    </AdminGameLoopContext.Provider>
  );
}

export const useAdminGameLoop = () => {
  const context = useContext(AdminGameLoopContext);
  if (context === undefined) {
    throw new Error(
      "useAdminGameLoop must be used within an AdminGameLoopProvider"
    );
  }
  return context;
};
