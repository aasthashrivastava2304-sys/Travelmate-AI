export type ActivityCategory =
  | 'Sightseeing'
  | 'Food'
  | 'Adventure'
  | 'Culture'
  | 'Nature'
  | 'Relaxation'
  | 'Shopping';

export interface ActivitySlot {
  id: string;
  title: string;
  time: string;
  duration?: string;
  category: ActivityCategory;
  description: string;
  location: string;
  estimatedCost: number;
  transportNote?: string;
  tips?: string;
  completed?: boolean;
}

export interface DiningPlan {
  breakfast: string;
  lunch: string;
  dinner: string;
}

export interface DayPlan {
  dayNumber: number;
  date?: string;
  theme: string;
  morning: ActivitySlot;
  afternoon: ActivitySlot;
  evening: ActivitySlot;
  additionalActivities?: ActivitySlot[];
  dining: DiningPlan;
  transitSummary: string;
  estimatedDayCost: number;
}

export interface BudgetBreakdown {
  accommodation: number;
  dining: number;
  activities: number;
  transportation: number;
  misc: number;
  total: number;
}

export interface TripPlannerInput {
  destination: string;
  departureCity: string;
  startDate: string;
  endDate: string;
  durationDays: number;
  travelers: number;
  budgetTier: 'Budget' | 'Moderate' | 'Luxury' | 'Ultra-Luxury';
  totalBudget: number;
  interests: string[];
  travelStyle: 'Relaxed' | 'Balanced' | 'Action-packed' | 'Hidden gems';
  transportPreference: string;
  accommodationPreference: string;
  dietaryOrSpecialNotes: string;
}

export interface Trip extends TripPlannerInput {
  id: string;
  title: string;
  coverImage: string;
  status: 'Upcoming' | 'Past' | 'Draft';
  tripOverview: string;
  days: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  essentialTips: string[];
  createdAt: string;
  updatedAt: string;
  source: 'gemini' | 'smart-generator' | 'curated';
}

export interface DestinationGuide {
  id: string;
  name: string;
  country: string;
  tagline: string;
  description: string;
  idealDuration: string;
  bestSeason: string;
  avgDailyBudget: number;
  tags: string[];
  image: string;
  highlights: string[];
}
