'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { type Movie, type Genre } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadGenres() {
      try {
        const { genres: genreList } = await tmdbApi.getGenres();
        setGenres(genreList);
      } catch (err) {
        console.error('Failed to load genres:', err);
      }
    }
    loadGenres();
  }, []);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setMovies([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tmdbApi.searchMovies(searchQuery, 1);
      setMovies(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search movies');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!query.trim()) {
      setMovies([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      performSearch(query);
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Search className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Search Results</h1>
        </div>

        {query ? (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {loading
              ? `Searching for "${query}"...`
              : movies.length === 0
              ? `No results found for "${query}"`
              : `Found ${movies.length} ${movies.length === 1 ? 'result' : 'results'} for "${query}"`}
          </p>
        ) : (
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Enter a search query above to find movies
          </p>
        )}
      </div>

      {!query ? (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">Search Movies</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Type a movie title in the search bar above to find movies
            </p>
          </div>
        </div>
      ) : loading ? (
        <LoadingSkeleton />
      ) : error ? (
        <ErrorMessage message={error} retry={() => performSearch(query)} />
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} genres={genres} />
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
            <Search className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">No Results Found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We couldn&apos;t find any movies matching &quot;{query}&quot;
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Try different keywords or check the spelling
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
