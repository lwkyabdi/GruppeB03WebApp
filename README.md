# MovieMate (webapp)

MovieMate er en liste over filmer du vil se, ser på og har sett. Du søker i TMDB, legger filmer i din egen watchlist, setter status, vurdering og kommentar, og markerer favoritter. Dette repoet er webappen og backend-en. Mobilappen ligger i et eget repo og bruker det samme API-et (se `API.md`).

Gruppe B03, Webapplikasjoner 2026.

---

## Teknologi

| Del | Valg | Hvorfor |
| --- | --- | --- |
| Rammeverk | RedwoodSDK (React 19, server- og klientkomponenter) | Krav i faget. Serverkomponenter henter data direkte, klientkomponenter brukes bare der det er state og hendelser |
| Kjøremiljø | Cloudflare Workers (`workerd`) | Krav i faget. Koden kjører ikke i Node, så `fs` og `process` finnes ikke |
| Database | Cloudflare D1 (SQLite) med Drizzle ORM | Typesikre spørringer og migrasjoner. Lokalt er D1 en fil under `.wrangler/` |
| Innlogging | better-auth | Passordhashing, sesjoner og cookies er vanskelig å gjøre trygt selv. Bearer-plugin for mobilappen |
| Validering | Zod | Alt som kommer utenfra (skjema, API-kall, TMDB-svar) valideres med `safeParse` |
| Ekstern kilde | TMDB | Filmdata. Kalles fra serveren, så nøkkelen ikke havner hos klienten |
| Styling | Tailwind 4 og vanlig CSS (`src/app/styles.css`) | |
| Id-er | nanoid | Korte, URL-trygge id-er |
| Tester | Vitest, Testing Library, happy-dom, better-sqlite3, Playwright | Se «Tester» |

---

## Krav

| | Versjon | Sjekk med |
| --- | --- | --- |
| Node.js | 22.12 eller nyere (24 anbefalt) | `node -v` |
| npm | 11 eller nyere | `npm -v` |

Du trenger ingen Cloudflare-konto. Databasen kjører lokalt.

---

## Kom i gang

**1. Installer**

```bash
npm install
```

**2. Lag `.dev.vars` (hemmeligheter, ligger ikke i git)**

```bash
cp .dev.vars.example .dev.vars          # Git Bash / macOS / Linux
Copy-Item .dev.vars.example .dev.vars   # PowerShell
```

Fyll ut filen:

```
BETTER_AUTH_SECRET=<lang tilfeldig tekst>
BETTER_AUTH_URL=http://localhost:5173
TMDB_READ_ACCESS_TOKEN=<ditt TMDB-token>
```

- Lag en hemmelighet: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- TMDB-token: lag en gratis konto på themoviedb.org, gå til Settings → API, og kopier **API Read Access Token** (den lange teksten, ikke den korte API-nøkkelen).
- Uten TMDB-token starter appen, men filmsøk og forsiden viser en feilmelding.

**3. Generer typene for miljøvariablene**

```bash
npm run generate
```

**4. Lag tabellene i den lokale databasen**

```bash
npm run migrate:dev
```

**5. Start**

```bash
npm run dev
```

Åpne `http://localhost:5173`. Appen har ingen ferdige brukere, så trykk «Registrer deg» for å lage en.

Prøv hovedflyten: registrer deg, søk etter en film, åpne den, legg den til i watchlisten, se den på `/watchlist`, endre status, vurdering og kommentar, trykk på ★, og slett den.

---

## Kommandoer

| Kommando | Hva den gjør |
| --- | --- |
| `npm run dev` | Utviklingsserver på port 5173 |
| `npm run lint` | Typesjekk (`tsc --noEmit`) |
| `npm test` | Kjører alle Vitest-testene én gang |
| `npm run test:watch` | Kjører testene på nytt når du lagrer |
| `npm run test:e2e` | Playwright i ekte nettleser (første gang: `npx playwright install chromium`) |
| `npm run migrate:new` | Lager en migrasjon fra endringer i `src/db/schema/` |
| `npm run migrate:dev` | Kjører migrasjonene mot den lokale databasen |
| `npm run generate` | Oppdaterer typene etter endring i `wrangler.jsonc` eller `.dev.vars` |
| `npm run build` | Bygger for produksjon |

---

## Tester

```bash
npm test
```

Vi har valgt bredde, ikke dekningsprosent. Hver type tester noe forskjellig:

| Type | Fil | Hva den sjekker, og hvorfor |
| --- | --- | --- |
| Enhet | `watchlist/__tests__/validate-entry.test.ts` | Reglene for rating (1-10), tittel og kommentar. Ren funksjon, kjører på millisekunder |
| Enhet | `lib/__tests__/http.test.ts` | At feilkoder blir riktig HTTP-status, og at `jsonResult` sender riktig format. Alle API-svar går gjennom den |
| Enhet | `lib/__tests__/id.test.ts` | Id-generatoren gir unike og URL-trygge id-er |
| Enhet | `movies/tmdb.schema.test.ts` | At TMDB-svar som ikke har forventet form blir avvist |
| Service | `watchlist/__tests__/watchlist-service.test.ts` | Servicen mot en ekte SQLite-database i minnet: opprett og se igjen, duplikat gir 409, ugyldig rating gir 400, og **bruker B kan ikke endre eller slette bruker A sin oppføring (403)**. Eierskapssjekken er det viktigste å teste |
| Service | `movies/movie-service.test.ts` | Filmtjenesten med en falsk TMDB-klient, slik at testen ikke bruker nettverk |
| Komponent | `watchlist/__tests__/WatchlistFilter.test.tsx` | At filteret viser det som står i URL-en og sender riktige parametere |
| Komponent | `app/components/layout/__tests__/Header.test.tsx` | At headeren viser riktig innhold |
| e2e | `e2e/` | Playwright i ekte nettleser |

Komponenttester må ha `// @vitest-environment happy-dom` øverst, ellers finnes ikke DOM-en. Resten kjører i Node.

Service-testene bruker `better-sqlite3` mot en database i minnet, og samme migrasjoner som appen. De tester derfor den ekte koden i servicen og repository, uten å starte serveren.

E2e-testene starter dev-serveren selv. Første gang må nettleseren lastes ned:

```bash
npx playwright install chromium
npm run test:e2e
```

---

## Hvordan koden henger sammen

```
src/
├─ worker.tsx              inngangspunkt: middleware, API-ruter og sider
├─ client.tsx              starter React i nettleseren
├─ app/                    felles skall og delt UI (Document, Header, Navigation, forside, headere)
├─ db/                     Drizzle: schema/, relations.ts, index.ts
├─ lib/                    felles hjelpere: result.ts (Result-typen), http.ts, id.ts
└─ features/
   ├─ auth/                innlogging og autorisasjon (better-auth)
   ├─ watchlist/           brukerens filmliste
   └─ movies/              søk mot TMDB
e2e/                       Playwright-tester
drizzle/migrations/        én mappe per migrasjon. Rediger aldri en som har kjørt
```

### Lagene i en feature

Hver feature er bygd likt, og hvert lag har ett ansvar:

| Lag | Fil (watchlist som eksempel) | Ansvar |
| --- | --- | --- |
| routes | `watchlist-routes.ts` | Hvilken URL og metode som går til hvilken funksjon, og hvilken middleware som kjører først |
| controller | `watchlist-controller.ts` | Tar imot requesten, sender response med riktig statuskode |
| service | `watchlist-service.ts` | Forretningsreglene: validering, og at du bare kan endre dine egne oppføringer |
| repository | `watchlist-repository.ts` | Eneste sted som snakker med databasen |
| mapper | `watchlist-mapper.ts` | Gjør en databaserad om til DTO, og sender ikke ut `userId` |
| actions | `actions.ts` | Server actions: samme service, kalt fra skjemaer i nettleseren |

Servicen brukes av tre innganger: REST-API-et (mobilappen bruker det), server actions (webskjemaene) og serverkomponentene (sidene). Reglene finnes derfor bare ett sted.

### Eksempel: «slett oppføring»

`DELETE /api/v1/watchlist/:id` går gjennom `requireUser` (401 hvis du ikke er innlogget), `controller.remove`, `service.remove` (404 hvis oppføringen ikke finnes, 403 hvis den tilhører en annen), `repository.remove`, og svarer 204.

### Feilformat

Alle feil har samme form, `{ ok: false, error: { code, message, fieldErrors } }`. `lib/result.ts` definerer feilkodene, og `lib/http.ts` gjør dem om til HTTP-status.

---

## Innlogging og tilgang

better-auth lager registrering, innlogging og utlogging under `/api/auth/*`. Tre lag beskytter dataene:

1. **Sidene** krever innlogging. `requireUserPage` sender andre til `/login`.
2. **API-et** krever innlogging. `requireUser` svarer 401.
3. **Eierskap** sjekkes i servicen. Du får 403 hvis du prøver å endre en annens oppføring. Server actions kaller `requireActionUser` først.

`setUser` kjører på hver forespørsel og setter `ctx.user` fra sesjonen. Nettleseren bruker cookie, mobilappen bruker bearer-token (se `API.md`).

---

## Database

| Tabell | Innhold |
| --- | --- |
| `users`, `session`, `account`, `verification` | better-auth sine tabeller. Id-ene er tekst |
| `watchlist_entry` | Vår egen. En rad per film per bruker, med status, rating, favoritt og kommentar. Unik på `(user_id, tmdb_id)`, så samme film ikke kan legges til to ganger |

Favoritter er ikke en egen tabell, men `favorite = true` på samme liste.

Slik endrer du skjemaet:

1. Endre en tabell i `src/db/schema/`
2. `npm run migrate:new`
3. `npm run migrate:dev`

Er databasen i en rar tilstand, slett den lokale filen og start på nytt:

```powershell
Remove-Item -Recurse -Force .wrangler    # PowerShell
rm -rf .wrangler                         # Git Bash
npm run migrate:dev
```

Da forsvinner også brukerne du har registrert lokalt.

---

## API

Alle endepunkter, felt og statuskoder står i [`API.md`](./API.md).

---

## Mobilappen

Mobilappen ligger i et eget repo og bruker dette API-et. For å kjøre den mot din lokale backend:

1. Start webappen slik at den er tilgjengelig på nettverket: `npm run dev -- --host`
2. Sett `EXPO_PUBLIC_API_URL` i mobil-repoet til adressen til maskinen som kjører webappen (se README i mobil-repoet).

Windows spør om brannmur første gang. Tillat private nettverk.

---

## Deploy (valgfritt)

Appen skal kjøre lokalt etter stegene over. For å publisere den på Cloudflare, se [`DEPLOY.md`](./DEPLOY.md).

---

## Når noe ikke virker

| Problem | Løsning |
| --- | --- |
| Porten er opptatt | Noe annet kjører på 5173. Stopp det, eller `npm run dev -- --port 5174` |
| `no such table` | `npm run migrate:dev` er ikke kjørt, eller `.wrangler/` ble slettet etterpå |
| TypeScript finner ikke `env.BETTER_AUTH_SECRET` | `npm run generate`, og start TypeScript på nytt i VS Code |
| Innlogging feiler | Sjekk at `.dev.vars` finnes og har `BETTER_AUTH_SECRET`. Start dev-serveren på nytt etter endringer |
| «new version of the pre-bundle» ved oppstart | Slett `node_modules/.vite` og start på nytt |
| Filmsøk gir feil | Mangler `TMDB_READ_ACCESS_TOKEN`, eller du har brukt den korte API-nøkkelen |
| Testene klager på `better-sqlite3` | Slett `node_modules` og kjør `npm install` på nytt |
| Playwright finner ingen nettleser | `npx playwright install chromium` |
| `npm run release` feiler i PowerShell | Scriptet bruker `rm -rf`. Bruk Git Bash, eller se `DEPLOY.md` |

Windows: legg prosjektet på en kort sti (for eksempel `C:\dev\`), ikke i OneDrive, siden synkronisering kan låse filer i `node_modules` og `.wrangler`.

---

## KI-bruk

Hvordan vi har brukt KI står i [`KI-LOGG.md`](./KI-LOGG.md), og avtalen vi jobbet etter i [`KI-avtale.md`](./KI-avtale.md).
