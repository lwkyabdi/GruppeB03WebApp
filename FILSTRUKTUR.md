# MovieMate – filstrukturen forklart

Dette dokumentet forklarer innholdet i `src/`. Filer merket **tom** har ingen kode ennå. Forklaringen beskriver hva de skal brukes til, ikke funksjonalitet som allerede virker.

- **`src/`**
  Her ligger kildekoden til applikasjonen.

  - **`app/`**
    Inneholder nettsidene, komponentene og utseendet til webappen.

    - **`pages/`**
      Her ligger komponentene som skal vise hele sider. Nye sider må kobles til en nettadresse i `worker.tsx` før de kan åpnes.

      - **`Home.tsx`**
        Den eksisterende forsiden på `/`. Viser nå MovieMate og undertittelen.
      - **`Search.tsx` — tom**
        Skal vise filmsøk og søkeresultater fra TMDB.
      - **`Watchlist.tsx` — tom**
        Skal vise lagrede filmer og statusen deres: skal se, ser nå eller sett.
      - **`Favorites.tsx` — tom**
        Skal vise filmer som er markert som favoritter.
      - **`MovieDetails.tsx` — tom**
        Skal vise detaljer om én film, TMDB-rating og felter for egen rating, kommentar og status.

    - **`components/`**
      Her ligger mindre deler av grensesnittet som sider kan bruke om igjen.

      - **`layout/`**
        Felles deler av sideoppsettet, som toppmeny og navigasjon.

        - **`Header.tsx` — tom**
          Skal vise den synlige toppen av nettsiden, for eksempel appnavnet og navigasjonen.
        - **`Navigation.tsx` — tom**
          Skal inneholde lenkene mellom sidene. Kan brukes inne i `Header`.

      - **`ui/`**
        Små, gjenbrukbare elementer som knapper og inputfelt.

        - **`Button.tsx` — tom**
          Skal gi knappene et felles utseende, med varianter som lagre og fjern.
        - **`SearchInput.tsx` — tom**
          Skal være feltet der man skriver inn et filmsøk.
        - **`StatusBadge.tsx` — tom**
          Skal vise filmens status som et lite merke med tekst og farge.
        - **`RatingInput.tsx` — tom**
          Skal la brukeren velge sin egen rating av filmen.

      - **`movie/`**
        Komponenter som er spesielt laget for å vise filmer.

        - **`MovieCard.tsx` — tom**
          Skal vise en kort presentasjon av én film, for eksempel plakat, tittel og rating.
        - **`MovieGrid.tsx` — tom**
          Skal plassere flere `MovieCard`-komponenter i et rutenett.
        - **`MoviePoster.tsx` — tom**
          Skal vise filmplakaten og håndtere filmer som mangler plakat.

    - **`Document.tsx`**
      Det felles HTML-skallet med `<html>`, `<head>` og `<body>`. Laster stilark og klientkode. `{children}` er innholdet til siden som vises. En felles `Header` kan kobles inn her senere.
    - **`headers.ts`**
      Setter HTTP-sikkerhetsheadere på svar fra serveren. Dette er ikke den synlige headeren eller toppmenyen.
    - **`styles.css`**
      Laster Tailwind. Her kan dere senere legge inn felles farger, tema og egne CSS-regler.

  - **`lib/`**
    Hjelpefunksjoner og kode som kan brukes flere steder i prosjektet.

    - **`tmdb.ts` — tom**
      Skal samle kallene til TMDB, for eksempel filmsøk og filmdetaljer. Kall med API-token skal gjøres fra backenden.
    - **`id.ts`**
      Lager ID-er med `nanoid`. Brukes av starterprosjektets oppgavetabell.
    - **`__tests__/`**
      Tester for hjelpefunksjonene.

      - **`id.test.ts`**
        Tester ID-hjelperen.

  - **`types/`**
    TypeScript-beskrivelser av data som brukes i appen.

    - **`movie.ts` — tom**
      Skal beskrive hvilke felter filmdata har, for eksempel tittel og plakatsti. Typer hjelper under utvikling; de henter ikke data og validerer ikke API-svar alene.

  - **`db/`**
    Eksisterende databaseoppsett fra starterprosjektet. Det er ennå ikke tilpasset MovieMate.

    - **`schema/`**
      Beskriver tabellene og kolonnene i databasen.

      - **`user-schema.ts`**
        Eksempeltabell for brukere med ID, navn og e-post. Gir ikke innlogging i seg selv.
      - **`task-schema.ts`**
        Eksempeltabell for oppgaver som tilhører brukere. Er ikke en filmtabell.
      - **`index.ts`**
        Samler eksportene av tabellene slik at resten av databasekoden kan importere dem fra ett sted.

    - **`index.ts`**
      Setter opp forbindelsen til Cloudflare D1 gjennom Drizzle.
    - **`relations.ts`**
      Beskriver forholdet mellom eksempelbrukerne og oppgavene deres.
    - **`seed.ts`**
      Fyller eksempeldata i databasen når seed-kommandoen kjøres. Tømmer først de eksisterende oppgavene og brukerne.

  - **`test/`**
    Felles oppsett som brukes av testene.

    - **`setup-dom.ts`**
      Setter opp støtte for testing av grensesnitt. Brukes av Vitest-oppsettet.

  - **`client.tsx`**
    Starter RedwoodSDK sin klientkode i nettleseren, slik at interaktive klientkomponenter kan fungere.
  - **`worker.tsx`**
    Inngangspunktet på serveren. Setter opp sikkerhetsheadere og ruter. Kobler nå `/` til `Home` og har API-ruten `/api/status`.

## Hvordan delene henger sammen

Når noen åpner forsiden, finner `worker.tsx` riktig rute. `Document.tsx` gir siden HTML-skallet, og `Home.tsx` leverer selve sideinnholdet. Sidene kan etter hvert bruke komponentene under `components/`.

De nye sidene, komponentene og TMDB-kallene er foreløpig ikke implementert eller koblet sammen. Expo-appen skal ligge i et separat prosjekt og senere bruke HTTP-API-et i denne backenden.
