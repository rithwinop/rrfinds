import type { Platform, ParsedListingRef } from "@/types";

const PLATFORM_PATTERNS: Record<Platform, RegExp[]> = {
  taobao: [
    /item\.taobao\.com\/item\.htm.*[?&]id=(\d+)/i,
    /m\.taobao\.com\/.*[?&]id=(\d+)/i,
    /detail\.tmall\.com\/item\.htm.*[?&]id=(\d+)/i,
    /taobao\.com\/.*[?&]item_id=(\d+)/i,
    /tmall\.com\/.*[?&]item_id=(\d+)/i,
    /\/item\/(\d+)\.html/i,
    /\/(\d{8,14})(?:\.html|$)/i,
  ],
  "1688": [
    /detail\.1688\.com\/offer\/(\d+)\.html/i,
    /m\.1688\.com\/.*[?&]offer_id=(\d+)/i,
    /1688\.com\/.*[?&]offer_id=(\d+)/i,
    /\/offer\/(\d+)\.html/i,
    /\/(\d{9,14})(?:\.html|$)/i,
  ],
  weidian: [
    /weidian\.com\/.*[?&]item_id=(\d+)/i,
    /weidian\.com\/item\/(\d+)/i,
    /wdian\.com\/.*[?&]item_id=(\d+)/i,
    /\/item\/(\d+)/i,
    /\/(\d{8,13})(?:\.html|$)/i,
  ],
};

const AGENT_PATTERNS = [
  /k\.youshop10\.com/i,
  /superbuy\.com/i,
  /wegobuy\.com/i,
  /cssbuy\.net/i,
  /pandabuy\.com/i,
  /sugargoo\.com/i,
  /orientdig\.com/i,
  /hagobuy\.com/i,
];

const AGENT_PARAMS = ["id", "itemID", "num_iid", "itemid", "goods_id", "offer_id"];

function extractIdFromUrl(url: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

function extractIdFromAgentUrl(url: string): { platform: Platform; itemId: string } | null {
  try {
    const urlObj = new URL(url);
    for (const param of AGENT_PARAMS) {
      const value = urlObj.searchParams.get(param);
      if (value && /^\d{8,14}$/.test(value)) {
        const platform = detectPlatformFromAgentUrl(url);
        if (platform) {
          return { platform, itemId: value };
        }
      }
    }
    const pathMatch = url.match(/\/(?:item|offer)\/(\d+)/i);
    if (pathMatch) {
      const platform = detectPlatformFromAgentUrl(url);
      if (platform) {
        return { platform, itemId: pathMatch[1] };
      }
    }
  } catch {
    // Invalid URL, try regex fallback
  }
  return null;
}

function detectPlatformFromAgentUrl(url: string): Platform | null {
  const lower = url.toLowerCase();
  if (lower.includes("taobao") || lower.includes("tmall")) return "taobao";
  if (lower.includes("1688")) return "1688";
  if (lower.includes("weidian") || lower.includes("wdian")) return "weidian";
  return null;
}

function detectPlatform(url: string): Platform | null {
  const lower = url.toLowerCase();
  if (lower.includes("taobao") || lower.includes("tmall")) return "taobao";
  if (lower.includes("1688")) return "1688";
  if (lower.includes("weidian") || lower.includes("wdian")) return "weidian";
  for (const agent of AGENT_PATTERNS) {
    if (agent.test(lower)) {
      return detectPlatformFromAgentUrl(url);
    }
  }
  return null;
}

function buildCanonicalUrl(platform: Platform, itemId: string, skuId?: string): string {
  const baseUrls: Record<Platform, string> = {
    taobao: `https://item.taobao.com/item.htm?id=${itemId}`,
    "1688": `https://detail.1688.com/offer/${itemId}.html`,
    weidian: `https://weidian.com/item.html?item_id=${itemId}`,
  };
  let url = baseUrls[platform];
  if (skuId) {
    url += `&sku_id=${skuId}`;
  }
  return url;
}

export function parseListingInput(rawInput: string): ParsedListingRef | null {
  const trimmed = rawInput.trim();

  if (/^\d{8,14}$/.test(trimmed)) {
    const platform = detectPlatform(trimmed) || "taobao";
    return {
      platform,
      itemId: trimmed,
      canonicalUrl: buildCanonicalUrl(platform, trimmed),
      rawInput: trimmed,
    };
  }

  try {
    new URL(trimmed);
  } catch {
    return null;
  }

  const agentResult = extractIdFromAgentUrl(trimmed);
  if (agentResult) {
    return {
      platform: agentResult.platform,
      itemId: agentResult.itemId,
      canonicalUrl: buildCanonicalUrl(agentResult.platform, agentResult.itemId),
      rawInput: trimmed,
    };
  }

  const platform = detectPlatform(trimmed);
  if (!platform) return null;

  const itemId = extractIdFromUrl(trimmed, PLATFORM_PATTERNS[platform]);
  if (!itemId) return null;

  let skuId: string | undefined;
  try {
    const urlObj = new URL(trimmed);
    const skuMatch = urlObj.searchParams.get("sku_id") || urlObj.searchParams.get("skuId");
    if (skuMatch && /^\d+$/.test(skuMatch)) {
      skuId = skuMatch;
    }
  } catch {
    // Ignore URL parsing errors
  }

  return {
    platform,
    itemId,
    skuId,
    canonicalUrl: buildCanonicalUrl(platform, itemId, skuId),
    rawInput: trimmed,
  };
}

export function parseMultipleInputs(rawInputs: string[]): ParsedListingRef[] {
  return rawInputs
    .map((input) => parseListingInput(input))
    .filter((ref): ref is ParsedListingRef => ref !== null);
}

export function isValidItemId(itemId: string): boolean {
  return /^\d{8,14}$/.test(itemId);
}

export function getPlatformDisplayName(platform: Platform): string {
  const names: Record<Platform, string> = {
    taobao: "Taobao",
    "1688": "1688",
    weidian: "Weidian",
  };
  return names[platform];
}