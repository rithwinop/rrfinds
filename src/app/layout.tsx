import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "QCLens — Quality Control Photo Search for Taobao, 1688, Weidian",
    template: "%s | QCLens",
  },
  description:
    "Search quality control photos and marketplace listings across Taobao, 1688, and Weidian. Paste URLs, search keywords, or upload images for visual similarity search.",
  keywords: [
    "QC photos",
    "quality control",
    "Taobao",
    "1688",
    "Weidian",
    "marketplace search",
    "visual search",
    "shopping agent",
  ],
  authors: [{ name: "QCLens" }],
  creator: "QCLens",
  publisher: "QCLens",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://qclens.app",
    siteName: "QCLens",
    title: "QCLens — Quality Control Photo Search",
    description:
      "Search quality control photos and marketplace listings across Taobao, 1688, and Weidian.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "QCLens - Quality Control Lens",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "QCLens — Quality Control Photo Search",
    description:
      "Search quality control photos and marketplace listings across Taobao, 1688, and Weidian.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#030712",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-sans antialiased bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}