import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Sun, Moon, Sparkles, ExternalLink, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getGenerateApiUrl } from '../../services/listingService';

export default function Header({ onOpenSidebar }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Overview Dashboard';
      case '/generate':
        return 'Generate AI Listings';
      case '/history':
        return 'Listing History';
      case '/settings':
        return 'Settings & Configuration';
      default:
        if (location.pathname.startsWith('/listing/')) {
          return 'Listing Details';
        }
        return 'ListingForge';
    }
  };

  const isGenerateConfigured = !!getGenerateApiUrl();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 px-4 sm:px-6 backdrop-blur-md transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 md:hidden"
          aria-label="Open navigation sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-slate-900 dark:text-white">
            {getPageTitle()}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Backend Webhook Status Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 px-3 py-1 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isGenerateConfigured ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
          <span className="text-slate-600 dark:text-slate-300 font-medium">
            {isGenerateConfigured ? 'n8n Live' : 'Not Configured'}
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 dark:text-slate-400 transition-colors"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Quick Action Button */}
        {location.pathname !== '/generate' && (
          <Link
            to="/generate"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>New Listing</span>
          </Link>
        )}
      </div>
    </header>
  );
}
