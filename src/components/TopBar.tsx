import React from 'react';
import { Menu, Plus, Sparkles } from 'lucide-react';
import { NavigationTab } from './Sidebar';

interface TopBarProps {
  currentTab: NavigationTab;
  onOpenMobile: () => void;
  onPlanNewTrip: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ currentTab, onOpenMobile, onPlanNewTrip }) => {
  const titles: Record<NavigationTab, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard', subtitle: 'Overview & Recent Journeys' },
    planner: { title: 'AI Trip Planner', subtitle: 'Personalized Itinerary Generator' },
    'my-trips': { title: 'My Trips', subtitle: 'Saved Itineraries & Schedules' },
    explore: { title: 'Explore Destinations', subtitle: 'Curated World Guides & Inspiration' },
    settings: { title: 'Settings', subtitle: 'Preferences & System Architecture' },
  };

  const current = titles[currentTab] || { title: 'TravelMate AI', subtitle: 'Itinerary Planner' };

  return (
    <header className="h-18 px-4 sm:px-8 border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
      {/* Zone 1: Mobile Hamburger + Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobile}
          className="p-2 text-slate-600 hover:text-slate-900 rounded-lg lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span>TravelMate</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-600">{current.title}</span>
          </div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
            {current.title}
          </h1>
        </div>
      </div>

      {/* Zone 2: Contextual Subtitle (hidden on small screens) */}
      <div className="hidden md:flex items-center text-xs text-slate-500 font-medium truncate">
        <span>{current.subtitle}</span>
      </div>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center gap-2 shrink-0">
        {currentTab !== 'planner' ? (
          <button
            onClick={onPlanNewTrip}
            className="py-2 px-3.5 sm:px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium text-xs sm:text-sm rounded-lg flex items-center gap-1.5 shadow-xs transition-colors whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Plan a New Trip</span>
            <span className="sm:hidden">New Trip</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-800 text-xs font-medium rounded-lg border border-teal-100/70">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span className="whitespace-nowrap">AI Generator Ready</span>
          </div>
        )}
      </div>
    </header>
  );
};
