# Movie Discovery App

A modern, responsive movie browsing application built with Next.js, TypeScript, and Tailwind CSS. The app allows users to discover, search, and save movies using The Movie Database (TMDB) API.

## Live Demo
[MOVIE DISCOVERY APP](https://moviiee-discovery.netlify.app)

## Features

### Core Features
- **Home Page** - Top rated movies & popular movies by genre
- **Browse by Genre** - Filter movies by genre with sorting options
- **Search** - Search movies by title with debounced input
- **Movie Details** - Comprehensive movie info, cast, and similar movies
- **Watch Later** - Save movies to watch later list
- **Recently Viewed** - Track your browsing history
- **Dark/Light Mode** - Toggle between themes

### Technical Features
- **Fully Responsive** - Mobile, tablet, and desktop optimized
- **Fast Performance** - Optimized images and lazy loading
- **Error Handling** - Graceful error states and fallbacks
- **Secure** - API keys protected via environment variables
- **SEO Optimized** - Proper meta tags and structured data

## Tech Stack

### Frontend
- **Next.js 16.1.6** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icon library

### API & Data
- **TMDB API** - Movie database
- **LocalStorage** - Client-side persistence

### Deployment
- **Netlify** - Hosting platform with SSR support
- **@netlify/plugin-nextjs** - Next.js runtime for Netlify

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - Vendor prefixing

## Getting Started

### Prerequisites
- Node.js 20.9.0+ and npm/yarn
- TMDB API key (free from [TMDB](https://www.themoviedb.org/documentation/api))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/EkhtiarUddin/movie-discovery-app.git
cd movie-discovery-app

# 2. Install dependencies
npm install or
yarn

# 3. Set up environment variables
cp .env.example .env

# Add your TMDB API key to .env.local
NEXT_PUBLIC_TMDB_API_KEY=your_api_key_here

# 4. Run development server
npm run dev or
yarn dev

# 5. Open your browser and navigate to:
http://localhost:3000

```

### Available Scripts
 - npm run dev: Start the development server
 - npm run build: Build the application for production
 - npm start: Start the production server
 - npm run lint: Run ESLint to check code quality

## Configuration
### Environment Variables
 Create a .env.local file in the project root with:
 NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key_here

### Getting a TMDB API Key
- 1. Visit https://www.themoviedb.org and create a free account
- 2. Go to Settings → API
- 3. Request an API key (select "Developer" option)
- 4. Copy the API key and add it to your .env.local file

## Pages & Features
### Home Page (/)
- Displays top rated movies in a responsive grid
- Shows popular movies organized by genre
- Clean, modern UI with hover effects

### Browse Genres (/genres)
- Grid display of all available movie genres
- Each genre card links to genre-specific movie listings

### Genre Details (/genre/[id])
- Movies filtered by selected genre
- Sorting options: popularity, release date, vote average, title
- Infinite scroll pagination with "Load More" button

### Movie Details (/movie/[id])
- Complete movie information: title, overview, release date, rating
- Cast list with actor photos and character names
- Similar movie recommendations based on genres
- Watch later toggle button
- Automatically added to recently viewed list

### Search (/search)
- Real-time movie search with debounced input (500ms delay)
- Responsive grid of search results
- Empty state and error handling

### Watch Later (/watch-later)
- List of movies saved to watch later
- Persistent storage using localStorage
- Add/remove functionality from movie cards and details page

### Recently Viewed (/recently-viewed)
- Automatically tracks last 50 viewed movies
- Persistent storage using localStorage
- Clean list display with movie posters and info

## Important Deployment Notes
 - Node.js Version: Must be 20.9.0 or higher (configured in netlify.toml)
 - Build Command: npm run build
 - Publish Directory: .next
 - SSR Support: Enabled via @netlify/plugin-nextjs plugin

## Styling & Theming
### Design System
- Colors: Primary red palette (#ef4444) with neutral grays
- Typography: System fonts with responsive sizing
- Spacing: Consistent 4px base unit (Tailwind default)
- Components: Reusable, accessible UI components

### Dark Mode
- Toggle between light and dark themes
- Detects system preference by default
- User preference persists in localStorage

## API Security
 - API keys are stored in environment variables only
 - Never exposed in client-side code or repository
 - Rate limiting and error handling implemented
 - Fallback placeholder images for failed loads

## Performance Optimizations
 - Image optimization with Next.js Image component
 - Code splitting and lazy loading
 - Static generation where possible
 - Efficient state management with React hooks
 - Minimal bundle size with tree shaking

## Testing
### Manual Testing Checklist
 - [ ] All pages load correctly
 - [ ] Responsive on mobile, tablet, and desktop
 - [ ] Dark/light mode toggle works and persists
 - [ ] Search functionality returns results
 - [ ] Watch later saves and removes movies
 - [ ] Genre filtering and sorting works
 - [ ] Error states display properly
 - [ ] Loading skeletons show during data fetch

## Development Guidelines
 - Follow TypeScript best practices and type safety
 - Use Tailwind CSS for styling (no inline styles)
 - Write reusable, composable components
 - Add proper error handling and loading states
 - Maintain responsive design principles
 - Include comprehensive comments for complex logic

### Built with using Next.js, TypeScript, and Tailwind CSS
