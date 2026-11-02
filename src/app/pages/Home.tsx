import { env } from "cloudflare:workers";
import { MovieCard } from "@/features/movies/components/MovieCard";
import { getPopularMovies } from "@/features/movies/movie-service";
import type { Movie } from "@/features/movies/tmdb-schema";

export async function Home() {
  let movies: Movie[] = [];
  let error = "";

  if (!env.TMDB_READ_ACCESS_TOKEN) {
    error = "Filmvisningen er ikke konfigurert.";
  } else {
    try {
      movies = await getPopularMovies(env.TMDB_READ_ACCESS_TOKEN);
    } catch {
      error = "Kunne ikke hente populære filmer. Prøv igjen senere.";
    }
  }

  return (
    <main>
      <h1>MovieMate</h1>
      <p>Finn filmer og bygg din egen watchlist.</p>
      <a href="/search">Finn en film</a>

      <h2>Populære filmer</h2>
      {error && <p role="alert">{error}</p>}
      {!error && movies.length === 0 && <p>Ingen filmer å vise akkurat nå.</p>}
      <ul>
        {movies.slice(0, 6).map((movie) => (
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
    </main>
  );
}
