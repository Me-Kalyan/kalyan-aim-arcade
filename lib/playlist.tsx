"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";

type PlaylistContextValue = {
  active: boolean;
  queue: string[];
  currentIndex: number;
  startWarmup: () => void;
  onGameCompleted: (gameId: string) => void;
};

const PlaylistContext = createContext<PlaylistContextValue | undefined>(
  undefined
);

export function PlaylistProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [active, setActive] = useState(false);

  const startWarmup = useCallback(() => {
    const warmup = ["reaction-rush", "spray-control", "memory-grid"];
    setQueue(warmup);
    setCurrentIndex(0);
    setActive(true);
    toast({
      title: "Warmup started",
      description: "Reaction → Spray → Memory.",
      variant: "default",
    });
    router.push(`/game/${warmup[0]}`);
  }, [router, toast]);

  const onGameCompleted = useCallback(
    (gameId: string) => {
      if (!active || !queue.length) return;
      const current = queue[currentIndex];
      if (current !== gameId) return;

      const nextIndex = currentIndex + 1;
      if (nextIndex >= queue.length) {
        setActive(false);
        toast({
          title: "Warmup complete 🎉",
          description: "You finished your practice playlist.",
          variant: "success",
        });
        return;
      }

      const nextGameId = queue[nextIndex];
      setCurrentIndex(nextIndex);
      toast({
        title: "Next game in playlist",
        description: `Loading ${nextGameId.replace("-", " ")}…`,
        variant: "default",
      });
      router.push(`/game/${nextGameId}`);
    },
    [active, queue, currentIndex, router, toast]
  );

  return (
    <PlaylistContext.Provider
      value={{ active, queue, currentIndex, startWarmup, onGameCompleted }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const ctx = useContext(PlaylistContext);
  if (!ctx) {
    throw new Error("usePlaylist must be used within PlaylistProvider");
  }
  return ctx;
}

