import React from 'react';
import {
  Compass,
  PlusCircle,
  Luggage,
  Globe,
  Settings,
  Sparkles,
  MapPin,
  Calendar,
  X,
} from 'lucide-react';
import { UserSettings } from '../utils/storage';

export type NavigationTab = 'dashboard' | 'planner' | 'my-trips' | 'explore' | 'settings';

interface SidebarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  userSettings: UserSettings;
  tripsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  userSettings,
  tripsCount,
  mobileOpen,
  onCloseMobile,
}) => {
  const navItems = [
    { id: 'dashboard' as NavigationTab, label: 'Dashboard', icon: Compass },
    { id: 'planner' as NavigationTab, label: 'Plan a Trip', icon: PlusCircle, highlight: true },
    { id: 'my-trips' as NavigationTab, label: 'My Trips', icon: Luggage, badge: tripsCount },
    { id: 'explore' as NavigationTab, label: 'Explore', icon: Globe },
    { id: 'settings' as NavigationTab, label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-18 px-6 border-b border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onSelectTab('dashboard');
              onCloseMobile();
            }}
            className="flex items-center gap-3 text-left focus-visible:outline-teal-600 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                TravelMate <span className="text-teal-600">AI</span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Itinerary Planner</p>
            </div>
          </button>

          <button
            onClick={onCloseMobile}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Action Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onSelectTab('planner');
              onCloseMobile();
            }}
            className="w-full py-2.5 px-4 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Plan a New Trip</span>
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-teal-50 text-teal-800 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-teal-600' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono-numbers font-medium ${
                      isActive ? 'bg-teal-100 text-teal-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mini Travel Widget */}
        <div className="p-4 mx-3 mb-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
            <Calendar className="w-3.5 h-3.5 text-teal-600" />
            <span>Next Journey</span>
          </div>
          <p className="text-xs text-slate-900 font-medium truncate">Kyoto Cultural Heritage</p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono-numbers">
            <span>Nov 10, 2026</span>
            <span aria-hidden="true">·</span>
            <span>5 Days</span>
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-4 border-t border-slate-100 flex items-center gap-3 bg-white">
          <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-semibold text-xs shrink-0">
            {userSettings.userName
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900 truncate">{userSettings.userName}</p>
            <p className="text-[11px] text-slate-400 truncate flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
              <span>{userSettings.homeAirport.split(' ')[0]}</span>
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
