import { searchMovies } from "./tmdb-client";
import { tmdbSearchSchema, type Movie } from "./tmdb-schema";

export async function searchMovieResults(
  query: string,
  token: string,
): Promise<Movie[]> {
  const response = await searchMovies(query, token);
  const result = tmdbSearchSchema.safeParse(response);

  if (!result.success) {
    throw new Error("TMDB returnerte ugyldige filmdata");
  }

  return result.data.results;
}