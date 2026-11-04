"use client";

import { useEffect, useState, useTransition } from "react";
import { addToWatchlist } from "../actions";

type AddToWatchlistButtonProps = {
  movie: { tmdbId: number; title: string; posterPath: string | null };
};

export function AddToWatchlistButton({ movie }: AddToWatchlistButtonProps) {
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  function onClick() {
    setError(null);

    startTransition(async () => {
      const result = await addToWatchlist(movie);

      if (result.ok || result.error.code === "CONFLICT") {
        setAdded(true);
        return;
      }
      setError(result.error.message);
    });
  }

  return (
    <div>
      <button
        type="button"
        className="button"
        onClick={onClick}
        disabled={!isReady || isPending || added}
      >
        {isPending ? "Legger til..." : added ? "I watchlisten" : "Legg til i watchlist"}
      </button>
      {error && (
        <p role="alert" className="error-message">
          {error}
        </p>
      )}
    </div>
  );
}