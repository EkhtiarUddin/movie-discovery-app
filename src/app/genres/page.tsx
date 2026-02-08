import Link from 'next/link';
import { Film } from 'lucide-react';
import { tmdbApi } from '@/lib/tmdb';
import ErrorMessage from '@/components/ui/ErrorMessage';

export const metadata = {
  title: 'Browse Genres - CineDiscover',
  description: 'Explore movies by genre',
};

export default async function GenresPage() {
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
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Browse by Genre</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Explore movies organized by genre</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {genres.map((genre) => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}`}
            className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-red-600 p-6 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="relative z-10">
              <Film className="w-8 h-8 mb-3 opacity-90" />
              <h3 className="text-xl font-semibold">{genre.name}</h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </Link>
        ))}
      </div>
    </div>
  );
}
