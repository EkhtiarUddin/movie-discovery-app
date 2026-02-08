'use client';

import { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';

export function useWatchLater(movieId?: number) {
  const [isInWatchLater, setIsInWatchLater] = useState(false);
  const [watchLaterIds, setWatchLaterIds] = useState<number[]>([]);

  useEffect(() => {
    const loadInitialData = () => {
      const ids = storage.getWatchLater();
      setWatchLaterIds(ids);

      if (movieId !== undefined) {
        setIsInWatchLater(ids.includes(movieId));
      }
    };

    loadInitialData();

    const handleChange = () => {
      const updatedIds = storage.getWatchLater();
      setWatchLaterIds(updatedIds);

      if (movieId !== undefined) {
        setIsInWatchLater(updatedIds.includes(movieId));
      }
    };

    window.addEventListener('watchLaterChanged', handleChange);

    return () => {
      window.removeEventListener('watchLaterChanged', handleChange);
    };
  }, [movieId]);

  const toggleWatchLater = (id?: number) => {
    const targetId = id ?? movieId;
    if (targetId === undefined) return;

    const newState = storage.toggleWatchLater(targetId);
    setIsInWatchLater(newState);
  };

  return {
    isInWatchLater,
    watchLaterIds,
    toggleWatchLater,
  };
}

export function useRecentlyViewed() {
  const [recentlyViewedIds, setRecentlyViewedIds] = useState<number[]>([]);

  useEffect(() => {
    const loadInitialData = () => {
      setRecentlyViewedIds(storage.getRecentlyViewed());
    };

    loadInitialData();

    const handleChange = () => {
      setRecentlyViewedIds(storage.getRecentlyViewed());
    };

    window.addEventListener('recentlyViewedChanged', handleChange);

    return () => {
      window.removeEventListener('recentlyViewedChanged', handleChange);
    };
  }, []);

  return {
    recentlyViewedIds,
  };
}
