import { z } from "zod";

export const tmdbMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string(),
  overview: z.string(),
  poster_path: z.string().nullable(),
  release_date: z.string(),
});

export const tmdbSearchSchema = z.object({
  results: z.array(tmdbMovieSchema),
});

export type Movie = z.infer<typeof tmdbMovieSchema>;
