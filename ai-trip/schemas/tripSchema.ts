import { z } from "zod";

export const TripSchema = z.object({
  trip_plan: z.object({
    origin: z.string(),
    destination: z.string(),
    duration: z.string(),
    budget: z.string(),
    groupSize: z.string(),

    itinerary: z.array(
      z.object({
        day: z.number(),
        title: z.string(),
        activities: z.array(
          z.object({
            time: z.string(),
            activity: z.string(),
            description: z.string(),
            estimatedCost: z.string(),
          })
        ),
      })
    ),

    hotels: z.array(
      z.object({
        name: z.string(),
        pricePerNight: z.string(),
        rating: z.string(),
        description: z.string(),
      })
    ),

    estimatedTotalCost: z.string(),
  }),
});