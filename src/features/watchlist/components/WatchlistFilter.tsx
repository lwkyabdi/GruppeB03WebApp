import type { Params } from "../utils/parse-params";

// ?status=watching&favorite=true
export function WatchlistFilter({
  params,
  action = "/watchlist",
}: {
  params: Params;
  action?: string;
}) {
  return (
    <form
      method="get"
      action={action}
      className="mt-6 mb-8 flex flex-wrap items-end gap-2"
      data-testid="watchlist-filter"
    >
      <label className="flex flex-col text-sm font-medium">
        Status
        <select
          name="status"
          defaultValue={params.status ?? ""}
          className="rounded-md border border-slate-300 px-3 py-2 font-normal"
        >
          <option value="">Alle</option>
          <option value="wanted">Vil se</option>
          <option value="watching">Ser nå</option>
          <option value="completed">Ferdig sett</option>
        </select>
      </label>

      <label className="flex flex-col text-sm font-medium">
        Favoritter
        <select
          name="favorite"
          defaultValue={params.favorite ?? ""}
          className="rounded-md border border-slate-300 px-3 py-2 font-normal"
        >
          <option value="">Alle</option>
          <option value="true">Bare favoritter</option>
          <option value="false">Ikke favoritter</option>
        </select>
      </label>

      <button
        type="submit"
        className="rounded-md border border-slate-300 px-4 py-2 hover:bg-slate-50"
      >
        Filtrer
      </button>
      <a className="px-2 py-2 text-sm underline" href={action}>
        Nullstill
      </a>
    </form>
  );
}