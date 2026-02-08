'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { type Movie, type Genre, type SortOption } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'popularity.asc', label: 'Least Popular' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'release_date.asc', label: 'Oldest First' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'vote_average.asc', label: 'Lowest Rated' },
  { value: 'title.asc', label: 'Title (A-Z)' },
  { value: 'title.desc', label: 'Title (Z-A)' },
];

export default function GenrePage() {
  const params = useParams();
  const genreId = parseInt(params.id as string);

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [genreName, setGenreName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('popularity.desc');

  useEffect(() => {
    async function loadGenres() {
      try {
        const { genres: genreList } = await tmdbApi.getGenres();
        setGenres(genreList);
        const genre = genreList.find((g) => g.id === genreId);
        setGenreName(genre?.name || 'Unknown Genre');
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    }
    loadGenres();
  }, [genreId]);

  useEffect(() => {
    async function loadMovies() {
      try {
        setLoading(true);
        setError(null);

        const response = await tmdbApi.getMoviesByGenre(genreId, page, sortBy);

        if (page === 1) {
          setMovies(response.results);
        } else {
          setMovies((prev) => [...prev, ...response.results]);
        }

        setHasMore(page < response.total_pages);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movies');
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, [genreId, page, sortBy]);

  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    setPage(1);
    setMovies([]);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  if (error && page === 1) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} retry={() => setPage(1)} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{genreName}</h1>

        <div className="flex items-center gap-3">
          <ArrowUpDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortOption)}
            className="px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && page === 1 ? (
        <LoadingSkeleton />
      ) : (
        <>
          <MovieGrid movies={movies} genres={genres} />

          {hasMore && (
            <div className="mt-12 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-8 py-3 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}

          {!hasMore && movies.length > 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400 mt-12">
              You&apos;ve reached the end of the list
            </p>
          )}
        </>
      )}
    </div>
  );
}
