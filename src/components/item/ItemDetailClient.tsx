"use client";

import { useState } from "react";
import { ItemHeader } from "@/components/item/ItemHeader";
import { PriceHistory } from "@/components/item/PriceHistory";
import { SkuSelector } from "@/components/item/SkuSelector";
import { QCPhotosSection } from "@/components/item/QCPhotosSection";
import { SellerInfo } from "@/components/item/SellerInfo";
import { SimilarItems } from "@/components/item/SimilarItems";
import type { MarketplaceItem, SKU } from "@/types";

interface ItemDetailClientProps {
  item: MarketplaceItem;
  similarItems: MarketplaceItem[];
}

export function ItemDetailClient({ item, similarItems }: ItemDetailClientProps) {
  const [selectedSku, setSelectedSku] = useState<SKU | undefined>(item.skus[0]);

  const handleSkuSelect = (sku: SKU) => {
    setSelectedSku(sku);
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 mt-8">
      <div className="lg:col-span-2 space-y-8">
        <QCPhotosSection photos={item.qcPhotos} itemTitle={item.title} />

        <PriceHistory data={item.priceHistory} />

        <SkuSelector skus={item.skus} selectedSku={selectedSku} onSelect={handleSkuSelect} />

        <SimilarItems items={similarItems} />
      </div>

      <div className="lg:col-span-1">
        <SellerInfo seller={item.seller} />
      </div>
    </div>
  );
}
