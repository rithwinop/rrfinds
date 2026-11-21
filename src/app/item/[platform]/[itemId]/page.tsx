import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ItemHeader } from "@/components/item/ItemHeader";
import { PriceHistory } from "@/components/item/PriceHistory";
import { SkuSelector } from "@/components/item/SkuSelector";
import { QCPhotosSection } from "@/components/item/QCPhotosSection";
import { SellerInfo } from "@/components/item/SellerInfo";
import { SimilarItems } from "@/components/item/SimilarItems";
import { getMockItemById, getMockItems } from "@/lib/mock-data";
import type { MarketplaceItem, SKU } from "@/types";

interface ItemPageProps {
  params: Promise<{ platform: string; itemId: string }>;
}

export async function generateMetadata({ params }: ItemPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const item = getMockItemById(resolvedParams.platform as any, resolvedParams.itemId);

  if (!item) {
    return { title: "Item Not Found | QCLens" };
  }

  return {
    title: `${item.title} | QCLens`,
    description: `View QC photos, price history, and details for ${item.title} on ${item.platform.toUpperCase()}`,
    openGraph: {
      title: item.title,
      description: `Price: ${item.price} | Rating: ${item.rating}/5 | ${item.salesCount} sold`,
      images: item.images,
      type: "website",
    },
  };
}

export default async function ItemPage({ params }: ItemPageProps) {
  const resolvedParams = await params;
  const platform = resolvedParams.platform as "taobao" | "1688" | "weidian";
  const itemId = resolvedParams.itemId;

  const item = getMockItemById(platform, itemId);

  if (!item) {
    notFound();
  }

  const similarItems = getMockItems(platform, 8).filter((i) => i.id !== item.id);

  const handleSkuSelect = (sku: SKU) => {
    console.log("Selected SKU:", sku);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-slate-500">
            <li>
              <a href="/" className="hover:text-slate-300 transition-colors">Home</a>
            </li>
            <li className="flex items-center gap-2">
              <span>/</span>
              <a href={`/search`} className="hover:text-slate-300 transition-colors">Search</a>
            </li>
            <li className="flex items-center gap-2">
              <span>/</span>
              <a href={`/results/${item.title}`} className="hover:text-slate-300 transition-colors">Results</a>
            </li>
            <li className="flex items-center gap-2">
              <span>/</span>
              <span className="text-slate-400 truncate max-w-[200px]" aria-current="page">{item.title}</span>
            </li>
          </ol>
        </nav>

        <ItemHeader item={item} />

        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2 space-y-8">
            <QCPhotosSection photos={item.qcPhotos} itemTitle={item.title} />

            <PriceHistory data={item.priceHistory} />

            <SkuSelector skus={item.skus} onSelect={handleSkuSelect} />

            <SimilarItems items={similarItems} />
          </div>

          <div className="lg:col-span-1">
            <SellerInfo seller={item.seller} />
          </div>
        </div>
      </div>
    </main>
  );
}