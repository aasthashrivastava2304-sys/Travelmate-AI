import React from 'react';
import {
  Compass,
  Calendar,
  DollarSign,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  Luggage,
  Users,
} from 'lucide-react';
import { Trip } from '../types/travel';
import { POPULAR_DESTINATIONS } from '../data/sampleTrips';
import { UserSettings } from '../utils/storage';

interface DashboardViewProps {
  trips: Trip[];
  userSettings: UserSettings;
  onPlanTrip: (prefillDestination?: string) => void;
  onSelectTrip: (tripId: string) => void;
  onExploreDestinations: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  trips,
  userSettings,
  onPlanTrip,
  onSelectTrip,
  onExploreDestinations,
}) => {
  // Stats
  const totalDays = trips.reduce((acc, t) => acc + (t.durationDays || 0), 0);
  const totalBudget = trips.reduce((acc, t) => acc + (t.totalBudget || 0), 0);
  const upcomingCount = trips.filter((t) => t.status === 'Upcoming').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white p-6 sm:p-8 shadow-sm">
        {/* Background glow & subtle accent */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Travel Concierge</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2 text-balance">
            Welcome back, {userSettings.userName.split(' ')[0]}! Where to next?
          </h2>
          <p className="text-sm text-slate-300 mb-6 leading-relaxed">
            Create intelligent, custom multi-day travel itineraries with morning-to-night pacing, local culinary gems, and dynamic budget calculations in seconds.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onPlanTrip()}
              className="px-5 py-2.5 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Plan a New Trip</span>
            </button>
            <button
              onClick={onExploreDestinations}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white font-medium text-sm rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore Guides</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Trip Statistics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Trips Planned</span>
            <Luggage className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">{trips.length}</div>
          <p className="text-[11px] text-slate-500 mt-1">Saved in personal workspace</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Upcoming Journeys</span>
            <Calendar className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">{upcomingCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Ready to explore</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Days Scheduled</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">{totalDays}</div>
          <p className="text-[11px] text-slate-500 mt-1">Across all itineraries</p>
        </div>

        <div className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Budget Tracked</span>
            <DollarSign className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 font-mono-numbers">
            ${totalBudget.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Estimated travel expenditure</p>
        </div>
      </div>

      {/* Recent Trips Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Trips</h3>
            <p className="text-xs text-slate-500">Pick up right where you left off</p>
          </div>
          <button
            onClick={() => onPlanTrip()}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>Create new</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.slice(0, 3).map((trip) => (
            <div
              key={trip.id}
              onClick={() => onSelectTrip(trip.id)}
              className="group bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col"
            >
              {/* Image container */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <img
                  src={trip.coverImage}
                  alt={trip.destination}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-2 text-xs font-medium text-teal-200 mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trip.destination}</span>
                  </div>
                  <h4 className="text-base font-bold truncate text-white drop-shadow-xs">
                    {trip.title}
                  </h4>
                </div>
              </div>

              {/* Trip details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {trip.tripOverview}
                </p>

                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-mono-numbers">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {trip.durationDays} Days · {trip.startDate ? trip.startDate.slice(5) : 'Scheduled'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      {trip.travelers} {trip.travelers === 1 ? 'Traveler' : 'Travelers'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs font-semibold text-slate-900 font-mono-numbers">
                      ${trip.totalBudget.toLocaleString()} <span className="text-[11px] font-normal text-slate-400">est.</span>
                    </span>
                    <span className="text-xs font-semibold text-teal-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                      View Itinerary <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Destination Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 tracking-tight">Popular Destinations</h3>
            <p className="text-xs text-slate-500">Inspiring ideas with 1-click tailored planning</p>
          </div>
          <button
            onClick={onExploreDestinations}
            className="text-xs font-semibold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
          >
            <span>See all guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {POPULAR_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="relative h-40 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.image}
                  alt={dest.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium rounded-md font-mono-numbers">
                  ${dest.avgDailyBudget}/day
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                    <MapPin className="w-3 h-3 text-teal-600" />
                    <span>{dest.country}</span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mb-1">{dest.name}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">{dest.tagline}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="text-[11px] text-slate-500 font-mono-numbers">
                    {dest.idealDuration}
                  </div>
                  <button
                    onClick={() => onPlanTrip(dest.name)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Plan Trip
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Travel Assistant Pro-Tips Strip */}
      <div className="p-6 bg-teal-50/70 border border-teal-100 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-teal-600 text-white rounded-xl shrink-0 mt-0.5">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900">Need inspiration for your next getaway?</h4>
            <p className="text-xs text-slate-600 mt-0.5">
              Let the AI optimize your timing, suggest breakfast-to-dinner gastronomy, and avoid crowd bottlenecks.
            </p>
          </div>
        </div>
        <button
          onClick={() => onPlanTrip('Kyoto')}
          className="whitespace-nowrap px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          Generate Sample Plan
        </button>
      </div>
    </div>
  );
};
