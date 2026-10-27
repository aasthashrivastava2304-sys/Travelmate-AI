import React, { useState, useEffect } from 'react';
import {
  User,
  Plane,
  Coins,
  Compass,
  Database,
  Server,
  Code2,
  Download,
  RotateCcw,
  Trash2,
  Check,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { UserSettings, saveUserSettings } from '../utils/storage';
import { Trip } from '../types/travel';

interface SettingsViewProps {
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
  trips: Trip[];
  onResetSampleData: () => void;
  onClearAllTrips: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  userSettings,
  onUpdateSettings,
  trips,
  onResetSampleData,
  onClearAllTrips,
}) => {
  const [userName, setUserName] = useState(userSettings.userName);
  const [homeAirport, setHomeAirport] = useState(userSettings.homeAirport);
  const [currency, setCurrency] = useState(userSettings.currency);
  const [preferredPace, setPreferredPace] = useState(userSettings.preferredPace);
  const [savedToast, setSavedToast] = useState(false);

  // Backend status check
  const [backendStatus, setBackendStatus] = useState<{
    status: string;
    hasGeminiKey: boolean;
    backend: string;
    version: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/status')
      .then((r) => r.json())
      .then((data) => setBackendStatus(data))
      .catch(() =>
        setBackendStatus({
          status: 'client-only',
          hasGeminiKey: false,
          backend: 'Client Storage Engine',
          version: '1.0.0',
        })
      );
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserSettings = {
      ...userSettings,
      userName: userName.trim(),
      homeAirport: homeAirport.trim(),
      currency,
      preferredPace,
    };
    saveUserSettings(updated);
    onUpdateSettings(updated);
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2000);
  };

  const handleExportAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trips, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `travelmate-trips-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    a.remove();
  };

  return (
    <div className="max-w-4xl mx-auto pb-16 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Settings & Workspace</h2>
        <p className="text-xs text-slate-500 mt-1">
          Customize personal preferences and inspect full-stack integration status
        </p>
      </div>

      {/* User Preferences Form */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <User className="w-4 h-4 text-teal-600" />
          <span>Traveler Profile Preferences</span>
        </h3>

        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Plane className="w-3.5 h-3.5 text-slate-400" />
                <span>Default Departure City / Airport</span>
              </label>
              <input
                type="text"
                value={homeAirport}
                onChange={(e) => setHomeAirport(e.target.value)}
                placeholder="e.g. SFO (San Francisco Intl)"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Currency</span>
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
              >
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
                <option value="JPY (¥)">JPY (¥) - Japanese Yen</option>
                <option value="AUD ($)">AUD ($) - Australian Dollar</option>
                <option value="CAD ($)">CAD ($) - Canadian Dollar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-400" />
                <span>Default Travel Cadence</span>
              </label>
              <select
                value={preferredPace}
                onChange={(e) => setPreferredPace(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg focus:outline-teal-600 bg-white"
              >
                <option value="Balanced">Balanced (Highlights + Leisure)</option>
                <option value="Relaxed">Relaxed (Zero rush, slow mornings)</option>
                <option value="Action-packed">Action-Packed (Max sights)</option>
                <option value="Hidden gems">Hidden Gems (Local secrets)</option>
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{savedToast ? 'Preferences Saved!' : 'Save Preferences'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Backend & Architecture Overview */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-teal-600" />
            <span>Architecture & Backend Status</span>
          </h3>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-medium text-slate-600">Server Status:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
              Online
            </span>
          </div>
        </div>

        {/* Status Info Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Gemini AI Engine Integration</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {backendStatus?.hasGeminiKey
                ? 'Server is running with active GEMINI_API_KEY. Itineraries will be synthesized by Gemini 3.8 Flash with structured JSON validation.'
                : 'Server-side Gemini endpoint configured. When GEMINI_API_KEY is not provided, TravelMate seamlessly runs the built-in procedural smart generator with verified local databases.'}
            </p>
            <div className="text-[11px] font-mono-numbers text-slate-500 pt-1">
              Active Mode: <strong className="text-teal-700">{backendStatus?.hasGeminiKey ? 'Gemini 3.8 Flash' : 'High-Fidelity Smart Generator'}</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
            <div className="font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-teal-600" />
              <span>Future Supabase & FastAPI Schema</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Data contracts are structured for frictionless migration to a PostgreSQL / Supabase backend or Python FastAPI microservice with standard relational DDL.
            </p>
            <div className="text-[11px] font-mono-numbers text-slate-500 pt-1">
              Persistence: <strong className="text-slate-700">Client LocalStorage + REST Ready</strong>
            </div>
          </div>
        </div>

        {/* Database Schema Reference */}
        <div className="p-4 bg-slate-900 text-slate-200 rounded-xl font-mono text-[11px] overflow-x-auto space-y-2">
          <div className="text-slate-400 font-sans text-xs font-semibold flex items-center justify-between">
            <span>Supabase / PostgreSQL DDL Specification</span>
            <span className="text-teal-400 font-mono text-[10px]">v1.0.0</span>
          </div>
          <pre className="text-slate-300 leading-relaxed">
{`CREATE TABLE trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_city TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  duration_days INT NOT NULL,
  travelers INT DEFAULT 1,
  budget_tier TEXT CHECK (budget_tier IN ('Budget','Moderate','Luxury','Ultra-Luxury')),
  total_budget NUMERIC(10,2),
  travel_style TEXT,
  days_data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);`}
          </pre>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Database className="w-4 h-4 text-teal-600" />
          <span>Data Storage Management</span>
        </h3>
        <p className="text-xs text-slate-500">
          Manage your saved itinerary records, reset sample trips, or export full JSON backups.
        </p>

        <div className="pt-2 flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportAll}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export All Trips (JSON)</span>
          </button>

          <button
            onClick={onResetSampleData}
            className="px-4 py-2 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Curated Sample Trips</span>
          </button>

          <button
            onClick={onClearAllTrips}
            className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All Trips</span>
          </button>
        </div>
      </div>
    </div>
  );
};
