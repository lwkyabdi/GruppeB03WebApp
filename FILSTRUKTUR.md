# MovieMate – filstrukturen forklart

- src/worker.tsx: Inngangspunkt på serveren. Registrerer sider, API-ruter og tilgangskontroll.
- src/client.tsx: Starter RedwoodSDK i nettleseren.
- src/app/Document.tsx: HTML-dokumentet som laster stilark og klientkode.
- src/app/headers.ts: Setter HTTP-sikkerhetsheadere.
- src/app/styles.css: Felles styling og mobiltilpasning.
- src/app/pages/Home.tsx: Forsiden med populære filmer.
- src/app/components/layout/: Felles sideoppsett, header og navigasjon.
- src/app/components/ui/Button.tsx: Gjenbrukbar knapp.
- src/features/movies/: TMDB-klient, Zod-validering, service og søke-API.
  - pages/: Filmsøk og filmdetaljer.
  - components/MovieCard.tsx: Filmkort med plakat, informasjon og watchlist-knapp.
- src/features/auth/: Registrering, innlogging, sesjoner og tilgangskontroll.
- src/features/watchlist/: API, server actions, validering, service og databasekall.
  - components/: Liste, filter, redigering og knapper.
  - pages/WatchlistPage.tsx: Watchlist med favorittfilter.
  - pages/FavoritesPage.tsx: Egen favorittside som foreløpig ikke er koblet til en rute.
- src/db/: Drizzle-tilkobling, relasjoner og databaseskjema.
  - seed.ts: Plassholder uten innlegging av data.
- drizzle/migrations/: SQL-migrasjoner for databasen.
- src/lib/: Hjelpere for ID-er, resultater og HTTP-svar.
- src/test/: Felles testoppsett.
- e2e/: Nettlesertester med Playwright. Vitest-testene ligger ved kildekoden.
- types/: Typebeskrivelser for rammeverket og byggeverktøyet.

Når en side åpnes, finner worker.tsx riktig rute. Document.tsx gir HTML-skallet,
AppLayout legger til headeren, og sidekomponenten viser innholdet.
Serverkode henter og validerer data. Klientkomponenter håndterer brukerens handlinger.