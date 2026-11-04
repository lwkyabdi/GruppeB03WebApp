import { env } from "cloudflare:workers";
import { z } from "zod";
import { getMovieDetails } from "../movie-service";
import type { Movie } from "../tmdb-schema";
import { AddToWatchlistButton } from "@/features/watchlist/components/AddToWatchlistButton";

const movieIdSchema = z.coerce.number().int().positive();

type MovieDetailsPageProps = {
  params: { id: string };
  response: ResponseInit;
};

export async function MovieDetailsPage({ params, response }: MovieDetailsPageProps) {
  const id = movieIdSchema.safeParse(params.id);
  let movie: Movie | null = null;
  let error = "";

  if (!id.success) {
    response.status = 400;
    error = "Ugyldig film-ID.";
  } else if (!env.TMDB_READ_ACCESS_TOKEN) {
    response.status = 500;
    error = "Filmvisningen er ikke konfigurert.";
  } else {
    try {
      movie = await getMovieDetails(id.data, env.TMDB_READ_ACCESS_TOKEN);
      if (!movie) {
        response.status = 404;
        error = "Filmen finnes ikke.";
      }
    } catch {
      response.status = 502;
      error = "Kunne ikke hente filmen. Prøv igjen senere.";
    }
  }

  return (
    <main className="page-container">
      {error && <p role="alert" className="error-message">{error}</p>}
      {movie && (
        <article className="movie-details">
          {movie.poster_path ? (
            <img
              className="movie-poster"
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Filmplakat for ${movie.title}`}
              width={500}
              height={750}
            />
          ) : (
            <div className="movie-poster poster-placeholder">Ingen plakat tilgjengelig</div>
          )}
          <div>
            <h1>{movie.title}</h1>
            <p className="movie-year">
              {movie.release_date ? movie.release_date.slice(0, 4) : "Utgivelsesår ukjent"}
            </p>
            <p className="movie-rating">TMDB-rating: {movie.vote_average.toFixed(1)} / 10</p>
            <h2>Om filmen</h2>
            <p>{movie.overview || "Ingen beskrivelse tilgjengelig."}</p>
            <AddToWatchlistButton
              movie={{
                tmdbId: movie.id,
                title: movie.title,
                posterPath: movie.poster_path,
              }}
            />
          </div>
        </article>
      )}
    </main>
  );
}
