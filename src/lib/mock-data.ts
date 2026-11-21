import type {
  MarketplaceItem,
  SellerInfo,
  SellerMetrics,
  SellerReview,
  QCPhoto,
  SKU,
  PricePoint,
  Platform,
  QCPhotoTag,
  ShippingInfo,
} from "@/types";

const QC_PHOTO_TAGS: QCPhotoTag[] = [
  "stitching",
  "material",
  "logo",
  "sizing",
  "flaws",
  "packaging",
  "label",
  "sole",
  "upper",
  "box",
];

const PLATFORM_DOMAINS: Record<Platform, string> = {
  taobao: "taobao.com",
  "1688": "1688.com",
  weidian: "weidian.com",
};

const PLATFORM_NAMES: Record<Platform, string> = {
  taobao: "Taobao",
  "1688": "1688",
  weidian: "Weidian",
};

function randomItemId(platform: Platform): string {
  const prefixes: Record<Platform, string> = {
    taobao: "6",
    "1688": "1",
    weidian: "2",
  };
  return prefixes[platform] + Math.floor(Math.random() * 1e12).toString().padStart(12, "0");
}

function randomSkuId(): string {
  return Math.floor(Math.random() * 1e10).toString().padStart(10, "0");
}

function generatePriceHistory(basePrice: number, days = 90): PricePoint[] {
  const history: PricePoint[] = [];
  let currentPrice = basePrice;
  const now = new Date();

  for (let i = days; i >= 0; i -= Math.floor(Math.random() * 7) + 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const change = (Math.random() - 0.5) * basePrice * 0.1;
    currentPrice = Math.max(basePrice * 0.7, Math.min(basePrice * 1.3, currentPrice + change));
    history.push({
      date: date.toISOString().split("T")[0],
      price: Math.round(currentPrice * 100) / 100,
    });
  }
  return history;
}

function generateSKUs(basePrice: number, count = 4): SKU[] {
  const colors = ["Black", "White", "Grey", "Navy", "Brown", "Green", "Red", "Blue"];
  const sizes = ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"];
  const skus: SKU[] = [];

  for (let i = 0; i < count; i++) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const priceVariation = (Math.random() - 0.5) * basePrice * 0.15;
    skus.push({
      id: randomSkuId(),
      name: `${color} / ${size}`,
      value: `${color}-${size}`,
      price: Math.round((basePrice + priceVariation) * 100) / 100,
      originalPrice: Math.random() > 0.5 ? Math.round((basePrice + priceVariation + 50) * 100) / 100 : undefined,
      stock: Math.floor(Math.random() * 100) + 1,
      images: [],
      color,
      size,
      image: `https://picsum.photos/seed/sku_${color}_${size}/300/300.jpg`,
    });
  }
  return skus;
}

function generateQCPhotos(count = 6): QCPhoto[] {
  const photos: QCPhoto[] = [];
  const placeholderBase = "https://picsum.photos/seed/qc";

  for (let i = 0; i < count; i++) {
    const tagCount = Math.floor(Math.random() * 3) + 1;
    const tags = QC_PHOTO_TAGS.sort(() => Math.random() - 0.5).slice(0, tagCount);
    photos.push({
      id: `qc_${Date.now()}_${i}`,
      url: `${placeholderBase}${i}_800.jpg`,
      thumbnailUrl: `${placeholderBase}${i}_300.jpg`,
      tags,
      uploadedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      uploader: `QC_User_${Math.floor(Math.random() * 1000)}`,
    });
  }
  return photos;
}

function generateSeller(platform: Platform): SellerInfo {
  const names = [
    "Premium Select", "Direct Factory", "Quality Goods", "Trusted Seller",
    "Fast Ship Store", "Authentic Only", "Best Price Hub", "VIP Shop",
  ];
  const locations = ["Guangzhou, China", "Shenzhen, China", "Hangzhou, China", "Shanghai, China", "Yiwu, China", "Dongguan, China", "Foshan, China", "Qingdao, China"];
  const joinedAt = new Date(Date.now() - Math.random() * 5 * 365 * 24 * 60 * 60 * 1000).toISOString();

  const metrics: SellerMetrics = {
    descriptionAccuracy: Math.floor(Math.random() * 10) + 90,
    shippingSpeed: Math.floor(Math.random() * 10) + 85,
    communication: Math.floor(Math.random() * 10) + 88,
  };

  const recentReviews: SellerReview[] = Array.from({ length: 5 }, (_, i) => ({
    id: `review_${Date.now()}_${i}`,
    buyerName: `Buyer_${Math.floor(Math.random() * 1000)}`,
    rating: Math.floor(Math.random() * 2) + 4,
    comment: "Great quality, fast shipping, highly recommended!",
    date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    images: [],
  }));

  return {
    id: `seller_${Math.floor(Math.random() * 10000)}`,
    name: names[Math.floor(Math.random() * names.length)] + ` ${Math.floor(Math.random() * 100)}`,
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
    avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${Math.random()}`,
    rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 5000) + 100,
    responseRate: Math.round((85 + Math.random() * 15) * 10) / 10,
    responseTimeHours: Math.floor(Math.random() * 12) + 1,
    avgResponseTime: Math.floor(Math.random() * 12) + 1,
    followerCount: Math.floor(Math.random() * 50000) + 1000,
    totalSales: Math.floor(Math.random() * 50000) + 1000,
    joinedAt,
    joinDate: joinedAt,
    location: locations[Math.floor(Math.random() * locations.length)],
    platform,
    storeUrl: `https://${PLATFORM_DOMAINS[platform]}/shop/${Math.floor(Math.random() * 10000)}`,
    verified: Math.random() > 0.3,
    topSeller: Math.random() > 0.8,
    metrics,
    recentReviews,
  };
}

const ITEM_TEMPLATES = [
  {
    category: "Sneakers",
    brands: ["Nike", "Adidas", "New Balance", "Jordan", "Yeezy", "Puma", "Asics", "Saucony"],
    baseTitles: [
      "Air Force 1 Low", "Dunk Low", "Air Max 90", "Air Jordan 1", "Yeezy 350",
      "Ultra Boost", "NMD R1", "Gel-Kayano 14", "550", "2002R",
      "Suede Classic", "Old Skool", "Authentic", "Slip-On", "Era",
    ],
  },
  {
    category: "Apparel",
    brands: ["Supreme", "Off-White", "Fear of God", "Palm Angels", "Amiri", "Rhude", "Kith", "Aimé Leon Dore"],
    baseTitles: [
      "Box Logo Hoodie", "Graphic Tee", "Cargo Pants", "Denim Jacket", "Flannel Shirt",
      "Track Jacket", "Sweatpants", "Baseball Cap", "Beanie", "Socks Pack",
    ],
  },
  {
    category: "Accessories",
    brands: ["Louis Vuitton", "Gucci", "Balenciaga", "Bottega Veneta", "Loewe", "Prada", "Dior", "Saint Laurent"],
    baseTitles: [
      "Crossbody Bag", "Wallet", "Belt", "Sunglasses", "Keychain",
      "Card Holder", "Phone Case", "Watch Strap", "Scarf", "Gloves",
    ],
  },
];

function generateShippingInfo(): ShippingInfo {
  const origins = ["Guangzhou, China", "Shenzhen, China", "Hangzhou, China", "Shanghai, China", "Yiwu, China", "Dongguan, China", "Foshan, China", "Qingdao, China"];
  const destinations = ["Worldwide", "USA", "Europe", "Asia Pacific", "North America", "Global"];
  return {
    from: origins[Math.floor(Math.random() * origins.length)],
    to: destinations[Math.floor(Math.random() * destinations.length)],
    processingDays: Math.floor(Math.random() * 7) + 1,
    weight: Math.floor(Math.random() * 1500) + 200,
  };
}

function generateItem(platform: Platform, index: number): MarketplaceItem {
  const template = ITEM_TEMPLATES[Math.floor(Math.random() * ITEM_TEMPLATES.length)];
  const brand = template.brands[Math.floor(Math.random() * template.brands.length)];
  const baseTitle = template.baseTitles[Math.floor(Math.random() * template.baseTitles.length)];
  const itemId = randomItemId(platform);
  const basePrice = Math.floor(Math.random() * 800) + 150;
  const hasDiscount = Math.random() > 0.4;
  const originalPrice = hasDiscount ? Math.round(basePrice * (1.2 + Math.random() * 0.3)) : undefined;

  return {
    id: `item_${platform}_${itemId}`,
    platform,
    itemId,
    title: `${brand} ${baseTitle} ${Math.random() > 0.5 ? "- Limited Edition" : ""}`,
    description: `High quality ${brand.toLowerCase()} ${baseTitle.toLowerCase()} from verified seller. Authentic materials, accurate sizing. Fast shipping with QC photos available.`,
    price: basePrice,
    originalPrice,
    currency: "CNY",
    mainImage: `https://picsum.photos/seed/${platform}${itemId}/600/600.jpg`,
    images: Array.from({ length: 5 }, (_, i) => `https://picsum.photos/seed/${platform}${itemId}_${i}/600/600.jpg`),
    category: template.category,
    brand,
    seller: generateSeller(platform),
    skus: generateSKUs(basePrice),
    qcPhotos: generateQCPhotos(Math.floor(Math.random() * 8) + 4),
    priceHistory: generatePriceHistory(basePrice),
    salesCount: Math.floor(Math.random() * 10000) + 50,
    rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
    reviewCount: Math.floor(Math.random() * 2000) + 10,
    tags: [brand, template.category, ...(hasDiscount ? ["Sale"] : [])],
    createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    canonicalUrl: `https://${PLATFORM_DOMAINS[platform]}/item.html?id=${itemId}`,
    shipping: generateShippingInfo(),
  };
}

let cachedItems: MarketplaceItem[] | null = null;

export function getMockItems(platform?: Platform, count = 50): MarketplaceItem[] {
  if (!cachedItems) {
    cachedItems = [];
    const platforms: Platform[] = ["taobao", "1688", "weidian"];
    for (let i = 0; i < count; i++) {
      const p = platform || platforms[Math.floor(Math.random() * platforms.length)];
      cachedItems.push(generateItem(p, i));
    }
  }
  if (platform) {
    return cachedItems.filter((item) => item.platform === platform);
  }
  return cachedItems;
}

export function getMockItemById(platform: Platform, itemId: string): MarketplaceItem | null {
  const items = getMockItems(platform);
  return items.find((item) => item.itemId === itemId) || null;
}

export function searchMockItems(query: {
  q?: string;
  platform?: Platform;
  sellerId?: string;
  itemId?: string;
  page?: number;
  limit?: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "sales" | "newest";
}): { items: MarketplaceItem[]; total: number; hasMore: boolean } {
  let items = getMockItems(query.platform);

  if (query.itemId) {
    items = items.filter((item) => item.itemId === query.itemId);
  } else if (query.sellerId) {
    items = items.filter((item) => item.seller.id === query.sellerId);
  } else if (query.q) {
    const searchTerm = query.q.toLowerCase();
    items = items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.brand?.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchTerm)) ||
        item.seller.name.toLowerCase().includes(searchTerm)
    );
  }

  switch (query.sortBy) {
    case "price_asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "sales":
      items.sort((a, b) => b.salesCount - a.salesCount);
      break;
    case "newest":
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    default:
      // relevance - already in decent order
      break;
  }

  const page = query.page || 1;
  const limit = query.limit || 20;
  const start = (page - 1) * limit;
  const paginatedItems = items.slice(start, start + limit);

  return {
    items: paginatedItems,
    total: items.length,
    hasMore: start + limit < items.length,
  };
}

export function getSimilarItemsByHash(queryHash: string, count = 12): MarketplaceItem[] {
  const items = getMockItems();
  return items
    .sort(() => Math.random() - 0.5)
    .slice(0, count);
}

export const PLATFORM_INFO: Record<Platform, { name: string; color: string; icon: string }> = {
  taobao: { name: "Taobao", color: "orange", icon: "🟠" },
  "1688": { name: "1688", color: "green", icon: "🟢" },
  weidian: { name: "Weidian", color: "purple", icon: "🟣" },
};