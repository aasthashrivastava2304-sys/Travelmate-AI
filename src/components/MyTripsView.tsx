import React, { useState } from 'react';
import {
  Calendar,
  Users,
  DollarSign,
  MapPin,
  Search,
  Plus,
  Trash2,
  Copy,
  ExternalLink,
  Edit2,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Trip } from '../types/travel';
import { TripEditModal } from './TripEditModal';

interface MyTripsViewProps {
  trips: Trip[];
  onSelectTrip: (tripId: string) => void;
  onPlanTrip: () => void;
  onDuplicateTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onUpdateTrip: (updatedTrip: Trip) => void;
}

export const MyTripsView: React.FC<MyTripsViewProps> = ({
  trips,
  onSelectTrip,
  onPlanTrip,
  onDuplicateTrip,
  onDeleteTrip,
  onUpdateTrip,
}) => {
  const [filter, setFilter] = useState<'All' | 'Upcoming' | 'Past'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tripToDelete, setTripToDelete] = useState<Trip | null>(null);
  const [tripToEdit, setTripToEdit] = useState<Trip | null>(null);

  const filteredTrips = trips.filter((trip) => {
    const matchesFilter = filter === 'All' ? true : trip.status === filter;
    const matchesSearch =
      trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top Header & Search / Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Saved Trips</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {trips.length} itineraries stored locally in your workspace
          </p>
        </div>

        <button
          onClick={onPlanTrip}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-medium text-xs sm:text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Plan a New Trip</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Status segmented controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {(['All', 'Upcoming', 'Past'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by city or country..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
          />
        </div>
      </div>

      {/* Trips Grid */}
      {filteredTrips.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-md mx-auto">
          <div className="w-12 h-12 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-3">
            <Calendar className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">No trips found</h3>
          <p className="text-xs text-slate-500 mb-5">
            {searchQuery
              ? `No itineraries matching "${searchQuery}". Try clearing search.`
              : `You do not have any ${filter.toLowerCase()} trips planned yet.`}
          </p>
          <button
            onClick={onPlanTrip}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Create Your First Itinerary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTrips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
            >
              {/* Cover Image & Status Tag */}
              <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                <img
                  src={trip.coverImage}
                  alt={trip.destination}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono-numbers uppercase tracking-wider ${
                      trip.status === 'Upcoming'
                        ? 'bg-teal-500/90 text-slate-950'
                        : 'bg-slate-800/90 text-slate-300'
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-teal-200 mb-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{trip.destination}</span>
                  </div>
                  <h3 className="text-base font-bold text-white truncate drop-shadow-xs">
                    {trip.title}
                  </h3>
                </div>
              </div>

              {/* Trip details content */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {trip.tripOverview}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-500 font-mono-numbers py-2 border-y border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.durationDays} Days</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{trip.travelers} {trip.travelers === 1 ? 'Person' : 'People'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                      <span>${trip.totalBudget.toLocaleString()}</span>
                    </div>
                    <div className="text-slate-600 font-sans truncate">
                      {trip.travelStyle || 'Balanced'}
                    </div>
                  </div>
                </div>

                {/* Card actions: View, Edit, Duplicate, Delete */}
                <div className="pt-3 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectTrip(trip.id)}
                    className="flex-1 py-1.5 px-3 bg-teal-50 hover:bg-teal-100 active:bg-teal-200 text-teal-800 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Itinerary</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setTripToEdit(trip)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Edit Trip Details"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDuplicateTrip(trip.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                      title="Duplicate Trip"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => setTripToDelete(trip)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Trip"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {tripToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Delete Trip?</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete <strong className="text-slate-800">"{tripToDelete.title}"</strong>? This will remove all day-by-day activity slots from your local storage.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setTripToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteTrip(tripToDelete.id);
                  setTripToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trip Edit Modal */}
      {tripToEdit && (
        <TripEditModal
          isOpen={Boolean(tripToEdit)}
          onClose={() => setTripToEdit(null)}
          trip={tripToEdit}
          onSave={(updated) => onUpdateTrip(updated)}
        />
      )}
    </div>
  );
};
