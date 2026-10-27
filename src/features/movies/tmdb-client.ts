export async function searchMovies(
  query: string,
  token: string,
): Promise<unknown> {
  const url = new URL("https://api.themoviedb.org/3/search/movie");
  url.searchParams.set("query", query);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`TMDB-søket feilet: ${response.status}`);
  }

  return response.json();
}