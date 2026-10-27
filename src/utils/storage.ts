import { Trip } from '../types/travel';
import { INITIAL_SAMPLE_TRIPS } from '../data/sampleTrips';

const STORAGE_KEY = 'travelmate_trips_v1';
const SETTINGS_KEY = 'travelmate_settings_v1';

export interface UserSettings {
  userName: string;
  homeAirport: string;
  currency: string;
  preferredPace: string;
  themePreference: 'light' | 'system';
}

const DEFAULT_SETTINGS: UserSettings = {
  userName: 'Alex Morgan',
  homeAirport: 'SFO (San Francisco Intl)',
  currency: 'USD ($)',
  preferredPace: 'Balanced',
  themePreference: 'light',
};

export function getStoredTrips(): Trip[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed with initial sample trips so the dashboard is complete and beautiful immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TRIPS));
      return INITIAL_SAMPLE_TRIPS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_SAMPLE_TRIPS;
  } catch (error) {
    console.error('Error loading stored trips:', error);
    return INITIAL_SAMPLE_TRIPS;
  }
}

export function saveTrip(trip: Trip): void {
  try {
    const trips = getStoredTrips();
    const existingIdx = trips.findIndex((t) => t.id === trip.id);
    let updated: Trip[];
    if (existingIdx >= 0) {
      updated = [...trips];
      updated[existingIdx] = { ...trip, updatedAt: new Date().toISOString() };
    } else {
      updated = [trip, ...trips];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving trip:', error);
  }
}

export function deleteTrip(tripId: string): Trip[] {
  try {
    const trips = getStoredTrips();
    const filtered = trips.filter((t) => t.id !== tripId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  } catch (error) {
    console.error('Error deleting trip:', error);
    return [];
  }
}

export function duplicateTrip(tripId: string): Trip | null {
  try {
    const trips = getStoredTrips();
    const found = trips.find((t) => t.id === tripId);
    if (!found) return null;

    const duplicated: Trip = {
      ...found,
      id: `trip-copy-${Date.now()}`,
      title: `${found.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updated = [duplicated, ...trips];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return duplicated;
  } catch (error) {
    console.error('Error duplicating trip:', error);
    return null;
  }
}

export function resetToSampleData(): Trip[] {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_TRIPS));
    return INITIAL_SAMPLE_TRIPS;
  } catch (error) {
    console.error('Error resetting sample data:', error);
    return INITIAL_SAMPLE_TRIPS;
  }
}

export function clearAllTrips(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing trips:', error);
  }
}

export function getUserSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: UserSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}
