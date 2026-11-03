"use server";

import { requestInfo } from "rwsdk/worker";
import { requireActionUser } from "@/features/auth/auth-guard";
import type { Result } from "@/lib/result";
import type { WatchlistDTO } from "./watchlist-mapper";
import { service } from "./watchlist-service";

// Server actions går ikke gjennom rute-mellomvare, så hver action sjekker
// innlogging selv. Eierskap (403) sjekkes i servicen.

export async function addToWatchlist(input: {
  tmdbId: number;
  title: string;
  posterPath: string | null;
}): Promise<Result<WatchlistDTO>> {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return auth;

  return service.create(auth.user.id, input);
}

// Skjema for status, rating og kommentar. Tom rating betyr «ikke vurdert».
export async function updateEntryAction(
  _prevState: Result<WatchlistDTO> | null,
  formData: FormData,
): Promise<Result<WatchlistDTO>> {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return auth;

  const rating = String(formData.get("rating") ?? "");

  return service.update(auth.user.id, String(formData.get("id") ?? ""), {
    status: String(formData.get("status") ?? ""),
    rating: rating === "" ? null : Number(rating),
    comment: String(formData.get("comment") ?? ""),
  });
}

export async function toggleFavorite(
  id: string,
  favorite: boolean,
): Promise<Result<WatchlistDTO>> {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return auth;

  return service.update(auth.user.id, id, { favorite });
}

export async function removeEntry(id: string): Promise<Result<void>> {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return auth;

  return service.remove(auth.user.id, id);
}