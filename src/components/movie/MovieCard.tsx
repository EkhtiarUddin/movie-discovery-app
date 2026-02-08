'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Bookmark, BookmarkCheck } from 'lucide-react';
import { type Movie } from '@/types/movie';
import { tmdbApi } from '@/lib/tmdb';
import { formatRating, getYearFromDate, truncateText } from '@/lib/utils';
import { useWatchLater } from '@/hooks/useStorage';
import { useState } from 'react';

interface MovieCardProps {
  movie: Movie;
  genreNames?: string[];
}

export default function MovieCard({ movie, genreNames }: MovieCardProps) {
  const { isInWatchLater, toggleWatchLater } = useWatchLater(movie.id);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleWatchLaterClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchLater();
  };

  const imageUrl = movie.poster_path && !imageError 
    ? tmdbApi.getImageUrl(movie.poster_path, 'w500')
    : '/images/placeholder-movie.jpg';

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative block overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[2/3] overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
        <Image
          src={imageUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={() => setImageError(true)}
        />

        <button
          onClick={handleWatchLaterClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
            isHovered || isInWatchLater
              ? 'bg-black/80 hover:bg-black'
              : 'bg-black/40 hover:bg-black/60'
          }`}
          aria-label={isInWatchLater ? 'Remove from watch later' : 'Add to watch later'}
        >
          {isInWatchLater ? (
            <BookmarkCheck className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          ) : (
            <Bookmark className="w-5 h-5 text-white" />
          )}
        </button>

        {movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-sm font-semibold text-white">
              {formatRating(movie.vote_average)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="font-semibold text-lg mb-2 text-white">{movie.title}</h3>
            {genreNames && genreNames.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {genreNames.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="text-xs px-2 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            )}
            {movie.overview && (
              <p className="text-sm text-gray-200 line-clamp-2">
                {truncateText(movie.overview, 80)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 group-hover:opacity-0 transition-opacity duration-300 md:group-hover:opacity-100">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 text-gray-900 dark:text-white">
          {movie.title}
        </h3>

        {movie.release_date && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {getYearFromDate(movie.release_date)}
          </p>
        )}

        {genreNames && genreNames.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {genreNames.slice(0, 2).map((genre) => (
              <span
                key={genre}
                className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        {movie.overview && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 hidden md:block">
            {truncateText(movie.overview, 80)}
          </p>
        )}
      </div>
    </Link>
  );
}
