"use client";

import { cn } from "@/lib/utils";
import { Star, MessageCircle, Truck, Award, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatDate } from "@/lib/utils";
import type { SellerInfo as SellerInfoType } from "@/types";

interface SellerInfoProps {
  seller: SellerInfoType;
  className?: string;
}

export const SellerInfo = ({ seller, className }: SellerInfoProps) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.8) return "text-green-400";
    if (rating >= 4.5) return "text-amber-400";
    if (rating >= 4.0) return "text-orange-400";
    return "text-red-400";
  };

  const getResponseTimeLabel = (hours: number) => {
    if (hours <= 1) return "Within 1 hour";
    if (hours <= 6) return "Within 6 hours";
    if (hours <= 24) return "Within 24 hours";
    return "Over 24 hours";
  };

  return (
    <section className={cn("space-y-6", className)}>
      <h2 className="text-lg font-semibold text-slate-100">Seller Information</h2>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden flex-shrink-0">
            {seller.avatar ? (
              <img src={seller.avatar} alt={seller.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-slate-500">{seller.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-xl font-bold text-slate-100 truncate">{seller.name}</h3>
              {seller.verified && (
                <Badge variant="outline" className="bg-green-500/10 border-green-500/30 text-green-400 gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Verified
                </Badge>
              )}
              {seller.topSeller && (
                <Badge variant="outline" className="bg-amber-500/10 border-amber-500/30 text-amber-400 gap-1">
                  <Award className="w-3.5 h-3.5" />
                  Top Seller
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Member since {formatDate(seller.joinDate)} · {seller.location}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                <p className={cn("text-2xl font-bold", getRatingColor(seller.rating))}>
                  {seller.rating.toFixed(1)}
                </p>
                <p className="text-xs text-slate-500">Overall Rating</p>
                <div className="flex items-center justify-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={cn(
                        "w-3.5 h-3.5",
                        star <= Math.round(seller.rating) ? "fill-current text-amber-400" : "text-slate-600"
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-brand-400">{formatNumber(seller.totalSales)}</p>
                <p className="text-xs text-slate-500">Total Sales</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-green-400">{seller.responseRate}%</p>
                <p className="text-xs text-slate-500">Response Rate</p>
              </div>
              <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                <p className="text-2xl font-bold text-slate-300">{getResponseTimeLabel(seller.avgResponseTime)}</p>
                <p className="text-xs text-slate-500">Avg Response</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Accurate Description</p>
                  <p className="text-xs text-slate-400">{seller.metrics.descriptionAccuracy}% match</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Fast Shipping</p>
                  <p className="text-xs text-slate-400">{seller.metrics.shippingSpeed}% on time</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-100">Communication</p>
                  <p className="text-xs text-slate-400">{seller.metrics.communication}% positive</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {seller.recentReviews && seller.recentReviews.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium text-slate-300">Recent Reviews</h3>
          <div className="space-y-3">
            {seller.recentReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-100">{review.buyerName}</span>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={cn(
                            "w-3.5 h-3.5",
                            star <= review.rating ? "fill-current text-amber-400" : "text-slate-600"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{formatDate(review.date)}</span>
                </div>
                <p className="text-slate-300 text-sm">{review.comment}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {review.images.slice(0, 4).map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Review photo ${i + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};