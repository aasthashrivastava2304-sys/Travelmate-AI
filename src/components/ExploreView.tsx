import React, { useState } from 'react';
import { MapPin, Calendar, DollarSign, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { POPULAR_DESTINATIONS } from '../data/sampleTrips';
import { DestinationGuide } from '../types/travel';

interface ExploreViewProps {
  onPlanDestination: (destName: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({ onPlanDestination }) => {
  const [selectedTag, setSelectedTag] = useState<string>('All');

  const allTags = ['All', 'Culture', 'Food', 'Nature', 'Adventure', 'Relaxation', 'Sightseeing'];

  const filtered = POPULAR_DESTINATIONS.filter((d) => {
    if (selectedTag === 'All') return true;
    return d.tags.some((t) => t.toLowerCase().includes(selectedTag.toLowerCase()));
  });

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Curated Travel Inspirations</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Handpicked Destinations
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Browse verified cultural hubs, coastal paradises, and mountain retreats. Click "Plan This Trip" on any destination to auto-configure your custom itinerary.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
              selectedTag === tag
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((dest: DestinationGuide) => (
          <div
            key={dest.id}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
          >
            {/* Image */}
            <div className="relative h-60 w-full bg-slate-900 overflow-hidden">
              <img
                src={dest.image}
                alt={dest.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />

              <div className="absolute top-3.5 right-3.5 px-3 py-1 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold rounded-lg font-mono-numbers">
                ${dest.avgDailyBudget} / day avg
              </div>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{dest.country}</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight drop-shadow-xs">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-200 mt-0.5 line-clamp-1">{dest.tagline}</p>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                {dest.description}
              </p>

              {/* Highlights */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Key Attractions & Highlights
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {dest.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                      <span className="truncate">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Meta stats & CTA */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="text-xs text-slate-500 font-mono-numbers">
                  <div>Ideal: <strong className="text-slate-800">{dest.idealDuration}</strong></div>
                  <div className="text-[11px] text-slate-400 font-sans">Best: {dest.bestSeason}</div>
                </div>

                <button
                  onClick={() => onPlanDestination(dest.name)}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <span>Plan This Trip</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
