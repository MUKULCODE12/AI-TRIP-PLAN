import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { placeName } = await req.json();
    const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';
    const config = {
      headers: {
        'Content-type': 'application/json',
        'X-Goog-Api-key': process?.env?.GOOGLE_PLACE_API_KEY,
        'X-Goog-FieldMask': [
          'places.photos',
          'places.displayName',
          'places.id'
        ]
      }
    };
    const result = await axios.post(BASE_URL, {
      textQuery: placeName,
    }, config);

    return NextResponse.json(result?.data);
  } catch (error) {
    console.error("Google Place API error:", error);
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
  }
}