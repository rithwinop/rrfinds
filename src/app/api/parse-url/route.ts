import { NextRequest, NextResponse } from "next/server";
import { parseListingInput } from "@/lib/url-parser";
import type { ParsedListingRef } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { input } = body as { input?: string };

    if (!input || typeof input !== "string") {
      return NextResponse.json(
        { error: "Input is required" },
        { status: 400 }
      );
    }

    const result = parseListingInput(input);

    if (!result) {
      return NextResponse.json(
        { error: "Could not parse URL or ID. Please check the format." },
        { status: 422 }
      );
    }

    return NextResponse.json<ParsedListingRef>(result);
  } catch (error) {
    console.error("Parse URL error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Input parameter is required" },
      { status: 400 }
    );
  }

  const result = parseListingInput(input);

  if (!result) {
    return NextResponse.json(
      { error: "Could not parse URL or ID. Please check the format." },
      { status: 422 }
    );
  }

  return NextResponse.json<ParsedListingRef>(result);
}