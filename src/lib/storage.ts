import { type WatchLaterMovie, type RecentlyViewedMovie } from '@/types/movie';

const WATCH_LATER_KEY = 'movie_watch_later';
const RECENTLY_VIEWED_KEY = 'movie_recently_viewed';
const MAX_RECENTLY_VIEWED = 50;

export const storage = {
  getWatchLater: (): number[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(WATCH_LATER_KEY);
      if (!data) return [];

      const movies: WatchLaterMovie[] = JSON.parse(data);
      return movies.map((m) => m.id);
    } catch (error) {
      console.error('Error reading watch later:', error);
      return [];
    }
  },

  addToWatchLater: (movieId: number): void => {
    if (typeof window === 'undefined') return;

    try {
      const current = storage.getWatchLater();
      if (current.includes(movieId)) return;

      const movies: WatchLaterMovie[] = [
        ...current.map((id) => ({ id, addedAt: Date.now() })),
        { id: movieId, addedAt: Date.now() },
      ];
      localStorage.setItem(WATCH_LATER_KEY, JSON.stringify(movies));

      window.dispatchEvent(new Event('watchLaterChanged'));
    } catch (error) {
      console.error('Error adding to watch later:', error);
    }
  },

  removeFromWatchLater: (movieId: number): void => {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(WATCH_LATER_KEY);
      if (!data) return;

      const movies: WatchLaterMovie[] = JSON.parse(data);
      const filtered = movies.filter((m) => m.id !== movieId);
      localStorage.setItem(WATCH_LATER_KEY, JSON.stringify(filtered));

      window.dispatchEvent(new Event('watchLaterChanged'));
    } catch (error) {
      console.error('Error removing from watch later:', error);
    }
  },

  isInWatchLater: (movieId: number): boolean => {
    return storage.getWatchLater().includes(movieId);
  },

  toggleWatchLater: (movieId: number): boolean => {
    const isInList = storage.isInWatchLater(movieId);

    if (isInList) {
      storage.removeFromWatchLater(movieId);
      return false;
    } else {
      storage.addToWatchLater(movieId);
      return true;
    }
  },

  getRecentlyViewed: (): number[] => {
    if (typeof window === 'undefined') return [];

    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      if (!data) return [];

      const movies: RecentlyViewedMovie[] = JSON.parse(data);
      return movies.sort((a, b) => b.viewedAt - a.viewedAt).map((m) => m.id);
    } catch (error) {
      console.error('Error reading recently viewed:', error);
      return [];
    }
  },

  addToRecentlyViewed: (movieId: number): void => {
    if (typeof window === 'undefined') return;

    try {
      const data = localStorage.getItem(RECENTLY_VIEWED_KEY);
      let movies: RecentlyViewedMovie[] = data ? JSON.parse(data) : [];
      movies = movies.filter((m) => m.id !== movieId);
      movies.unshift({ id: movieId, viewedAt: Date.now() });
      if (movies.length > MAX_RECENTLY_VIEWED) {
        movies = movies.slice(0, MAX_RECENTLY_VIEWED);
      }

      localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(movies));
      window.dispatchEvent(new Event('recentlyViewedChanged'));
    } catch (error) {
      console.error('Error adding to recently viewed:', error);
    }
  },

  clearRecentlyViewed: (): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(RECENTLY_VIEWED_KEY);
      window.dispatchEvent(new Event('recentlyViewedChanged'));
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  },
};
