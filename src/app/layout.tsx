import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: 'CineDiscover - Discover Your Next Favorite Movie',
  description: 'Browse and discover movies from The Movie Database. Find top-rated films, search by genre, and create your watch later list.',
  keywords: ['movies', 'cinema', 'films', 'tmdb', 'movie database', 'watch later'],
  authors: [{ name: 'CineDiscover Team' }],
  openGraph: {
    title: 'CineDiscover - Discover Your Next Favorite Movie',
    description: 'Browse and discover movies from The Movie Database',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-600 dark:text-gray-400">
              <p className="mb-2">
                Data provided by{' '}
                <a
                  href="https://www.themoviedb.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline"
                >
                  The Movie Database (TMDB)
                </a>
              </p>
              <p className="text-sm">© {new Date().getFullYear()} CineDiscover. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
