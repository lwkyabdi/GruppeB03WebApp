type MovieCardProps = {
  title: string;
  rating?: number;
  posterPath?: string | null;
  releaseDate?: string;
};

export function MovieCard({
  title,
  rating,
  posterPath,
  releaseDate,
}: MovieCardProps) {
  return (
    <article className="movie-card">
      {posterPath ? (
        <img className="movie-poster" loading="lazy" width={500} height={750}
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={`Filmplakat for ${title}`}
        />
      ) : (
        <div className="movie-poster poster-placeholder">Ingen plakat tilgjengelig
        </div>
      )}
      <div className="movie-info"><h3>{title}</h3>
        <p className="movie-year">{releaseDate ? releaseDate.slice(0, 4) : "Utgivelsesår ukjent"}
        </p>
        <p className="movie-rating">TMDB-rating: {rating === undefined ? "–" : `${rating.toFixed(1)} / 10`}
        </p>
      </div>
    </article>
  );
}
