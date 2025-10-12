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
import { UCSB_ACTIVE_POKER_TOURNEY_ID } from "@/lib/constants";
import { useLocalStorage } from "@mantine/hooks";
import {
  PokerGameState,
  PokerGameStateDB,
  Table,
  Team,
  Tournament,
  User,
} from "@/lib/types";
import { useData } from "./DataProvider";
import { parseGameState } from "@/lib/util/parseGameState";

type GameStateContextType = {
  gameState: PokerGameState | null;
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

  const [gameState, setGameState] = useState<PokerGameState | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // First fetch the game state
  const { data: initialTableData, error: initialError } = useQuery<{
    game_state: PokerGameStateDB;
  }>(supabase.from("tables").select("game_state").eq("id", tableId).single(), {
    revalidateOnFocus: false,
    refreshInterval: 0,
  });

  useEffect(() => {
    if (initialTableData) {
      parseGameState(initialTableData.game_state).then((populatedState) => {
        setGameState(populatedState);
      });

      setIsLoading(false);
    }
  }, [initialTableData, initialError]);

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
        async ({ new: newGame }: { new: Table }) => {
          setGameState(await parseGameState(newGame.game_state));
        }
      )
      .subscribe((status, err) => {
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
