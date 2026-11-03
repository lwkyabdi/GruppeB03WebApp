import { Suspense } from "react";
import { requestInfo } from "rwsdk/worker";
import { requireActionUser } from "@/features/auth/auth-guard";
import { WatchlistFilter } from "../components/WatchlistFilter";
import { WatchlistList } from "../components/WatchlistList";
import { parseParams, type Params } from "../utils/parse-params";
import { service } from "../watchlist-service";

export async function WatchlistPage() {
  const params = parseParams(requestInfo.request);

  return (
    <main className="mx-auto max-w-2xl p-4 sm:p-8">
      <h1 className="text-3xl font-bold">Min watchlist</h1>
      <WatchlistFilter params={params} />
      <Suspense fallback={<ListSkeleton />}>
        <Entries params={params} />
      </Suspense>
    </main>
  );
}

async function Entries({ params }: { params: Params }) {
  const auth = requireActionUser(requestInfo.ctx.user);
  if (!auth.ok) return <p role="alert">{auth.error.message}</p>;

  const result = await service.list(auth.user.id, params);

  if (!result.ok) {
    const details = Object.values(result.error.fieldErrors ?? {}).flat();
    return (
      <p role="alert">
        Klarte ikke å hente watchlisten: {result.error.message} {details.join(" ")}
      </p>
    );
  }

  return <WatchlistList entries={result.data} />;
}

function ListSkeleton() {
  return (
    <ul className="animate-pulse space-y-2" aria-busy="true">
      {[1, 2, 3].map((n) => (
        <li key={n} className="h-16 rounded-md bg-slate-100" />
      ))}
    </ul>
  );
}