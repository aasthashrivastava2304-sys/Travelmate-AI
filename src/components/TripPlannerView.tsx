import React, { useState } from 'react';
import {
  Sparkles,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Compass,
  Car,
  Hotel,
  AlertCircle,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { Trip, TripPlannerInput } from '../types/travel';
import { calculateDaysBetween, generateItineraryLocally } from '../utils/itineraryEngine';

interface TripPlannerViewProps {
  initialDestination?: string;
  onTripGenerated: (trip: Trip) => void;
}

const INTEREST_OPTIONS = [
  'Food & Dining',
  'Adventure & Outdoors',
  'Sightseeing & Icons',
  'Art & Culture',
  'Nature & Wildlife',
  'Relaxation & Spa',
  'Shopping & Markets',
  'Nightlife & Lounges',
];

const TRAVEL_STYLES = [
  { id: 'Balanced', label: 'Balanced', desc: 'Mix of iconic highlights & leisurely pacing' },
  { id: 'Relaxed', label: 'Relaxed Pace', desc: 'Slow mornings, scenic strolls & zero rush' },
  { id: 'Action-packed', label: 'Action-Packed', desc: 'Maximized sights & high energy' },
  { id: 'Hidden gems', label: 'Hidden Gems', desc: 'Off-the-beaten-path local secrets' },
] as const;

const BUDGET_TIERS = [
  { id: 'Budget', label: 'Budget ($)', range: '$100 - $150 / day' },
  { id: 'Moderate', label: 'Moderate ($$)', range: '$200 - $350 / day' },
  { id: 'Luxury', label: 'Luxury ($$$)', range: '$450 - $700 / day' },
  { id: 'Ultra-Luxury', label: 'Ultra-Luxury ($$$$)', range: '$800+ / day' },
] as const;

const POPULAR_DESTINATION_SUGGESTIONS = [
  'Kyoto, Japan',
  'Amalfi Coast, Italy',
  'Swiss Alps, Switzerland',
  'Santorini, Greece',
  'Tokyo, Japan',
  'Paris, France',
  'Barcelona, Spain',
  'Bali, Indonesia',
];

export const TripPlannerView: React.FC<TripPlannerViewProps> = ({
  initialDestination = '',
  onTripGenerated,
}) => {
  // Form fields
  const [destination, setDestination] = useState(initialDestination);
  const [departureCity, setDepartureCity] = useState('');
  
  // Default dates: next month
  const today = new Date();
  const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 10);
  const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 15);
  
  const formatDateForInput = (d: Date) => d.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(formatDateForInput(nextMonthStart));
  const [endDate, setEndDate] = useState(formatDateForInput(nextMonthEnd));
  const [travelers, setTravelers] = useState<number>(2);
  const [budgetTier, setBudgetTier] = useState<'Budget' | 'Moderate' | 'Luxury' | 'Ultra-Luxury'>('Moderate');
  const [customBudget, setCustomBudget] = useState<string>('3200');
  const [interests, setInterests] = useState<string[]>(['Sightseeing & Icons', 'Food & Dining', 'Art & Culture']);
  const [travelStyle, setTravelStyle] = useState<'Relaxed' | 'Balanced' | 'Action-packed' | 'Hidden gems'>('Balanced');
  const [transportPreference, setTransportPreference] = useState('Walking & Public Transit');
  const [accommodationPreference, setAccommodationPreference] = useState('Boutique Hotel');
  const [notes, setNotes] = useState('');

  // Status & loading
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const durationDays = calculateDaysBetween(startDate, endDate);

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) {
      setError('Please provide a destination to plan your trip.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be on or after start date.');
      return;
    }

    setError(null);
    setIsGenerating(true);
    setGenerationStep(1);

    const inputData: TripPlannerInput = {
      destination: destination.trim(),
      departureCity: departureCity.trim() || 'Home',
      startDate,
      endDate,
      durationDays,
      travelers,
      budgetTier,
      totalBudget: Number(customBudget) || 2800,
      interests,
      travelStyle,
      transportPreference,
      accommodationPreference,
      dietaryOrSpecialNotes: notes.trim(),
    };

    // Step animation for realistic AI feedback
    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 4 ? prev + 1 : prev));
    }, 600);

    try {
      // First attempt to call the backend endpoint (which checks Gemini API)
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputData),
      });

      const json = await res.json();
      clearInterval(stepInterval);

      if (json.success && json.data) {
        // Successfully generated via server Gemini
        const generatedTrip: Trip = {
          ...inputData,
          id: `trip-gemini-${Date.now()}`,
          title: `${destination} Personalized Experience`,
          coverImage: '/src/assets/images/destination_kyoto_japan_1793115200217.jpg',
          status: 'Upcoming',
          tripOverview: json.data.tripOverview || `A personalized journey through ${destination}.`,
          days: json.data.days.map((d: any, idx: number) => ({
            ...d,
            dayNumber: d.dayNumber || idx + 1,
            morning: { ...d.morning, id: `g-m-${idx}` },
            afternoon: { ...d.afternoon, id: `g-a-${idx}` },
            evening: { ...d.evening, id: `g-e-${idx}` },
          })),
          budgetBreakdown: json.data.budgetBreakdown,
          essentialTips: json.data.essentialTips,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          source: 'gemini',
        };

        setIsGenerating(false);
        onTripGenerated(generatedTrip);
        return;
      }

      // If backend reports fallback or no Gemini key, seamlessly use local high-fidelity engine
      const localTrip = generateItineraryLocally(inputData);
      setTimeout(() => {
        setIsGenerating(false);
        onTripGenerated(localTrip);
      }, 700);
    } catch (err: any) {
      console.warn('API call encountered error, engaging local smart engine:', err);
      clearInterval(stepInterval);
      const localTrip = generateItineraryLocally(inputData);
      setIsGenerating(false);
      onTripGenerated(localTrip);
    }
  };

  const stepsText = [
    'Connecting to travel knowledge base...',
    'Curating top attractions & neighborhood gems...',
    'Balancing morning, afternoon & evening pacing...',
    'Calculating dining, transit & overall budget breakdown...',
  ];

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-teal-50 border border-teal-100 text-teal-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-teal-600" />
          <span>Tailored AI Travel Architect</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Design Your Next Journey
        </h2>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Enter your destinations, timing, and travel preferences. TravelMate AI will architect a cohesive, realistic day-by-day plan with dining and transit.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleGenerate} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-8">
        {/* Section 1: Destination & Departure */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>1. Destinations & Route</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Where do you want to go? *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Kyoto, Japan or Amalfi Coast, Italy"
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 focus:border-teal-600"
                  required
                />
              </div>

              {/* Quick destination suggestion buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2.5">
                <span className="text-[11px] text-slate-400 self-center mr-1">Popular:</span>
                {POPULAR_DESTINATION_SUGGESTIONS.slice(0, 4).map((dest) => (
                  <button
                    type="button"
                    key={dest}
                    onClick={() => setDestination(dest)}
                    className="text-xs px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-600 rounded-lg transition-colors cursor-pointer"
                  >
                    {dest.split(',')[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Departure City (Optional)
              </label>
              <input
                type="text"
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                placeholder="e.g. San Francisco (SFO) or London (LHR)"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 focus:border-teal-600"
              />
              <p className="text-[11px] text-slate-400 mt-1">Used for transit and arrival timing</p>
            </div>
          </div>
        </div>

        {/* Section 2: Dates & Group Size */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>2. Timing & Party Size</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Start Date *
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                End Date *
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Number of Travelers
              </label>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.max(1, prev - 1))}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center text-sm font-semibold text-slate-900 font-mono-numbers py-2">
                  {travelers} {travelers === 1 ? 'Solo' : travelers === 2 ? 'Couple (2)' : `Party of ${travelers}`}
                </div>
                <button
                  type="button"
                  onClick={() => setTravelers((prev) => Math.min(10, prev + 1))}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-3 text-xs text-slate-500 font-medium">
            Calculated Duration: <span className="text-teal-700 font-bold font-mono-numbers">{durationDays} days</span>
          </div>
        </div>

        {/* Section 3: Budget & Travel Style */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-600" />
            <span>3. Budget & Travel Style</span>
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Budget Tier
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {BUDGET_TIERS.map((tier) => {
                  const isSelected = budgetTier === tier.id;
                  return (
                    <button
                      type="button"
                      key={tier.id}
                      onClick={() => setBudgetTier(tier.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-xs font-bold text-slate-900">{tier.label}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 font-mono-numbers">{tier.range}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Approx. Total Target Budget ($)
                </label>
                <input
                  type="number"
                  min="300"
                  step="100"
                  value={customBudget}
                  onChange={(e) => setCustomBudget(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 font-mono-numbers"
                />
                <p className="text-[11px] text-slate-400 mt-1">Includes lodging, food, and activities</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Travel Pace & Cadence
                </label>
                <select
                  value={travelStyle}
                  onChange={(e) => setTravelStyle(e.target.value as any)}
                  className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
                >
                  {TRAVEL_STYLES.map((style) => (
                    <option key={style.id} value={style.id}>
                      {style.label} - {style.desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Interests & Desired Activities */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Compass className="w-4 h-4 text-teal-600" />
            <span>4. Interests & Focus Areas</span>
          </h3>
          <p className="text-xs text-slate-500 mb-3">
            Select themes you want prioritized in your daily morning, afternoon, and evening slots:
          </p>

          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => {
              const active = interests.includes(interest);
              return (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2 cursor-pointer ${
                    active
                      ? 'bg-teal-600 text-white font-semibold shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  <span>{interest}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 5: Logistics & Accommodations */}
        <div className="pt-6 border-t border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Car className="w-4 h-4 text-teal-600" />
            <span>5. Transportation & Accommodation Preferences</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-500" />
                <span>Primary Transportation</span>
              </label>
              <select
                value={transportPreference}
                onChange={(e) => setTransportPreference(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
              >
                <option value="Walking & Public Transit">Walking & Public Metro/Bus</option>
                <option value="Scenic Trains & High-Speed Rail">Scenic Trains & High-Speed Rail</option>
                <option value="Rental Car & Road Trip">Rental Car & Self-Drive</option>
                <option value="Private Chauffeur & Taxis">Private Chauffeur & Taxis</option>
                <option value="Bicycle & Walking">Bicycle & Walking</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Hotel className="w-3.5 h-3.5 text-slate-500" />
                <span>Accommodation Style</span>
              </label>
              <select
                value={accommodationPreference}
                onChange={(e) => setAccommodationPreference(e.target.value)}
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-teal-600 bg-white"
              >
                <option value="Boutique Hotel">Boutique Hotel (Charming & central)</option>
                <option value="Traditional Ryokan / Heritage Villa">Traditional Heritage / Ryokan / Villa</option>
                <option value="5-Star Luxury Resort">5-Star Luxury Resort & Spa</option>
                <option value="Curated Vacation Apartment">Curated Vacation Apartment / Airbnb</option>
                <option value="Design Hostel">Design Hostel / Budget-Friendly</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Special Requests, Dietary Notes, or Must-See Venues
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Vegetarian dining options, avoid steep steps, keen on sunrise photography..."
              className="w-full px-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-teal-600"
            />
          </div>
        </div>

        {/* Submit Button & Progress State */}
        <div className="pt-6 border-t border-slate-100">
          {isGenerating ? (
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600 animate-spin" />
                  <span>Synthesizing your personalized itinerary...</span>
                </span>
                <span className="font-mono-numbers text-teal-700">{Math.min(generationStep * 25, 95)}%</span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-teal-600 h-full transition-all duration-500 rounded-full"
                  style={{ width: `${Math.min(generationStep * 25, 95)}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 italic">
                {stepsText[generationStep - 1] || 'Finalizing itinerary...'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500">
                Ready to generate a complete {durationDays}-day schedule for {destination || 'your destination'}.
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Itinerary</span>
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};
