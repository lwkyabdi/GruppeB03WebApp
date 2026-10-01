import { MovieCard } from "../components/movie/MovieCard";

export function Home() {
  return (
    <main className="mx-auto max-w-2xl p-8 font-sans">
      <h1 className="text-3xl font-bold">MovieMate</h1>
      <p className="mt-2 text-slate-600">Din personlige filmtracker</p>

      <MovieCard title="Inception" rating={5.0} />

      <MovieCard title="Tenet" rating={10.0} />

      <MovieCard title="The Dark Knight" rating={9.0} />

      <MovieCard title="The Truman Show" rating={8.0} />
    </main>
  );
}
