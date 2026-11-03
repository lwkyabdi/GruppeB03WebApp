import type { WatchlistDTO } from "../watchlist-mapper";
import { WatchlistItem } from "./WatchlistItem";

export function WatchlistList({ entries }: { entries: WatchlistDTO[] }) {
  if (entries.length === 0) {
    return (
      <p className="text-slate-500" data-testid="watchlist-empty">
        Ingen filmer her ennå. Søk etter en film og legg den til.
      </p>
    );
  }

  return (
    <ul className="space-y-2" data-testid="watchlist-list">
      {entries.map((entry) => (
        <WatchlistItem key={entry.id} entry={entry} />
      ))}
    </ul>
  );
}