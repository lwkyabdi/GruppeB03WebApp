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
    <article>
      {posterPath ? (
        <img
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={`Filmplakat for ${title}`}
        />
      ) : (
        <div>
          Ingen plakat tilgjengelig
        </div>
      )}
      <div>
        <h3>{title}</h3>
        <p>
          {releaseDate ? releaseDate.slice(0, 4) : "Utgivelsesår ukjent"}
        </p>
        <p>
          TMDB-rating: {rating === undefined ? "–" : `${rating.toFixed(1)} / 10`}
        </p>
      </div>
    </article>
  );
}
