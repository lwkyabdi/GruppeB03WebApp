import { MovieCard } from "../components/MovieCard";
import { env } from "cloudflare:workers";
import { searchMovieResults } from "../movie-service";
import type { Movie } from "../tmdb-schema";

export async function SearchPage({ request }: { request: Request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get("query")?.trim() ?? "";

  let movies: Movie[] = [];
  let error = "";

  if (query) {
    if (!env.TMDB_READ_ACCESS_TOKEN) {
      error = "Filmsøket er ikke konfigurert.";
    } else {
      try {
        movies = await searchMovieResults(
          query,
          env.TMDB_READ_ACCESS_TOKEN,
        );
      } catch {
        error = "Kunne ikke hente filmer. Prøv igjen.";
      }
    }
  }

  return (
    <main>
      <div>
        <h1>Finn din neste film</h1>
        <p>Søk etter filmer og utforsk resultatene fra TMDB.</p>

        <form action="/search" method="get">
          <label htmlFor="movie-search">
            Filmtittel
          </label>
          <div>
            <input
              id="movie-search"
              name="query"
              type="search"
              placeholder="For eksempel Interstellar"
              defaultValue={query}
              required
            />
            <button
              type="submit"
            >
              Søk
            </button>
          </div>
        </form>

        {error && (
          <p role="alert">
            {error}
          </p>
        )}

        {!query && (
          <p>
            Skriv en filmtittel for å søke.
          </p>
        )}

        {query && !error && (
          <section aria-labelledby="search-results">
            <h2 id="search-results">
              Resultater for «{query}»
            </h2>
            {movies.length === 0 ? (
              <p>Ingen filmer funnet. Prøv en annen tittel.</p>
            ) : (
              <ul>
                {movies.map((movie) => (
                  <li key={movie.id}>
                    <MovieCard
                      title={movie.title}
                      rating={movie.vote_average}
                      posterPath={movie.poster_path}
                      releaseDate={movie.release_date}
                    />
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </div>
    </main>
  );
}
