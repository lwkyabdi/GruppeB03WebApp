import { Suspense } from "react";
import { requestInfo } from "rwsdk/worker";
import { requireActionUser } from "@/features/auth/auth-guard";
import { WatchlistFilter } from "../components/WatchlistFilter";
import { WatchlistList } from "../components/WatchlistList";
import { parseParams, type Params } from "../utils/parse-params";
import { service } from "../watchlist-service";

export async function FavoritesPage() {
  const params = parseParams(requestInfo.request);

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Favoritter</h1>
      <WatchlistFilter params={params} action="/favorites" />
      <Suspense fallback={<p aria-busy="true">Laster…</p>}>
        <Favorites params={params} />
      </Suspense>
    </main>
  );
}

async function Favorites({ params }: { params: Params }) {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return <p role="alert">{auth.error.message}</p>;

  // favorite låses til true, uansett hva som står i URL-en
  const result = await service.list(auth.user.id, { ...params, favorite: "true" });

  if (!result.ok) {
    return <p role="alert">Klarte ikke å hente favoritter: {result.error.message}</p>;
  }

  return <WatchlistList entries={result.data} />;
}