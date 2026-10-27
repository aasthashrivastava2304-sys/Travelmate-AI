import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  DollarSign,
  Users,
  Compass,
  Coffee,
  Utensils,
  Moon,
  Sun,
  Sunrise,
  Edit2,
  Trash2,
  Plus,
  Share2,
  Printer,
  Download,
  Bookmark,
  CheckCircle2,
  Circle,
  Lightbulb,
  ArrowLeft,
  Navigation,
  Sparkles,
} from 'lucide-react';
import { ActivitySlot, DayPlan, Trip } from '../types/travel';
import { ActivityModal } from './ActivityModal';
import { TripEditModal } from './TripEditModal';

interface ItineraryDetailViewProps {
  trip: Trip;
  onUpdateTrip: (updatedTrip: Trip) => void;
  onBackToTrips: () => void;
}

export const ItineraryDetailView: React.FC<ItineraryDetailViewProps> = ({
  trip,
  onUpdateTrip,
  onBackToTrips,
}) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [viewAllDays, setViewAllDays] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [savedToast, setSavedToast] = useState(false);

  // Modals state
  const [activityModalOpen, setActivityModalOpen] = useState(false);
  const [activeSlotForModal, setActiveSlotForModal] = useState<
    'morning' | 'afternoon' | 'evening' | 'additional'
  >('morning');
  const [editingActivity, setEditingActivity] = useState<ActivitySlot | undefined>(undefined);
  const [tripEditModalOpen, setTripEditModalOpen] = useState(false);

  const days = trip.days || [];
  const currentDay = days[selectedDayIdx] || days[0];

  // Toggle activity completed
  const handleToggleCompleted = (dayIdx: number, slotKey: 'morning' | 'afternoon' | 'evening' | number) => {
    const updatedDays = [...trip.days];
    const targetDay = { ...updatedDays[dayIdx] };

    if (slotKey === 'morning') {
      targetDay.morning = { ...targetDay.morning, completed: !targetDay.morning.completed };
    } else if (slotKey === 'afternoon') {
      targetDay.afternoon = { ...targetDay.afternoon, completed: !targetDay.afternoon.completed };
    } else if (slotKey === 'evening') {
      targetDay.evening = { ...targetDay.evening, completed: !targetDay.evening.completed };
    } else if (typeof slotKey === 'number' && targetDay.additionalActivities) {
      const additionals = [...targetDay.additionalActivities];
      additionals[slotKey] = {
        ...additionals[slotKey],
        completed: !additionals[slotKey].completed,
      };
      targetDay.additionalActivities = additionals;
    }

    updatedDays[dayIdx] = targetDay;
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Open edit modal for an activity
  const handleOpenEditActivity = (
    activity: ActivitySlot,
    slotType: 'morning' | 'afternoon' | 'evening' | 'additional'
  ) => {
    setEditingActivity(activity);
    setActiveSlotForModal(slotType);
    setActivityModalOpen(true);
  };

  // Open add modal for an activity
  const handleOpenAddActivity = () => {
    setEditingActivity(undefined);
    setActiveSlotForModal('additional');
    setActivityModalOpen(true);
  };

  // Save activity from modal
  const handleSaveActivity = (
    savedActivity: ActivitySlot,
    slotType: 'morning' | 'afternoon' | 'evening' | 'additional'
  ) => {
    const updatedDays = [...trip.days];
    const targetDay = { ...updatedDays[selectedDayIdx] };

    if (slotType === 'morning') {
      targetDay.morning = savedActivity;
    } else if (slotType === 'afternoon') {
      targetDay.afternoon = savedActivity;
    } else if (slotType === 'evening') {
      targetDay.evening = savedActivity;
    } else {
      // additional
      const currentAdditional = targetDay.additionalActivities || [];
      const existingIdx = currentAdditional.findIndex((a) => a.id === savedActivity.id);
      if (existingIdx >= 0) {
        currentAdditional[existingIdx] = savedActivity;
        targetDay.additionalActivities = [...currentAdditional];
      } else {
        targetDay.additionalActivities = [...currentAdditional, savedActivity];
      }
    }

    updatedDays[selectedDayIdx] = targetDay;
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Delete activity
  const handleDeleteActivity = (
    dayIdx: number,
    slotType: 'morning' | 'afternoon' | 'evening' | number
  ) => {
    const updatedDays = [...trip.days];
    const targetDay = { ...updatedDays[dayIdx] };

    if (slotType === 'morning') {
      targetDay.morning = {
        id: `act-${Date.now()}`,
        title: 'Free Morning Exploration',
        time: '09:00 AM - 12:00 PM',
        category: 'Relaxation',
        description: 'Unscheduled time to relax, explore neighborhood cafés, or sleep in.',
        location: trip.destination,
        estimatedCost: 0,
      };
    } else if (slotType === 'afternoon') {
      targetDay.afternoon = {
        id: `act-${Date.now()}`,
        title: 'Open Afternoon',
        time: '01:30 PM - 04:30 PM',
        category: 'Relaxation',
        description: 'Flexible afternoon block for spontaneous wandering or souvenir shopping.',
        location: trip.destination,
        estimatedCost: 0,
      };
    } else if (slotType === 'evening') {
      targetDay.evening = {
        id: `act-${Date.now()}`,
        title: 'Leisurely Evening',
        time: '06:30 PM - 09:30 PM',
        category: 'Relaxation',
        description: 'Dinner at leisure and sunset stroll.',
        location: trip.destination,
        estimatedCost: 0,
      };
    } else if (typeof slotType === 'number' && targetDay.additionalActivities) {
      targetDay.additionalActivities = targetDay.additionalActivities.filter(
        (_, idx) => idx !== slotType
      );
    }

    updatedDays[dayIdx] = targetDay;
    onUpdateTrip({ ...trip, days: updatedDays });
  };

  // Export JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${trip.destination.toLowerCase().replace(/[^a-z0-9]/g, '-')}-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Share link copy
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2500);
  };

  // Manual save confirmation
  const handleSaveTrip = () => {
    onUpdateTrip(trip);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto pb-16 space-y-6">
      {/* Top back button and action strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        <button
          onClick={onBackToTrips}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-white border border-slate-200/80 shadow-xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Trips</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSaveTrip}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5 text-teal-600" />
            <span>{savedToast ? 'Saved!' : 'Save Trip'}</span>
          </button>

          <button
            onClick={() => setTripEditModalOpen(true)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Edit Trip</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Print or Save as PDF"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200/80 shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Export JSON Data"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            onClick={handleShareLink}
            className="px-3 py-1.5 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{shareToast ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs">
        <div className="relative h-56 sm:h-72 w-full bg-slate-900 overflow-hidden">
          <img
            src={trip.coverImage}
            alt={trip.destination}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/35 to-transparent" />

          {/* Source badge */}
          <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white text-xs font-medium font-mono-numbers">
            <Sparkles className="w-3 h-3 text-teal-400" />
            <span className="capitalize">{trip.source === 'gemini' ? 'Gemini 3.8 Flash' : 'AI Architect Plan'}</span>
          </div>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex items-center gap-2 text-xs font-semibold text-teal-300 uppercase tracking-wider mb-1">
              <MapPin className="w-4 h-4" />
              <span>{trip.destination}</span>
              {trip.departureCity && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>From {trip.departureCity}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm text-balance">
              {trip.title}
            </h1>
          </div>
        </div>

        {/* Quick parameters bar */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Duration & Dates</div>
            <div className="text-sm font-bold text-slate-900 font-mono-numbers mt-0.5">
              {trip.durationDays} Days · {trip.startDate ? trip.startDate.slice(5) : 'Flexible'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Party Size</div>
            <div className="text-sm font-bold text-slate-900 font-mono-numbers mt-0.5">
              {trip.travelers} {trip.travelers === 1 ? 'Solo Traveler' : 'Travelers'}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Estimated Budget</div>
            <div className="text-sm font-bold text-teal-700 font-mono-numbers mt-0.5">
              ${trip.totalBudget.toLocaleString()} <span className="text-xs font-normal text-slate-400">({trip.budgetTier})</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Travel Pace</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              {trip.travelStyle || 'Balanced'}
            </div>
          </div>
        </div>

        {/* Overview paragraph */}
        <div className="px-4 sm:px-6 pb-6 pt-0 text-sm text-slate-600 border-t border-slate-100 pt-4 leading-relaxed">
          {trip.tripOverview}
        </div>
      </div>

      {/* Main Itinerary Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Day-by-Day Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Day Navigation Tabs */}
          <div className="bg-white p-2 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between gap-2 overflow-x-auto no-print">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {days.map((day, idx) => (
                <button
                  key={day.dayNumber}
                  onClick={() => {
                    setSelectedDayIdx(idx);
                    setViewAllDays(false);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    !viewAllDays && selectedDayIdx === idx
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Day {day.dayNumber}</span>
                  {day.date && <span className="text-[10px] ml-1.5 opacity-80">{day.date.split(',')[0]}</span>}
                </button>
              ))}
            </div>

            <button
              onClick={() => setViewAllDays(!viewAllDays)}
              className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors shrink-0 cursor-pointer ${
                viewAllDays
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {viewAllDays ? 'Day View' : 'View All Days'}
            </button>
          </div>

          {/* Render Days */}
          {(viewAllDays ? days : [currentDay]).map((day, dayIndex) => {
            const actualDayIdx = viewAllDays ? dayIndex : selectedDayIdx;
            if (!day) return null;

            return (
              <div
                key={day.dayNumber}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-6 p-6"
              >
                {/* Day Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider">
                      <span>Day {day.dayNumber}</span>
                      {day.date && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{day.date}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mt-0.5">{day.theme}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-mono-numbers">
                      Est. Day Cost: <strong className="text-slate-900 font-bold">${day.estimatedDayCost}</strong>
                    </span>
                    <button
                      onClick={handleOpenAddActivity}
                      className="px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50 rounded-lg flex items-center gap-1 border border-teal-200 cursor-pointer no-print"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Activity</span>
                    </button>
                  </div>
                </div>

                {/* Transit Overview Strip */}
                {day.transitSummary && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-600">
                    <Navigation className="w-4 h-4 text-teal-600 shrink-0" />
                    <span><strong className="text-slate-800">Transit:</strong> {day.transitSummary}</span>
                  </div>
                )}

                {/* Activity Slots: Morning, Afternoon, Evening */}
                <div className="space-y-4">
                  {/* Morning */}
                  <ActivityCard
                    slotLabel="Morning"
                    slotIcon={Sunrise}
                    slotTimeColor="text-amber-600"
                    slotBorderColor="border-amber-100"
                    activity={day.morning}
                    onToggleComplete={() => handleToggleCompleted(actualDayIdx, 'morning')}
                    onEdit={() => handleOpenEditActivity(day.morning, 'morning')}
                    onDelete={() => handleDeleteActivity(actualDayIdx, 'morning')}
                  />

                  {/* Afternoon */}
                  <ActivityCard
                    slotLabel="Afternoon"
                    slotIcon={Sun}
                    slotTimeColor="text-orange-600"
                    slotBorderColor="border-orange-100"
                    activity={day.afternoon}
                    onToggleComplete={() => handleToggleCompleted(actualDayIdx, 'afternoon')}
                    onEdit={() => handleOpenEditActivity(day.afternoon, 'afternoon')}
                    onDelete={() => handleDeleteActivity(actualDayIdx, 'afternoon')}
                  />

                  {/* Evening */}
                  <ActivityCard
                    slotLabel="Evening"
                    slotIcon={Moon}
                    slotTimeColor="text-indigo-600"
                    slotBorderColor="border-indigo-100"
                    activity={day.evening}
                    onToggleComplete={() => handleToggleCompleted(actualDayIdx, 'evening')}
                    onEdit={() => handleOpenEditActivity(day.evening, 'evening')}
                    onDelete={() => handleDeleteActivity(actualDayIdx, 'evening')}
                  />

                  {/* Additional user-added activities */}
                  {(day.additionalActivities || []).map((extraAct, extraIdx) => (
                    <ActivityCard
                      key={extraAct.id || extraIdx}
                      slotLabel="Extra Activity"
                      slotIcon={Compass}
                      slotTimeColor="text-teal-600"
                      slotBorderColor="border-teal-100"
                      activity={extraAct}
                      onToggleComplete={() => handleToggleCompleted(actualDayIdx, extraIdx)}
                      onEdit={() => handleOpenEditActivity(extraAct, 'additional')}
                      onDelete={() => handleDeleteActivity(actualDayIdx, extraIdx)}
                    />
                  ))}
                </div>

                {/* Daily Dining Section */}
                {day.dining && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                      <Utensils className="w-4 h-4 text-teal-600" />
                      <span>Curated Daily Dining</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <Coffee className="w-3.5 h-3.5 text-amber-600" />
                          <span>Breakfast</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{day.dining.breakfast}</p>
                      </div>

                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <Utensils className="w-3.5 h-3.5 text-orange-600" />
                          <span>Lunch</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{day.dining.lunch}</p>
                      </div>

                      <div className="p-3 bg-slate-50/70 rounded-xl border border-slate-100">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-1">
                          <Moon className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Dinner</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{day.dining.dinner}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right 1 Col: Budget Breakdown & Essential Tips */}
        <div className="space-y-6">
          {/* Estimated Budget Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-teal-600" />
                <span>Budget Breakdown</span>
              </h3>
              <span className="text-xs font-mono-numbers font-bold text-teal-700">
                ${trip.budgetBreakdown.total.toLocaleString()} Total
              </span>
            </div>

            <div className="space-y-3">
              <BudgetItem
                label="Accommodations"
                amount={trip.budgetBreakdown.accommodation}
                total={trip.budgetBreakdown.total}
                colorClass="bg-teal-600"
              />
              <BudgetItem
                label="Dining & Culinary"
                amount={trip.budgetBreakdown.dining}
                total={trip.budgetBreakdown.total}
                colorClass="bg-amber-500"
              />
              <BudgetItem
                label="Attractions & Activities"
                amount={trip.budgetBreakdown.activities}
                total={trip.budgetBreakdown.total}
                colorClass="bg-indigo-500"
              />
              <BudgetItem
                label="Local Transportation"
                amount={trip.budgetBreakdown.transportation}
                total={trip.budgetBreakdown.total}
                colorClass="bg-emerald-500"
              />
              <BudgetItem
                label="Buffer & Souvenirs"
                amount={trip.budgetBreakdown.misc}
                total={trip.budgetBreakdown.total}
                colorClass="bg-slate-400"
              />
            </div>

            <div className="p-3 bg-teal-50/70 border border-teal-100 rounded-xl text-[11px] text-teal-900">
              Average estimated cost: <strong className="font-mono-numbers">${Math.round(trip.budgetBreakdown.total / (trip.durationDays || 1))}</strong> per day for {trip.travelers} {trip.travelers === 1 ? 'person' : 'people'}.
            </div>
          </div>

          {/* Essential Travel Tips */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lightbulb className="w-4 h-4 text-teal-600" />
              <span>Essential Local Tips</span>
            </h3>

            <div className="space-y-3">
              {(trip.essentialTips || []).map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-600 shrink-0 mt-1.5" />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics Summary */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Logistics & Pacing
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Accommodation Style:</span>
                <span className="font-semibold text-slate-800">{trip.accommodationPreference || 'Boutique'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-500">Preferred Transport:</span>
                <span className="font-semibold text-slate-800">{trip.transportPreference || 'Public Transit'}</span>
              </div>
              {trip.dietaryOrSpecialNotes && (
                <div className="pt-2 text-slate-600">
                  <span className="text-slate-500 font-semibold block mb-0.5">Special Requests:</span>
                  <p className="italic bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                    "{trip.dietaryOrSpecialNotes}"
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity Add / Edit Modal */}
      <ActivityModal
        isOpen={activityModalOpen}
        onClose={() => setActivityModalOpen(false)}
        dayNumber={currentDay?.dayNumber || 1}
        slotType={activeSlotForModal}
        initialActivity={editingActivity}
        onSave={handleSaveActivity}
      />

      {/* Trip General Details Edit Modal */}
      <TripEditModal
        isOpen={tripEditModalOpen}
        onClose={() => setTripEditModalOpen(false)}
        trip={trip}
        onSave={(updated) => onUpdateTrip(updated)}
      />
    </div>
  );
};

// Activity Slot Card Component
interface ActivityCardProps {
  slotLabel: string;
  slotIcon: React.ElementType;
  slotTimeColor: string;
  slotBorderColor: string;
  activity: ActivitySlot;
  onToggleComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const ActivityCard: React.FC<ActivityCardProps> = ({
  slotLabel,
  slotIcon: SlotIcon,
  slotTimeColor,
  activity,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  if (!activity) return null;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        activity.completed
          ? 'bg-slate-50/80 border-slate-200 opacity-75'
          : 'bg-white border-slate-200/80 hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          {/* Completion Checkbox */}
          <button
            onClick={onToggleComplete}
            className="text-slate-400 hover:text-teal-600 transition-colors cursor-pointer mt-0.5"
            aria-label={activity.completed ? 'Mark activity incomplete' : 'Mark activity complete'}
          >
            {activity.completed ? (
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
            ) : (
              <Circle className="w-4 h-4 text-slate-300 hover:text-teal-500" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <SlotIcon className={`w-3.5 h-3.5 ${slotTimeColor}`} />
                <span className="capitalize">{slotLabel}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="font-mono-numbers text-slate-700">{activity.time}</span>
              {activity.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[11px] font-normal text-slate-400">{activity.duration}</span>
                </>
              )}
            </div>

            <h4
              className={`text-sm sm:text-base font-bold mt-0.5 text-slate-900 ${
                activity.completed ? 'line-through text-slate-500' : ''
              }`}
            >
              {activity.title}
            </h4>
          </div>
        </div>

        {/* Action icons: Edit and Delete */}
        <div className="flex items-center gap-1 shrink-0 no-print">
          <button
            onClick={onEdit}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Edit Activity"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
            title="Remove Activity"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 ml-6 leading-relaxed mb-3">
        {activity.description}
      </p>

      {/* Meta tags line: location, cost, transport, tips */}
      <div className="ml-6 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 pt-2 border-t border-slate-100">
        <span className="flex items-center gap-1 font-medium text-slate-700">
          <MapPin className="w-3 h-3 text-slate-400" />
          <span>{activity.location}</span>
        </span>

        <span aria-hidden="true" className="text-slate-300">·</span>

        <span className="font-mono-numbers text-slate-700">
          {activity.estimatedCost > 0 ? `$${activity.estimatedCost} est.` : 'Free access'}
        </span>

        {activity.transportNote && (
          <>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Navigation className="w-3 h-3 text-slate-400" />
              <span>{activity.transportNote}</span>
            </span>
          </>
        )}

        {activity.tips && (
          <div className="w-full mt-1.5 p-2 bg-amber-50/70 text-amber-900 rounded-md text-[11px] flex items-start gap-1.5 border border-amber-100/60">
            <Lightbulb className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
            <span><strong>Tip:</strong> {activity.tips}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Budget item progress bar row
const BudgetItem: React.FC<{
  label: string;
  amount: number;
  total: number;
  colorClass: string;
}> = ({ label, amount, total, colorClass }) => {
  const percentage = total > 0 ? Math.round((amount / total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="font-medium text-slate-700">{label}</span>
        <span className="font-mono-numbers font-semibold text-slate-900">
          ${amount.toLocaleString()} <span className="text-[11px] text-slate-400 font-normal">({percentage}%)</span>
        </span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${colorClass} h-full rounded-full transition-all duration-300`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
    </div>
  );
};
