"use client";

import { useState, useTransition } from "react";
import { navigate } from "rwsdk/client";
import { removeEntry, toggleFavorite } from "../actions";
import type { WatchlistDTO } from "../watchlist-mapper";
import { EntryForm } from "./EntryForm";

const STATUS_LABELS: Record<WatchlistDTO["status"], string> = {
  wanted: "Vil se",
  watching: "Ser nå",
  completed: "Ferdig sett",
};

// Henter lista på nytt, med samme filter i URL-en
function refresh() {
  return navigate(window.location.pathname + window.location.search, {
    history: "replace",
    info: { scrollToTop: false },
  });
}

export function WatchlistItem({ entry }: { entry: WatchlistDTO }) {
  const { id, title, posterPath, status, rating, favorite, comment } = entry;

  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const toggle = () => {
    setError(null);
    startTransition(async () => {
      const result = await toggleFavorite(id, !favorite);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      await refresh();
    });
  };

  const remove = () => {
    setError(null);
    startTransition(async () => {
      const result = await removeEntry(id);
      if (!result.ok) {
        setError(result.error.message);
        return;
      }
      await refresh();
    });
  };

  return (
    <li
      className="rounded-md border border-slate-200 p-3 data-[pending=true]:opacity-50"
      data-pending={isPending}
      data-testid="watchlist-item"
    >
      <div className="flex items-start gap-3">
        {posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w92${posterPath}`}
            alt={`Plakat for ${title}`}
            width={48}
            height={72}
            className="rounded"
          />
        ) : (
          <div
            className="flex h-[72px] w-12 items-center justify-center rounded bg-slate-100 text-xs text-slate-400"
            aria-label="Mangler plakat"
          >
            Ingen
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="font-medium" data-testid="title">
            {title}
          </p>
          <p className="text-sm text-slate-500">
            <span data-testid="status">{STATUS_LABELS[status]}</span>
            {" · "}
            <span data-testid="rating">
              {rating === null ? "ikke vurdert" : `${rating}/10`}
            </span>
          </p>
          {comment ? (
            <p className="mt-1 text-sm text-slate-700">{comment}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={toggle}
          disabled={isPending}
          aria-pressed={favorite}
          aria-label={favorite ? "Fjern fra favoritter" : "Legg til i favoritter"}
          className="text-xl disabled:opacity-50"
        >
          {favorite ? "★" : "☆"}
        </button>
      </div>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => setEditing((open) => !open)}
          className="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-50"
        >
          {editing ? "Lukk" : "Rediger"}
        </button>
        <button
          type="button"
          onClick={remove}
          disabled={isPending}
          className="rounded border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-50"
        >
          Slett
        </button>
      </div>

      {editing ? (
        <EntryForm entry={entry} onDone={() => setEditing(false)} />
      ) : null}

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600" data-testid="error">
          {error}
        </p>
      )}
    </li>
  );
}