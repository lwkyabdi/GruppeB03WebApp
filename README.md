# MovieMate

Webapplikasjon for MovieMate, bygget med RedwoodSDK, React 19 og Drizzle/D1.
Lar brukeren søke etter filmer, lagre dem i en watchlist, markere favoritter,
og gi egen rating og kommentar.

## Krav

- Node.js 22.12 eller nyere
- npm 11 eller nyere

## Komme i gang

```bash
npm install
npm run dev
```

Åpne `http://localhost:5173` i nettleseren.
# MovieMate

MovieMate lar brukeren søke etter filmer fra TMDB og lagre dem i en personlig watchlist.
Filmene kan få status, egen rating, kommentar og favorittmarkering.

## Komme i gang

Du trenger Node.js 22.12 eller nyere og npm 11 eller nyere.
Kjør kommandoene fra prosjektmappen.

1. Installer pakkene:

   ```bash
   npm install
   ```

2. Opprett .dev.vars i prosjektroten, med de samme variablene som i .dev.vars.example:

   ```env
   BETTER_AUTH_SECRET=din_lange_tilfeldige_hemmelighet
   BETTER_AUTH_URL=http://localhost:5173
   TMDB_READ_ACCESS_TOKEN=ditt_tmdb_read_access_token
   ```


3. Opprett databasetabellene og start appen:

   ```bash
   npm run migrate:dev
   yoour database may not be available to serve requests during the migration, trykk Y 
   npm run dev
   ```

Åpne http://localhost:5173 og registrer en bruker. Databasen er tom første gang.
Senere holder det normalt å kjøre npm run dev. Kjør migrasjoner igjen når gruppen
har lagt til nye. Lokal kjøring krever ikke publisering til Cloudflare.

## Hovedflyt

Registrer deg → logg inn → søk etter en film → åpne filmdetaljer → legg til i
watchlist. I watchlisten kan du redigere status, rating og kommentar, markere
favoritter og filtrere listen. Dataene beholdes når siden eller serveren startes på nytt.

## Tester

Enhets-, komponent- og integrasjonstester:

```bash
npm test
```

Nettlesertester med Playwright:

```bash
npx playwright install chromium
npm run test:e2e
```

Chromium installeres bare første gang. Bruk npm run test:e2e:headed for å se
nettleseren. Playwright starter serveren selv eller bruker den som kjører på port 5173.
E2e krever ferdig oppsett av .dev.vars og lokal database, samt tilgang til TMDB.
Testen oppretter lokale testbrukere.

| Testtype | Hva som testes |
| --- | --- |
| Enhet | Zod-validering, TMDB-service med falsk klient og hjelpefunksjoner |
| Komponent | Header og watchlist-filter |
| Integrasjon | Watchlist-service mot SQLite: lagring, duplikater og eierskap |
| E2e | Registrering, innlogging, søk, watchlist og favoritter |

Typekontroll og bygg:

```bash
npm run lint
npm run build
```

## Kodeoversikt

| Plassering | Innhold |
| --- | --- |
| src/worker.tsx | Registrerer sider, API-ruter og tilgangskontroll |
| src/app/ | Felles layout, navigasjon, forside og styling |
| src/features/movies/ | TMDB-kall, validering, filmsøk og filmdetaljer |
| src/features/auth/ | Registrering, innlogging og sesjoner |
| src/features/watchlist/ | Komponenter, API, server actions, service og repository |
| src/db/ og drizzle/migrations/ | Databaseskjema, tilkobling og SQL-migrasjoner |
| e2e/ | Playwright-tester. Vitest-testene ligger ved kildekoden |

## Arkitekturvalg

- **Funksjoner samlet i mapper:** Watchlist er delt i controller, service og repository,
  slik at HTTP, regler og databasekall har hvert sitt ansvar.
- **Server og klient:** RedwoodSDK henter filmdata på serveren. React-klientkomponenter
  håndterer interaksjon, og server actions brukes til watchlist-endringer.
- **Validering og tilgang:** Zod validerer eksterne data, better-auth håndterer
  innlogging, og servicen kontrollerer eierskap. Data lagres med Drizzle i D1.


