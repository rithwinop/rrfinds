export type Platform = "taobao" | "1688" | "weidian";

export interface ParsedListingRef {
  platform: Platform;
  itemId: string;
  skuId?: string;
  canonicalUrl: string;
  rawInput: string;
}

export interface QCPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  tags: QCPhotoTag[];
  uploadedAt: string;
  uploader?: string;
}

export type QCPhotoTag =
  | "stitching"
  | "material"
  | "logo"
  | "sizing"
  | "flaws"
  | "packaging"
  | "label"
  | "sole"
  | "upper"
  | "box";

export interface SellerMetrics {
  descriptionAccuracy: number;
  shippingSpeed: number;
  communication: number;
}

export interface SellerReview {
  id: string;
  buyerName: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export interface SellerInfo {
  id: string;
  name: string;
  avatar?: string;
  avatarUrl?: string;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTimeHours: number;
  avgResponseTime: number;
  followerCount: number;
  totalSales: number;
  joinedAt: string;
  joinDate: string;
  location: string;
  platform: Platform;
  storeUrl: string;
  verified: boolean;
  topSeller: boolean;
  metrics: SellerMetrics;
  recentReviews?: SellerReview[];
}

export interface SKU {
  id: string;
  name: string;
  value: string;
  price: number;
  originalPrice?: number;
  stock: number;
  images: string[];
  color?: string;
  size?: string;
  image?: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface ShippingInfo {
  from: string;
  to: string;
  processingDays: number;
  weight: number;
}

export interface MarketplaceItem {
  id: string;
  platform: Platform;
  itemId: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  currency: "CNY";
  mainImage: string;
  images: string[];
  category: string;
  brand?: string;
  seller: SellerInfo;
  skus: SKU[];
  qcPhotos: QCPhoto[];
  priceHistory: PricePoint[];
  salesCount: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  canonicalUrl: string;
  shipping: ShippingInfo;
}

export interface SearchResult {
  items: MarketplaceItem[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  query: SearchQuery;
}

export interface SearchQuery {
  q?: string;
  platform?: Platform;
  sellerId?: string;
  itemId?: string;
  page: number;
  limit: number;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "sales" | "newest";
}

export interface ImageSearchResult {
  queryHash: string;
  similarItems: MarketplaceItem[];
  processingTimeMs: number;
}

export type SearchParams = SearchQuery;

export interface SearchResponse {
  items: MarketplaceItem[];
  totalResults: number;
  page: number;
  totalPages: number;
  error?: string;
}