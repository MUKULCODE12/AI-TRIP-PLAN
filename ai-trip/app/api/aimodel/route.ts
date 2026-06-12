import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { TripSchema } from "@/schemas/tripSchema";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CHAT_SYSTEM_PROMPT = `You are an AI trip planner assistant. Your job is to help users plan their trips step by step.

You MUST respond with valid JSON (no markdown, no code fences) in this exact format:
{
  "responseText": "Your friendly message to the user",
  "ui": "none"
}

The "ui" field controls which interactive component to show. Use these values:
- "none" — for normal conversation messages (greetings, clarifications, general info)
- "budget" — when you need to ask about the user's budget preference (cheap, moderate, luxury). Ask this AFTER knowing both the origin and destination.
- "groupSize" — when you need to ask about group size (solo, couple, family, friends). Ask this AFTER knowing the budget.
- "tripDuration" — when you need to ask how many days the trip will be. Ask this AFTER knowing the group size.
- "final" — when you have collected ALL details (origin, destination, budget, group size, and duration) and are ready to generate the trip. Show a summary of what was collected.

Follow this conversation flow:
1. First, understand where the user is starting from (origin) and where they want to go (destination)
2. Then show budget options (ui: "budget")
3. Then show group size options (ui: "groupSize")
4. Then show trip duration selector (ui: "tripDuration")
5. Finally, confirm all details and show the generate button (ui: "final")

IMPORTANT: Always respond with valid JSON only. No extra text outside the JSON object.`;

const FINAL_SYSTEM_PROMPT = `You are an AI trip planner. Based on the conversation, generate a detailed trip plan.

You MUST respond with valid JSON (no markdown, no code fences) in this exact format:
{
  "trip_plan": {
    "origin": "City, Country",
    "destination": "City, Country",
    "duration": "X Days",
    "budget": "Budget Level",
    "groupSize": "Group Description",
    "itinerary": [
      {
        "day": 1,
        "title": "Day 1 Title",
        "activities": [
          {
            "time": "9:00 AM",
            "activity": "Activity name",
            "description": "Brief description",
            "estimatedCost": "₹XX"
          }
        ]
      }
    ],
    "hotels": [
      {
        "name": "Hotel Name",
        "pricePerNight": "₹XX",
        "rating": "4.5",
        "description": "Brief description"
      }
    ],
    "estimatedTotalCost": "₹XXX"
  }
}

Generate a realistic, detailed itinerary with 3-5 activities per day. Include real-world hotel suggestions appropriate for the budget level. Use real place names and landmarks. All costs MUST be in Indian Rupees (₹). IMPORTANT: Always respond with valid JSON only.`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body?.messages || [];
    const isFinal = body?.isFinal || false;

    if (!messages.length) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 }
      );
    }

    const systemPrompt = isFinal ? FINAL_SYSTEM_PROMPT : CHAT_SYSTEM_PROMPT;

    // Build conversation for Groq (OpenAI format)
    const formattedMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.content || "",
      })),
    ];

    // Call Groq API
    const chatCompletion = await groq.chat.completions.create({
      messages: formattedMessages as any,
      model: "llama-3.3-70b-versatile", // Powerful free model
      response_format: { type: "json_object" }, // Guarantees JSON output
    });

    const text = chatCompletion.choices[0]?.message?.content || "{}";

    // Try to parse the AI response as JSON
    try {
      const parsed = JSON.parse(text);

if (isFinal) {
  const validated = TripSchema.safeParse(parsed);

  if (!validated.success) {
    console.error(validated.error);

    return NextResponse.json(
      {
        error: "Invalid trip plan generated",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    trip_plan: validated.data.trip_plan,
  });
}

      return NextResponse.json({
        responseText: parsed.responseText || text,
        ui: parsed.ui || "none",
      });
    } catch {
      if (isFinal) {
        return NextResponse.json({ trip_plan: { rawResponse: text } });
      }
      return NextResponse.json({ responseText: text, ui: "none" });
    }
  } catch (error) {
    console.error("SERVER ERROR:", error);
    return NextResponse.json(
      { error: "AI failed to generate response. Please try again." },
      { status: 500 }
    );
  }
}