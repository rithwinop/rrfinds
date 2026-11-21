"use client";

import Link from "next/link";
import { Search, Image, Zap, Shield, ExternalLink, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/search/SearchBar";

const features = [
  {
    icon: Search,
    title: "Multi-Platform Search",
    description:
      "Search across Taobao, 1688, and Weidian simultaneously. Filter by platform, seller, price range, and more.",
  },
  {
    icon: Image,
    title: "Visual Similarity Search",
    description:
      "Upload a product photo or QC image to find visually similar listings using perceptual hashing technology.",
  },
  {
    icon: Zap,
    title: "Instant URL Parsing",
    description:
      "Paste any marketplace URL, shopping agent link, or raw item ID — we normalize it instantly to canonical format.",
  },
  {
    icon: Shield,
    title: "Quality Control Focus",
    description:
      "Browse QC photos with tags for stitching, material, logo accuracy, sizing, and flaws — all in one place.",
  },
];

const platforms = [
  { name: "Taobao", color: "orange", icon: "🟠", count: "2.1M+" },
  { name: "1688", color: "green", icon: "🟢", count: "890K+" },
  { name: "Weidian", color: "purple", icon: "🟣", count: "340K+" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container-main">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2" aria-label="QCLens Home">
              <svg
                className="w-8 h-8 text-amber-400"
                viewBox="0 0 32 32"
                fill="none"
                aria-hidden="true"
              >
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
                <circle cx="16" cy="16" r="3" fill="currentColor" />
              </svg>
              <span className="font-bold text-xl text-slate-100">QCLens</span>
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/search"
                className="text-sm font-medium text-slate-300 hover:text-slate-100 transition-colors"
              >
                Search
              </Link>
              <Link
                href="/search"
                className="hidden sm:block px-4 py-2 bg-amber-500 text-slate-950 rounded-lg font-medium hover:bg-amber-400 transition-colors"
              >
                Start Searching
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative section-padding overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-amber-500/10 via-transparent to-transparent" />
          <div className="container-main relative">
            <div className="max-w-4xl mx-auto text-center animate-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
                Now supporting Weidian & shopping agent URLs
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Quality Control Photos
                <br />
                <span className="text-gradient">Found Instantly</span>
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Search QC photos and marketplace listings across Taobao, 1688, and Weidian. Paste
                URLs, search keywords, or upload images for visual similarity search.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
                <Link href="/search">
                  <Button size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-3">
                    Start Searching
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 text-lg px-8 py-3">
                  <ExternalLink className="w-5 h-5" />
                  View Demo
                </Button>
              </div>

              <div className="relative">
                <SearchBar
                  onSearch={(query, mode) => {
                    const params = new URLSearchParams({ q: query, mode });
                    window.location.href = `/results/${encodeURIComponent(query)}?${params.toString()}`;
                  }}
                  onImageSearch={(hash) => {
                    window.location.href = `/results/image-search?hash=${hash}`;
                  }}
                  className="max-w-3xl mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-900/50 border-y border-slate-800/50">
          <div className="container-main">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {platforms.map((platform, index) => (
                <div
                  key={platform.name}
                  className="group p-6 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl" aria-hidden="true">{platform.icon}</span>
                    <div>
                      <h3 className="font-semibold text-slate-100">{platform.name}</h3>
                      <p className="text-sm text-slate-500">{platform.count} listings indexed</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm text-slate-400">
                    <p>• Real-time price tracking</p>
                    <p>• QC photo galleries</p>
                    <p>• Seller verification</p>
                    <p>• SKU variant support</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            <div className="text-center mb-16 animate-in">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-4">
                Search How You Want
              </h2>
              <p className="text-slate-400 max-w-2xl mx-auto">
                Three powerful search modes — use whichever fits your workflow
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all duration-300 animate-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-amber-400" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-100 mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-padding bg-slate-900/50 border-y border-slate-800/50">
          <div className="container-main">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6 animate-in">
                Built for QC Enthusiasts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-in">
                  <Search className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">URL & ID Normalization</h3>
                    <p className="text-slate-400 text-sm">
                      Paste any Taobao, 1688, Weidian URL or shopping agent link (youshop10,
                      superbuy, etc.) — we extract the canonical item ID and platform instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-in" style={{ animationDelay: "100ms" }}>
                  <Image className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Perceptual Image Hashing</h3>
                    <p className="text-slate-400 text-sm">
                      Client-side dHash implementation finds visually similar items without
                      uploading images to servers. Fast, private, and works offline.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-in" style={{ animationDelay: "200ms" }}>
                  <Shield className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">QC Photo Tagging</h3>
                    <p className="text-slate-400 text-sm">
                      Photos tagged by category: stitching, material, logo, sizing, flaws,
                      packaging. Filter and compare quality across sellers instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-800 animate-in" style={{ animationDelay: "300ms" }}>
                  <Zap className="w-6 h-6 text-amber-400 mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <div>
                    <h3 className="font-semibold text-slate-100 mb-1">Price History & Trends</h3>
                    <p className="text-slate-400 text-sm">
                      Track price fluctuations over time with interactive charts. Spot sales,
                      price drops, and seasonal trends before you buy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container-main">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-100 mb-6 animate-in">
                Ready to Find Better QC?
              </h2>
              <p className="text-slate-400 mb-8 animate-in" style={{ animationDelay: "100ms" }}>
                Join thousands of buyers who use QCLens to make informed purchasing decisions
                across Chinese marketplaces.
              </p>
              <Link href="/search" className="inline-block animate-in" style={{ animationDelay: "200ms" }}>
                <Button size="lg" className="gap-2 text-lg px-10 py-3">
                  Start Searching Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="container-main py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4" aria-label="QCLens Home">
                <svg
                  className="w-8 h-8 text-amber-400"
                  viewBox="0 0 32 32"
                  fill="none"
                  aria-hidden="true"
                >
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="16" r="8" stroke="currentColor" strokeWidth="2" />
                  <circle cx="16" cy="16" r="3" fill="currentColor" />
                </svg>
                <span className="font-bold text-xl text-slate-100">QCLens</span>
              </Link>
              <p className="text-slate-400 max-w-sm">
                Quality Control Lens — Search QC photos and marketplace listings across Taobao,
                1688, and Weidian with visual similarity search.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Platforms</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="/search?platform=taobao" className="hover:text-amber-400 transition-colors">Taobao</a></li>
                <li><a href="/search?platform=1688" className="hover:text-amber-400 transition-colors">1688</a></li>
                <li><a href="/search?platform=weidian" className="hover:text-amber-400 transition-colors">Weidian</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-100 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-amber-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-amber-400 transition-colors">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© 2024 QCLens. Not affiliated with Taobao, 1688, or Weidian.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Privacy</a>
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Terms</a>
              <a href="#" className="text-sm text-slate-500 hover:text-amber-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}