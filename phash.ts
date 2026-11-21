export interface ImageHash {
  hash: string;
  algorithm: "dhash" | "ahash";
  size: number;
}

const DEFAULT_HASH_SIZE = 8;

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function loadImage(src: string | File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof File || src instanceof Blob) {
      img.src = URL.createObjectURL(src);
    } else {
      img.src = src;
    }
  });
}

function resizeAndGrayscale(
  img: HTMLImageElement,
  width: number,
  height: number
): ImageData {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    data[i] = data[i + 1] = data[i + 2] = gray;
  }
  return imageData;
}

export async function computeDHash(file: File | Blob | string, hashSize = DEFAULT_HASH_SIZE): Promise<ImageHash> {
  const img = await loadImage(file);
  const imageData = resizeAndGrayscale(img, hashSize + 1, hashSize);
  const data = imageData.data;
  let hash = "";

  for (let y = 0; y < hashSize; y++) {
    for (let x = 0; x < hashSize; x++) {
      const leftIdx = (y * (hashSize + 1) + x) * 4;
      const rightIdx = (y * (hashSize + 1) + x + 1) * 4;
      const left = data[leftIdx];
      const right = data[rightIdx];
      hash += left > right ? "1" : "0";
    }
  }

  const hexHash = BigInt("0b" + hash).toString(16).padStart(hashSize * hashSize / 4, "0");
  return { hash: hexHash, algorithm: "dhash", size: hashSize };
}

export async function computeAHash(file: File | Blob | string, hashSize = DEFAULT_HASH_SIZE): Promise<ImageHash> {
  const img = await loadImage(file);
  const imageData = resizeAndGrayscale(img, hashSize, hashSize);
  const data = imageData.data;
  let sum = 0;
  const values: number[] = [];

  for (let i = 0; i < data.length; i += 4) {
    values.push(data[i]);
    sum += data[i];
  }

  const avg = sum / values.length;
  let hash = "";
  for (const val of values) {
    hash += val > avg ? "1" : "0";
  }

  const hexHash = BigInt("0b" + hash).toString(16).padStart(hashSize * hashSize / 4, "0");
  return { hash: hexHash, algorithm: "ahash", size: hashSize };
}

export async function computeHash(file: File | Blob | string, algorithm: "dhash" | "ahash" = "dhash"): Promise<string> {
  const result = algorithm === "dhash"
    ? await computeDHash(file)
    : await computeAHash(file);
  return result.hash;
}

export function hammingDistance(hash1: string, hash2: string): number {
  if (hash1.length !== hash2.length) {
    throw new Error("Hashes must be of equal length");
  }

  const maxLen = Math.max(hash1.length, hash2.length);
  const h1 = hash1.padStart(maxLen, "0");
  const h2 = hash2.padStart(maxLen, "0");

  let distance = 0;
  for (let i = 0; i < maxLen; i++) {
    const nibble1 = parseInt(h1[i], 16);
    const nibble2 = parseInt(h2[i], 16);
    distance += (nibble1 ^ nibble2).toString(2).split("1").length - 1;
  }
  return distance;
}

export function similarityScore(hash1: string, hash2: string): number {
  const maxBits = hash1.length * 4;
  const distance = hammingDistance(hash1, hash2);
  return 1 - distance / maxBits;
}

export function isSimilar(hash1: string, hash2: string, threshold = 0.85): boolean {
  return similarityScore(hash1, hash2) >= threshold;
}

export function hashToBinary(hash: string): string {
  return parseInt(hash, 16).toString(2).padStart(hash.length * 4, "0");
}

export function binaryToHash(binary: string): string {
  return BigInt("0b" + binary).toString(16).padStart(binary.length / 4, "0");
}