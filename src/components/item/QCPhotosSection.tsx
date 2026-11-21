"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { X, ChevronLeft, ChevronRight, Expand, Tag, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import type { QCPhoto } from "@/types";

interface QCPhotosSectionProps {
  photos: QCPhoto[];
  itemTitle: string;
  className?: string;
}

const TAG_COLORS: Record<string, string> = {
  stitching: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  material: "bg-green-500/20 text-green-400 border-green-500/30",
  logo: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  sizing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  flaws: "bg-red-500/20 text-red-400 border-red-500/30",
  packaging: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  overall: "bg-brand-500/20 text-brand-400 border-brand-500/30",
};

const TAG_LABELS: Record<string, string> = {
  stitching: "Stitching",
  material: "Material",
  logo: "Logo Accuracy",
  sizing: "Sizing",
  flaws: "Flaws",
  packaging: "Packaging",
  overall: "Overall",
};

export const QCPhotosSection = ({ photos, itemTitle, className }: QCPhotosSectionProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  if (!photos || photos.length === 0) return null;

  const allTags = Array.from(new Set(photos.flatMap((p) => p.tags)));
  const filteredPhotos =
    selectedTags.length > 0
      ? photos.filter((p) => p.tags.some((t) => selectedTags.includes(t)))
      : photos;

  const currentPhoto = filteredPhotos[selectedIndex] || photos[0];
  const currentIndex = photos.findIndex((p) => p.id === currentPhoto.id);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
    setSelectedIndex(0);
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev + 1) % filteredPhotos.length);
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
    if (e.key === "Escape") setIsModalOpen(false);
  };

  return (
    <section className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-100">QC Photos ({photos.length})</h2>
        <div className="flex items-center gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className={cn(
                "gap-1 cursor-pointer transition-all",
                selectedTags.includes(tag)
                  ? "bg-brand-500/20 border-brand-500/50 text-brand-400"
                  : "hover:bg-slate-800/50",
                TAG_COLORS[tag]
              )}
              onClick={() => handleTagToggle(tag)}
            >
              <Tag className="w-3 h-3" />
              {TAG_LABELS[tag] || tag}
              {selectedTags.includes(tag) && <X className="w-3 h-3" />}
            </Badge>
          ))}
          {selectedTags.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTags([])}
              className="text-slate-400 hover:text-amber-400"
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      <div className="relative" onKeyDown={handleKeyDown} tabIndex={0}>
        <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800">
          <img
            src={currentPhoto.url}
            alt={`${itemTitle} - ${TAG_LABELS[currentPhoto.tags[0]] || "QC Photo"} ${currentIndex + 1} of ${filteredPhotos.length}`}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading={selectedIndex === 0 ? "eager" : "lazy"}
          />
        </div>

        {filteredPhotos.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100"
              onClick={handlePrev}
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100"
              onClick={handleNext}
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {currentPhoto.tags.map((tag) => (
              <Badge key={tag} variant="outline" className={TAG_COLORS[tag]}>
                <Tag className="w-3 h-3" />
                {TAG_LABELS[tag] || tag}
              </Badge>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400 bg-slate-900/50 px-3 py-1 rounded-full">
              {selectedIndex + 1} / {filteredPhotos.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="bg-slate-900/50 hover:bg-slate-800 text-slate-300 hover:text-slate-100"
              onClick={() => setIsModalOpen(true)}
              aria-label="View fullscreen"
            >
              <Expand className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {filteredPhotos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filteredPhotos.map((photo, index) => (
            <button
              key={photo.id}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                index === selectedIndex
                  ? "border-brand-500 ring-2 ring-brand-500/20"
                  : "border-slate-800 hover:border-slate-700"
              )}
              aria-label={`View photo ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : "false"}
            >
              <img
                src={photo.url}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex flex-wrap gap-0.5 justify-center">
                  {photo.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "text-[10px] px-1 py-0.5 rounded",
                        TAG_COLORS[tag].replace("bg-", "bg-").replace("text-", "text-").replace("border-", "border-")
                      )}
                    >
                      {TAG_LABELS[tag]?.charAt(0) || tag.charAt(0)}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="full"
        className="bg-slate-950"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h3 className="font-semibold text-slate-100 truncate max-w-md">
              {itemTitle} - QC Photos
            </h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = currentPhoto.url;
                  link.download = `${itemTitle}-qc-${currentIndex + 1}.jpg`;
                  link.click();
                }}
                aria-label="Download photo"
              >
                <Download className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setIsModalOpen(false)} aria-label="Close">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 relative">
            {filteredPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-10 bg-slate-900/50 hover:bg-slate-800"
                  onClick={handlePrev}
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-10 bg-slate-900/50 hover:bg-slate-800"
                  onClick={handleNext}
                  aria-label="Next photo"
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>
              </>
            )}
            <img
              src={currentPhoto.url}
              alt={`${itemTitle} - QC Photo ${currentIndex + 1}`}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex flex-wrap gap-2 justify-center">
              {currentPhoto.tags.map((tag) => (
                <Badge key={tag} variant="outline" className={TAG_COLORS[tag]}>
                  <Tag className="w-3 h-3" />
                  {TAG_LABELS[tag] || tag}
                </Badge>
              ))}
            </div>
            <p className="text-center text-sm text-slate-400 mt-3">
              Photo {selectedIndex + 1} of {filteredPhotos.length}
            </p>
          </div>
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {filteredPhotos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setSelectedIndex(index)}
                  className={cn(
                    "relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                    index === selectedIndex
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : "border-slate-800 hover:border-slate-700"
                  )}
                  aria-label={`View photo ${index + 1}`}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </section>
  );
};