"use client";

import { useCallback, useRef, useState, DragEvent, ChangeEvent } from "react";
import { cn } from "@/lib/utils";
import { Upload, X, Image, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { computeHash } from "@/lib/phash";

interface ImageUploadZoneProps {
  onImageSelect: (file: File, hash: string, preview: string) => void;
  onRemove: () => void;
  selectedFile?: File | null;
  hash?: string | null;
  preview?: string | null;
  disabled?: boolean;
  maxSizeMB?: number;
  accept?: string;
  className?: string;
}

export const ImageUploadZone = ({
  onImageSelect,
  onRemove,
  selectedFile,
  hash,
  preview,
  disabled = false,
  maxSizeMB = 10,
  accept = "image/*",
  className,
}: ImageUploadZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isComputing, setIsComputing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File): boolean => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      return false;
    }
    return true;
  }, [maxSizeMB]);

  const handleFile = useCallback(
    async (file: File) => {
      if (!validateFile(file)) return;

      setError(null);
      setIsComputing(true);

      try {
        const previewUrl = URL.createObjectURL(file);
        const imageHash = await computeHash(file);
        onImageSelect(file, imageHash, previewUrl);
      } catch (err) {
        console.error("Error processing image:", err);
        setError("Failed to process image. Please try again.");
      } finally {
        setIsComputing(false);
      }
    },
    [validateFile, onImageSelect]
  );

  const handleDrop = useCallback(
    (e: DragEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) fileInputRef.current?.click();
  }, [disabled]);

  const handleRemove = useCallback(() => {
    onRemove();
    setError(null);
  }, [onRemove]);

  if (selectedFile && preview) {
    return (
      <div className="relative group">
        <div className="aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700">
          <img
            src={preview}
            alt="Selected image preview"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {isComputing && (
            <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-brand-500" aria-hidden="true" />
            </div>
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2 text-sm">
            <Check className="w-4 h-4 text-green-400" aria-hidden="true" />
            <span className="text-slate-300 truncate max-w-[200px]">{selectedFile.name}</span>
            {hash && (
              <span className="text-xs text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded">
                {hash.slice(0, 16)}...
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={isComputing}
            aria-label="Remove image"
            className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
        {error && <p className="mt-2 text-sm text-red-400" role="alert">{error}</p>}
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileInputChange}
        className="sr-only"
        aria-label="Upload image"
        disabled={disabled || isComputing}
      />
      <button
        type="button"
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        disabled={disabled || isComputing}
        className={cn(
          "w-full aspect-square border-2 border-dashed rounded-xl transition-all duration-200",
          "flex flex-col items-center justify-center gap-3 p-6",
          "text-center cursor-pointer",
          disabled
            ? "opacity-50 cursor-not-allowed border-slate-800"
            : isDragging
            ? "border-brand-500 bg-brand-500/10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-500/20"
            : "border-slate-700 hover:border-slate-500 hover:bg-slate-800/50",
          className
        )}
        aria-label={selectedFile ? "Replace image" : "Upload image for visual search"}
      >
        <div className={cn("flex flex-col items-center gap-2", isComputing && "opacity-50")}>
          <Upload className="w-10 h-10 text-slate-500" aria-hidden="true" />
          <div>
            <p className="text-lg font-medium text-slate-200">
              {isComputing ? "Processing..." : "Drop image or click to upload"}
            </p>
            <p className="text-sm text-slate-500">
              PNG, JPG, WebP up to {maxSizeMB}MB
            </p>
          </div>
        </div>
        {isComputing && (
          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center rounded-xl">
            <Loader2 className="w-8 h-8 animate-spin text-brand-500" aria-hidden="true" />
          </div>
        )}
      </button>
      {error && <p className="mt-2 text-sm text-red-400 text-center" role="alert">{error}</p>}
    </div>
  );
};