import { create } from "zustand";

export type TripPlan = {
  origin?: string;
  destination?: string;
  duration?: string;
  budget?: string;
  groupSize?: string;
  group_size?: string;
  itinerary?: any[];
  hotels?: any[];
  estimatedTotalCost?: string;
};

interface TripStore {
  tripData: { trip_plan: TripPlan } | null;
  setTripData: (
    tripData: { trip_plan: TripPlan } | null
  ) => void;
}

export const useTripStore = create<TripStore>((set) => ({
  tripData: null,

  setTripData: (tripData) =>
    set({ tripData }),
}));