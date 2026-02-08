import { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { tmdbApi } from '@/lib/tmdb';
import MovieGrid from '@/components/movie/MovieGrid';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import ErrorMessage from '@/components/ui/ErrorMessage';

async function TopRatedSection() {
  const topRatedData = await tmdbApi.getTopRatedMovies(1).catch(() => null);
  const genresData = await tmdbApi.getGenres().catch(() => null);

  if (!topRatedData || !genresData) {
    return <ErrorMessage message="Failed to load top rated movies" />;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Top Rated Movies</h2>
      </div>
      <MovieGrid movies={topRatedData.results.slice(0, 12)} genres={genresData.genres} />
    </section>
  );
}

async function GenreSection({ genreId, genreName }: { genreId: number; genreName: string }) {
  const moviesData = await tmdbApi.getMoviesByGenre(genreId, 1, 'popularity.desc').catch(() => null);
  const genresData = await tmdbApi.getGenres().catch(() => null);

  if (!moviesData || !genresData) {
    return null;
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{genreName}</h2>
        <Link
          href={`/genre/${genreId}`}
          className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
        >
          View All
          <ChevronRight className="w-5 h-5" />
        </Link>
      </div>
      <MovieGrid movies={moviesData.results.slice(0, 5)} genres={genresData.genres} />
    </section>
  );
}

export default async function HomePage() {
  const genresData = await tmdbApi.getGenres().catch(() => null);

  if (!genresData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Failed to load genres" />
      </div>
    );
  }

  const genres = genresData.genres;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary-600 via-red-600 to-pink-600 bg-clip-text text-transparent">
          Discover Your Next Favorite Movie
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Explore thousands of movies, from timeless classics to the latest blockbusters
        </p>
      </div>

      {/* Top Rated Movies */}
      <Suspense fallback={<LoadingSkeleton />}>
        <TopRatedSection />
      </Suspense>

      {/* Genre Sections */}
      <div className="space-y-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Browse by Genre</h2>
          <Link
            href="/genres"
            className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:gap-2 transition-all"
          >
            All Genres
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        {genres.slice(0, 6).map((genre) => (
          <Suspense key={genre.id} fallback={<LoadingSkeleton />}>
            <GenreSection genreId={genre.id} genreName={genre.name} />
          </Suspense>
        ))}
      </div>
    </div>
  );
}
