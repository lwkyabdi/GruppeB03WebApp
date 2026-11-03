"use client";

import { useActionState, useEffect } from "react";
import { navigate } from "rwsdk/client";
import { updateEntryAction } from "../actions";
import type { WatchlistDTO } from "../watchlist-mapper";

export function EntryForm({
  entry,
  onDone,
}: {
  entry: WatchlistDTO;
  onDone: () => void;
}) {
  const [state, formAction, isPending] = useActionState(updateEntryAction, null);

  // Ved suksess: lukk skjemaet og hent lista på nytt
  useEffect(() => {
    if (!state?.ok) return;
    onDone();
    void navigate(window.location.pathname + window.location.search, {
      history: "replace",
      info: { scrollToTop: false },
    });
  }, [state]);

  const failed = state?.ok === false ? state.error : null;
  const details = Object.values(failed?.fieldErrors ?? {}).flat();

  return (
    <form action={formAction} className="mt-3 flex flex-col gap-3">
      <input type="hidden" name="id" value={entry.id} />

      <label className="flex flex-col text-sm font-medium">
        Status
        <select
          name="status"
          defaultValue={entry.status}
          className="rounded-md border border-slate-300 px-3 py-2 font-normal"
        >
          <option value="wanted">Vil se</option>
          <option value="watching">Ser nå</option>
          <option value="completed">Ferdig sett</option>
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium">
        Rating (1-10)
        <input
          name="rating"
          type="number"
          min={1}
          max={10}
          defaultValue={entry.rating ?? ""}
          placeholder="Ikke vurdert"
          className="rounded-md border border-slate-300 px-3 py-2 font-normal"
        />
      </label>

      <label className="flex flex-col text-sm font-medium">
        Kommentar
        <textarea
          name="comment"
          defaultValue={entry.comment ?? ""}
          rows={3}
          className="rounded-md border border-slate-300 px-3 py-2 font-normal"
        />
      </label>

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded-md bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? "Lagrer..." : "Lagre"}
      </button>

      {failed && (
        <p role="alert" className="text-sm text-red-600">
          {failed.message} {details.join(" ")}
        </p>
      )}
    </form>
  );
}