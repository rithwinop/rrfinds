import { NextRequest, NextResponse } from "next/server";
import { searchMockItems } from "@/lib/mock-data";
import type { SearchResult, SearchQuery } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const query: SearchQuery = {
      q: searchParams.get("q") || undefined,
      platform: (searchParams.get("platform") as SearchQuery["platform"]) || undefined,
      sellerId: searchParams.get("sellerId") || undefined,
      itemId: searchParams.get("itemId") || undefined,
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "20", 10),
      sortBy: (searchParams.get("sortBy") as SearchQuery["sortBy"]) || "relevance",
    };

    // Validate page and limit
    query.page = Math.max(1, Math.min(query.page, 100));
    query.limit = Math.max(1, Math.min(query.limit, 50));

    const result = searchMockItems(query);

    const response: SearchResult = {
      items: result.items,
      total: result.total,
      page: query.page,
      pageSize: query.limit,
      hasMore: result.hasMore,
      query,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const query: SearchQuery = {
      q: body.q,
      platform: body.platform,
      sellerId: body.sellerId,
      itemId: body.itemId,
      page: body.page || 1,
      limit: body.limit || 20,
      sortBy: body.sortBy || "relevance",
    };

    query.page = Math.max(1, Math.min(query.page, 100));
    query.limit = Math.max(1, Math.min(query.limit, 50));

    const result = searchMockItems(query);

    const response: SearchResult = {
      items: result.items,
      total: result.total,
      page: query.page,
      pageSize: query.limit,
      hasMore: result.hasMore,
      query,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}