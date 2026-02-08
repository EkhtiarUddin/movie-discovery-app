'use client';

import { useEffect, useState } from 'react';
import { type Movie, type Genre } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { useWatchLater } from '@/hooks/useStorage';
import MovieGrid from '@/components/movie/MovieGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function WatchLaterPage() {
  const { watchLaterIds } = useWatchLater();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMovies() {
      if (watchLaterIds.length === 0) {
        setMovies([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { genres: genreList } = await tmdbApi.getGenres();
        setGenres(genreList);

        const moviePromises = watchLaterIds.map((id) => tmdbApi.getMovieDetails(id));
        const movieData = await Promise.all(moviePromises);

        const moviesWithGenreIds = movieData.map((movie) => ({
          ...movie,
          genre_ids: movie.genres.map((g) => g.id),
        }));

        setMovies(moviesWithGenreIds);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load watch later movies');
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [watchLaterIds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Watch Later</h1>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-white">Watch Later</h1>
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Watch Later</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {movies.length === 0
            ? 'No movies in your watch later list'
            : `${movies.length} ${movies.length === 1 ? 'movie' : 'movies'} saved`}
        </p>
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">Your watch later list is empty</p>
          <p className="text-gray-500 dark:text-gray-500">
            Browse movies and click the bookmark icon to add them here
          </p>
        </div>
      ) : (
        <MovieGrid movies={movies} genres={genres} />
      )}
    </div>
  );
}
