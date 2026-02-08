import type {
  MoviesResponse,
  GenresResponse,
  MovieDetails,
  Credits,
  SortOption,
} from '@/types/movie';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL;
const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL;
const PLACEHOLDER_MOVIE = '/placeholder-movie.jpg';
const PLACEHOLDER_BACKDROP = '/placeholder-backdrop.jpg';
const PLACEHOLDER_ACTOR = '/placeholder-actor.jpg';

class TMDBAPIError extends Error {
  constructor(
    public statusCode: number,
    message: string
  ) {
    super(message);
    this.name = 'TMDBAPIError';
  }
}

async function fetchFromTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T> {
  if (!API_KEY) {
    console.error('TMDB API key is missing. Please add NEXT_PUBLIC_TMDB_API_KEY to your .env.local');
    throw new Error('TMDB API key is not configured');
  }

  const url = new URL(`${BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_KEY);

  Object.entries(params).forEach(([key, value]) => {
    if (value) url.searchParams.append(key, value);
  });

  try {
    const response = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new TMDBAPIError(404, 'Resource not found');
      } else if (response.status === 401) {
        throw new TMDBAPIError(401, 'Invalid API key');
      } else if (response.status === 429) {
        throw new TMDBAPIError(429, 'Rate limit exceeded');
      }
      throw new TMDBAPIError(
        response.status,
        `TMDB API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json() as Promise<T>;
  } catch (error) {
    if (error instanceof TMDBAPIError) {
      throw error;
    }
    
    console.error('Network error fetching from TMDB:', error);
    throw new Error(
      `Failed to fetch from TMDB: ${error instanceof Error ? error.message : 'Network error'}`
    );
  }
}

export const tmdbApi = {
  async getGenres(): Promise<GenresResponse> {
    try {
      return await fetchFromTMDB<GenresResponse>('/genre/movie/list');
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return { genres: [] };
    }
  },

  async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    try {
      return await fetchFromTMDB<MoviesResponse>('/movie/top_rated', {
        page: page.toString(),
      });
    } catch (error) {
      console.error('Failed to fetch top rated movies:', error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    try {
      return await fetchFromTMDB<MoviesResponse>('/movie/popular', {
        page: page.toString(),
      });
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  async getMoviesByGenre(
    genreId: number,
    page: number = 1,
    sortBy?: SortOption
  ): Promise<MoviesResponse> {
    const params: Record<string, string> = {
      page: page.toString(),
      with_genres: genreId.toString(),
    };

    if (sortBy) {
      params.sort_by = sortBy;
    }

    try {
      return await fetchFromTMDB<MoviesResponse>('/discover/movie', params);
    } catch (error) {
      console.error(`Failed to fetch movies for genre ${genreId}:`, error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    try {
      return await fetchFromTMDB<MovieDetails>(`/movie/${movieId}`);
    } catch (error) {
      console.error(`Failed to fetch details for movie ${movieId}:`, error);
      return {
        id: movieId,
        title: 'Movie not found',
        overview: 'Unable to load movie details',
        release_date: '',
        vote_average: 0,
        vote_count: 0,
        popularity: 0,
        adult: false,
        original_language: 'en',
        original_title: '',
        video: false,
        poster_path: null,
        backdrop_path: null,
        genres: [],
        runtime: 0,
        status: 'Unknown',
        tagline: '',
        budget: 0,
        revenue: 0,
        homepage: '',
        imdb_id: '',
      };
    }
  },

  async getMovieCredits(movieId: number): Promise<Credits> {
    try {
      return await fetchFromTMDB<Credits>(`/movie/${movieId}/credits`);
    } catch (error) {
      console.error(`Failed to fetch credits for movie ${movieId}:`, error);
      return { id: movieId, cast: [] };
    }
  },

  async getSimilarMovies(movieId: number, page: number = 1): Promise<MoviesResponse> {
    try {
      return await fetchFromTMDB<MoviesResponse>(`/movie/${movieId}/similar`, {
        page: page.toString(),
      });
    } catch (error) {
      console.error(`Failed to fetch similar movies for ${movieId}:`, error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    try {
      return await fetchFromTMDB<MoviesResponse>('/search/movie', {
        query: encodeURIComponent(query),
        page: page.toString(),
      });
    } catch (error) {
      console.error(`Failed to search movies for "${query}":`, error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  async getRecommendationsByGenre(
    genreIds: number[],
    page: number = 1
  ): Promise<MoviesResponse> {
    try {
      return await fetchFromTMDB<MoviesResponse>('/discover/movie', {
        with_genres: genreIds.join(','),
        sort_by: 'popularity.desc',
        page: page.toString(),
      });
    } catch (error) {
      console.error(`Failed to fetch recommendations for genres ${genreIds}:`, error);
      return { page: 1, results: [], total_pages: 0, total_results: 0 };
    }
  },

  getImageUrl(
    path: string | null,
    size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'
  ): string {
    if (!path) {
      return PLACEHOLDER_MOVIE;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getBackdropUrl(
    path: string | null,
    size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280'
  ): string {
    if (!path) {
      return PLACEHOLDER_BACKDROP;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  getProfileUrl(
    path: string | null,
    size: 'w45' | 'w185' | 'h632' | 'original' = 'w185'
  ): string {
    if (!path) {
      return PLACEHOLDER_ACTOR;
    }
    return `${IMAGE_BASE_URL}/${size}${path}`;
  },

  async getMovieWithCredits(movieId: number) {
    try {
      const [movieDetails, credits] = await Promise.all([
        this.getMovieDetails(movieId),
        this.getMovieCredits(movieId),
      ]);
      
      return {
        ...movieDetails,
        credits,
      };
    } catch (error) {
      console.error(`Failed to get complete movie data for ${movieId}:`, error);
      throw error;
    }
  },
};
