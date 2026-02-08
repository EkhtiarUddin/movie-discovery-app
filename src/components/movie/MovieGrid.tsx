'use client';

import { type Movie, type Genre } from '@/types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  movies: Movie[];
  genres?: Genre[];
}

export default function MovieGrid({ movies, genres }: MovieGridProps) {
  const getGenreNames = (genreIds?: number[]) => {
    if (!genres || !genreIds) return [];
    return genreIds
      .map((id) => genres.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[];
  };

  if (movies.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No movies found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          genreNames={getGenreNames(movie.genre_ids)}
        />
      ))}
    </div>
  );
}
