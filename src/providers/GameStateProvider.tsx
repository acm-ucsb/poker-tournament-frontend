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
import { usePathname, useRouter } from "next/navigation";
import { createSupabaseClient } from "@/lib/supabase/supabase-client";
import { toast } from "sonner";
import { useQuery } from "@supabase-cache-helpers/postgrest-swr";
import { useAuth } from "./AuthProvider";
import { Loader2 } from "lucide-react";
import { UCSB_POKER_TOURNEY_ID } from "@/lib/constants";
import { useLocalStorage } from "@mantine/hooks";
import { Table, Team, Tournament, User } from "@/lib/types";
import { useData } from "./DataProvider";

type GameStateContextType = {
  gameState: any | null;
  isLoading: boolean;
  error: string | null;
};

const GameStateContext = createContext<GameStateContextType>({
  gameState: null,
  isLoading: false,
  error: null,
});

type GameStateProviderProps = {
  children: ReactNode;
  tableId: string;
};

export function GameStateProvider({
  children,
  tableId,
}: GameStateProviderProps) {
  const supabase = createSupabaseClient();
  const [gameState, setGameState] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabasePokerTable = supabase.channel(`poker_table:${tableId}`);

    // presence and changes in db
    const subscription = supabasePokerTable
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "tables",
          filter: `id=eq.${tableId}`,
        },
        ({ new: newGame }: { new: Table }) => {
          console.log("New game state:", newGame);
          setGameState(newGame.game_state);
        }
      )
      .subscribe((status, err) => {
        console.log("Received event:", status, err);
        if (err) {
          toast.error("Unable to fetch game state: " + err.message);
          setError(err.message);
        }
        if (status === "SUBSCRIBED") {
          setIsLoading(false);
        }
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [tableId]);

  const value = useMemo(
    () => ({
      gameState,
      isLoading,
      error,
    }),
    [gameState, isLoading, error]
  );

  return (
    <GameStateContext.Provider value={value}>
      {isLoading ? (
        <div className="flex items-center justify-center grow">
          <Loader2 className="animate-spin text-green-300" size={40} />
        </div>
      ) : (
        children
      )}
    </GameStateContext.Provider>
  );
}

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};
