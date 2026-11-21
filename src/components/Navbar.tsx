"use client";

import { Video, Shield, Sparkles, Grid2X2, Compass, Radio } from "lucide-react";

interface NavbarProps {
  totalCount: number;
  onlineCount: number;
  isMultiView: boolean;
  onToggleMultiView: () => void;
  activeTab: "explore" | "staging";
  onTabChange: (tab: "explore" | "staging") => void;
  stagingCount: number;
}

export default function Navbar({
  totalCount,
  onlineCount,
  isMultiView,
  onToggleMultiView,
  activeTab,
  onTabChange,
  stagingCount,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 py-3.5 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white clay-btn shadow-md">
            <Compass className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                PWT360
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 uppercase tracking-wider">
                Purwokerto
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Eksplorasi CCTV & Ruang Kota Terintegrasi
            </p>
          </div>
        </div>

        {/* Live stats pill */}
        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/90 border border-slate-200/80 text-xs">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            {onlineCount} Siaran Aktif
          </span>
          <span className="text-slate-300">&bull;</span>
          <span className="text-slate-600 font-medium">{totalCount} Terdata</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Navigation Tabs */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200/60">
            <button
              type="button"
              onClick={() => onTabChange("explore")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "explore"
                  ? "bg-white text-blue-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Jelajah</span>
            </button>
            <button
              type="button"
              onClick={() => onTabChange("staging")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                activeTab === "staging"
                  ? "bg-white text-purple-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Staging OSINT</span>
              {stagingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-purple-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {stagingCount}
                </span>
              )}
            </button>
          </div>

          {/* Multi-view Grid toggle */}
          <button
            type="button"
            onClick={onToggleMultiView}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition ${
              isMultiView
                ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
            title="Mode Multi-Kamera (2x2)"
          >
            <Grid2X2 className="w-4 h-4" />
            <span className="hidden sm:inline">Multi-Cam</span>
          </button>
        </div>
      </div>
    </header>
  );
}
