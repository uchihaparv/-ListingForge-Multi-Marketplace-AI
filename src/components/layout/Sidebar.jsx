import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Sparkles,
  History,
  Settings,
  Store,
  ChevronRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Dashboard',
    to: '/',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    name: 'Generate Listing',
    to: '/generate',
    icon: Sparkles,
    badge: 'AI',
  },
  {
    name: 'Listing History',
    to: '/history',
    icon: History,
    badge: null,
  },
  {
    name: 'Settings & Setup',
    to: '/settings',
    icon: Settings,
    badge: null,
  },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo Branding */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200 dark:border-slate-800/60">
          <NavLink to="/" className="flex items-center gap-3 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
                ListingForge
              </span>
              <span className="block text-[10px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500">
                Multi-Marketplace AI
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-1">
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Platform
          </div>
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="rounded-md bg-indigo-500/10 dark:bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-600 dark:text-indigo-300 border border-indigo-500/20">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}

          <div className="pt-6 px-3 mb-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Supported Channels
          </div>
          <div className="px-3 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-1">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                Amazon.in
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">Ready</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-1">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                Flipkart
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">Ready</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 py-1">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500"></span>
                Meesho
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">Ready</span>
            </div>
          </div>
        </div>

        {/* Engine Status Card */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/60">
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                AI Engine Connected
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
              Powered by Groq Llama 3 via n8n automation & Firestore.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
