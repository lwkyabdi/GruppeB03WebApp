// Lagd dummy komponent for å vise filmkort.

type MovieCardProps = {
  title: string;
  rating?: number;
};

export function MovieCard({ title, rating }: MovieCardProps) {
  return (
    <div className="movie-card">
      <div className="movie-card-poster">Ingen plakat</div>
      <h3 className="movie-card-title">{title}</h3>
      <p className="movie-card-rating">Rating: {rating ?? "–"}</p>
    </div>
  );
}