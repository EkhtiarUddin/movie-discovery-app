'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Calendar, Bookmark, BookmarkCheck } from 'lucide-react';
import { type MovieDetails, type Movie, type Cast } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { formatDate, formatRuntime, formatRating } from '@/lib/utils';
import { storage } from '@/lib/storage';
import { useWatchLater } from '@/hooks/useStorage';
import MovieGrid from '@/components/movie/MovieGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

export default function MovieDetailsPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isInWatchLater, toggleWatchLater } = useWatchLater(movieId);

  useEffect(() => {
    async function loadMovieData() {
      try {
        setLoading(true);
        setError(null);

        const [movieData, creditsData] = await Promise.all([
          tmdbApi.getMovieDetails(movieId),
          tmdbApi.getMovieCredits(movieId),
        ]);

        setMovie(movieData);
        setCast(creditsData.cast.slice(0, 12));

        storage.addToRecentlyViewed(movieId);

        const genreIds = movieData.genres.map((g) => g.id);
        if (genreIds.length > 0) {
          const similarData = await tmdbApi.getRecommendationsByGenre(genreIds, 1);
          const filtered = similarData.results.filter((m) => m.id !== movieId).slice(0, 12);
          setSimilarMovies(filtered);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load movie details');
      } finally {
        setLoading(false);
      }
    }

    loadMovieData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error || 'Movie not found'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
        {movie.backdrop_path && (
          <>
            <Image
              src={tmdbApi.getBackdropUrl(movie.backdrop_path, 'original')}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-gray-950 via-gray-50/80 dark:via-gray-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          </>
        )}

        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-8">
            <div className="flex flex-col md:flex-row gap-8 items-end">
              <div className="relative w-48 md:w-64 lg:w-72 aspect-[2/3] rounded-xl overflow-hidden shadow-2xl flex-shrink-0 border-4 border-white/20 dark:border-gray-800/20">
                {movie.poster_path ? (
                  <Image
                    src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    <span className="text-gray-400 dark:text-gray-600 text-sm">No Poster</span>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 text-white drop-shadow-lg">
                  {movie.title}
                </h1>
                {movie.tagline && (
                  <p className="text-lg md:text-xl text-gray-300 italic mb-4">
                    &quot;{movie.tagline}&quot;
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  {movie.vote_average > 0 && (
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg">
                      <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                      <div className="flex flex-col">
                        <span className="font-bold text-lg text-white">
                          {formatRating(movie.vote_average)}
                        </span>
                        <span className="text-xs text-gray-300">
                          ({movie.vote_count.toLocaleString()} votes)
                        </span>
                      </div>
                    </div>
                  )}

                  {movie.runtime > 0 && (
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}

                  {movie.release_date && (
                    <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg text-white">
                      <Calendar className="w-4 h-4" />
                      <span className="font-medium">{formatDate(movie.release_date)}</span>
                    </div>
                  )}

                  <button
                    onClick={() => toggleWatchLater()}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      isInWatchLater
                        ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                    }`}
                  >
                    {isInWatchLater ? (
                      <>
                        <BookmarkCheck className="w-5 h-5" />
                        <span className="hidden sm:inline">In Watch Later</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-5 h-5" />
                        <span className="hidden sm:inline">Add to Watch Later</span>
                      </>
                    )}
                  </button>
                </div>

                {movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {movie.genres.map((genre) => (
                      <Link
                        key={genre.id}
                        href={`/genre/${genre.id}`}
                        className="px-3 py-2 bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-lg text-sm font-medium text-white transition-colors border border-white/10"
                      >
                        {genre.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Overview</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl">
            {movie.overview || 'No overview available.'}
          </p>
        </section>

        {cast.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <div key={actor.id} className="group">
                  <div className="relative aspect-[2/3] mb-3 rounded-lg overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                    {actor.profile_path ? (
                      <Image
                        src={tmdbApi.getImageUrl(actor.profile_path, 'w200')}
                        alt={actor.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-gray-400 dark:text-gray-600 text-sm">No Photo</span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-white mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {actor.name}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {similarMovies.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Similar Movies</h2>
              {movie.genres.length > 0 && (
                <Link
                  href={`/genre/${movie.genres[0].id}`}
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  View more in {movie.genres[0].name} →
                </Link>
              )}
            </div>
            <MovieGrid movies={similarMovies} />
          </section>
        )}
      </div>
    </div>
  );
}
