export function SearchPage() {
  return (
    <main>
      <h1>Søk etter filmer</h1>

      <form action="/search" method="get">
        <label htmlFor="movie-search">Filmtittel</label>
        <input
          id="movie-search"
          name="query"
          type="search"
          placeholder="Søk"
          required
        />

        <button type="submit">Søk</button>
      </form>
    </main>
  );
}