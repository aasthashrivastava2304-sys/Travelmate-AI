import React, { useState } from 'react';
import { X, Check } from 'lucide-react';
import { ActivityCategory, ActivitySlot } from '../types/travel';

interface ActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dayNumber: number;
  slotType: 'morning' | 'afternoon' | 'evening' | 'additional';
  initialActivity?: ActivitySlot;
  onSave: (activity: ActivitySlot, slotType: 'morning' | 'afternoon' | 'evening' | 'additional') => void;
}

const CATEGORIES: ActivityCategory[] = [
  'Sightseeing',
  'Food',
  'Adventure',
  'Culture',
  'Nature',
  'Relaxation',
  'Shopping',
];

export const ActivityModal: React.FC<ActivityModalProps> = ({
  isOpen,
  onClose,
  dayNumber,
  slotType,
  initialActivity,
  onSave,
}) => {
  const [title, setTitle] = useState(initialActivity?.title || '');
  const [time, setTime] = useState(
    initialActivity?.time ||
      (slotType === 'morning'
        ? '09:00 AM - 12:00 PM'
        : slotType === 'afternoon'
        ? '01:30 PM - 04:30 PM'
        : '06:30 PM - 09:30 PM')
  );
  const [category, setCategory] = useState<ActivityCategory>(
    initialActivity?.category || 'Sightseeing'
  );
  const [location, setLocation] = useState(initialActivity?.location || '');
  const [cost, setCost] = useState(initialActivity?.estimatedCost?.toString() || '25');
  const [description, setDescription] = useState(initialActivity?.description || '');
  const [transportNote, setTransportNote] = useState(initialActivity?.transportNote || '');
  const [tips, setTips] = useState(initialActivity?.tips || '');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Activity title is required');
      return;
    }
    if (!location.trim()) {
      setError('Location is required');
      return;
    }

    const activity: ActivitySlot = {
      id: initialActivity?.id || `act-custom-${Date.now()}`,
      title: title.trim(),
      time: time.trim(),
      category,
      location: location.trim(),
      estimatedCost: Number(cost) || 0,
      description: description.trim() || 'Custom planned activity.',
      transportNote: transportNote.trim(),
      tips: tips.trim(),
      completed: initialActivity?.completed || false,
    };

    onSave(activity, slotType);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {initialActivity ? 'Edit Activity' : 'Add Activity'}
            </h3>
            <p className="text-xs text-slate-500 capitalize">
              Day {dayNumber} · {slotType} Slot
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setError('');
              }}
              placeholder="e.g., Fushimi Inari Torii Gate Hike"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Time Window
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="09:00 AM - 12:00 PM"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600 font-mono-numbers"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ActivityCategory)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600 bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Location / Venue *
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setError('');
                }}
                placeholder="e.g., Higashiyama Ward"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Cost ($)
              </label>
              <input
                type="number"
                min="0"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="0"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600 font-mono-numbers"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Highlights
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What to experience, see, and do during this session..."
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Transport Note
              </label>
              <input
                type="text"
                value={transportNote}
                onChange={(e) => setTransportNote(e.target.value)}
                placeholder="e.g., 10-min walk or bus #206"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Insider Tip
              </label>
              <input
                type="text"
                value={tips}
                onChange={(e) => setTips(e.target.value)}
                placeholder="e.g., Arrive before 8:30 AM"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 focus:border-teal-600"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{initialActivity ? 'Save Changes' : 'Add Activity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
