import { NextRequest, NextResponse } from "next/server";
import { getSimilarItemsByHash } from "@/lib/mock-data";
import type { ImageSearchResult } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File | null;
    const hash = formData.get("hash") as string | null;

    if (!file && !hash) {
      return NextResponse.json(
        { error: "Image file or hash is required" },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let queryHash: string;

    if (hash) {
      queryHash = hash;
    } else if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      queryHash = buffer.toString("base64").slice(0, 16);
    } else {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    const similarItems = getSimilarItemsByHash(queryHash, 12);
    const processingTimeMs = Date.now() - startTime;

    const response: ImageSearchResult = {
      queryHash,
      similarItems,
      processingTimeMs,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Image search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}