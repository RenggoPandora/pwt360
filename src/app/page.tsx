"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import WeatherWidget from "@/components/WeatherWidget";
import StreamPlayer from "@/components/player/StreamPlayer";
import MapWrapper from "@/components/map/MapWrapper";
import MultiCameraGrid from "@/components/player/MultiCameraGrid";
import StagingReviewQueue from "@/components/admin/StagingReviewQueue";
import ReportModal from "@/components/ReportModal";
import { INITIAL_CAMERAS } from "@/data/cameras";
import { Camera, CameraCategory } from "@/types/camera";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ShieldCheck,
  Sparkles,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function Home() {
  const [cameras, setCameras] = useState<Camera[]>(INITIAL_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState<Camera>(INITIAL_CAMERAS[0]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<CameraCategory | "all">("all");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [isMultiView, setIsMultiView] = useState<boolean>(false);
  const [multiViewCameras, setMultiViewCameras] = useState<Camera[]>(INITIAL_CAMERAS.slice(0, 4));
  const [activeTab, setActiveTab] = useState<"explore" | "staging">("explore");
  const [reportingCamera, setReportingCamera] = useState<Camera | null>(null);

  // Staging items (simulate OSINT items in review)
  const [stagingCameras, setStagingCameras] = useState<Camera[]>([
    {
      id: "osint-staging-01",
      slug: "simpang-morodadi-recon",
      name: "Simpang Morodadi / Jl. Gerilya",
      description: "Terdeteksi via open RTSP/HLS endpoint geofence Purwokerto Selatan.",
      locationName: "Jl. Gerilya",
      subdistrict: "Purwokerto Selatan",
      category: "traffic",
      lat: -7.4338,
      lng: 109.2512,
      streamUrl: "https://cctv.dev.banyumaskab.go.id/cctv_morodadi/index.m3u8",
      streamType: "hls",
      sourceName: "OSINT Network Scanner",
      sourceUrl: "https://pwt360.id",
      isOfficial: false,
      tier: 2,
      status: "staging_review",
    },
    {
      id: "osint-staging-02",
      slug: "stasiun-timur-live",
      name: "Area Parkir Timur Stasiun Purwokerto",
      description: "Live feed publik kiriman komunitas warga sekitar stasiun.",
      locationName: "Stasiun Purwokerto",
      subdistrict: "Purwokerto Barat",
      category: "transit",
      lat: -7.4191,
      lng: 109.2223,
      streamUrl: "https://www.youtube.com/watch?v=sample_stasiun",
      streamType: "youtube",
      youtubeVideoId: "5qap5aO4i9A",
      sourceName: "Warga / Community Submission",
      sourceUrl: "https://youtube.com",
      isOfficial: false,
      tier: 2,
      status: "staging_review",
    },
  ]);

  // Filtering
  const filteredCameras = useMemo(() => {
    return cameras.filter((cam) => {
      // Exclude staging items from normal explore
      if (cam.status === "staging_review") return false;

      const matchesSearch =
        cam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cam.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cam.subdistrict && cam.subdistrict.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory = selectedCategory === "all" || cam.category === selectedCategory;
      const matchesOnline = !onlyOnline || cam.status === "online";

      return matchesSearch && matchesCategory && matchesOnline;
    });
  }, [cameras, searchQuery, selectedCategory, onlyOnline]);

  const onlineCount = useMemo(() => {
    return cameras.filter((c) => c.status === "online").length;
  }, [cameras]);

  // Staging actions
  const handleApproveStaging = (cam: Camera) => {
    setStagingCameras((prev) => prev.filter((c) => c.id !== cam.id));
    const approvedCam: Camera = { ...cam, status: "online" };
    setCameras((prev) => [approvedCam, ...prev]);
    setSelectedCamera(approvedCam);
    setActiveTab("explore");
  };

  const handleRejectStaging = (cam: Camera) => {
    setStagingCameras((prev) => prev.filter((c) => c.id !== cam.id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FB] text-slate-800">
      <Navbar
        totalCount={cameras.length}
        onlineCount={onlineCount}
        isMultiView={isMultiView}
        onToggleMultiView={() => setIsMultiView((prev) => !prev)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        stagingCount={stagingCameras.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Weather & Time Context Bar */}
        <WeatherWidget />

        {activeTab === "staging" ? (
          <StagingReviewQueue
            stagingCameras={stagingCameras}
            onApprove={handleApproveStaging}
            onReject={handleRejectStaging}
          />
        ) : (
          <>
            {/* Multi-view Grid Wall (Conditional) */}
            {isMultiView && (
              <MultiCameraGrid
                activeCameras={multiViewCameras}
                availableCameras={cameras}
                onRemoveCamera={(id) =>
                  setMultiViewCameras((prev) => prev.filter((c) => c.id !== id))
                }
                onAddCamera={(c) => setMultiViewCameras((prev) => [...prev, c])}
                onClose={() => setIsMultiView(false)}
              />
            )}

            {/* Main Primary View: Video Player + Interactive Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Player & Active Camera Card */}
              <div className="lg:col-span-7 space-y-4">
                <StreamPlayer
                  camera={selectedCamera}
                  onReport={(cam) => setReportingCamera(cam)}
                />
              </div>

              {/* Right Column: Interactive Map */}
              <div className="lg:col-span-5 h-[420px] lg:h-[480px]">
                <MapWrapper
                  cameras={filteredCameras}
                  selectedCamera={selectedCamera}
                  onSelectCamera={(cam) => setSelectedCamera(cam)}
                />
              </div>
            </div>

            {/* Search, Filter, and Directory Section */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari simpang, jalan, atau kawasan Purwokerto..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-blue-500 shadow-xs"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-xs text-slate-400 hover:text-slate-700 absolute right-3.5 top-1/2 -translate-y-1/2"
                    >
                      Batal
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    type="button"
                    onClick={() => setOnlyOnline((prev) => !prev)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-1.5 border ${
                      onlyOnline
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        onlyOnline ? "bg-white" : "bg-emerald-500"
                      }`}
                    />
                    <span>Hanya Online</span>
                  </button>
                </div>
              </div>

              {/* Category selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
                {[
                  { id: "all", label: "Semua Kategori" },
                  { id: "traffic", label: "Lalu Lintas & Simpang" },
                  { id: "public_space", label: "Ruang Publik & Taman" },
                  { id: "tourism", label: "Wisata & Landmark" },
                  { id: "transit", label: "Stasiun & Transit" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition ${
                      selectedCategory === cat.id
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Camera Grid Directory */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCameras.map((cam) => {
                  const isSelected = selectedCamera.id === cam.id;
                  const isOnline = cam.status === "online";

                  return (
                    <div
                      key={cam.id}
                      onClick={() => {
                        setSelectedCamera(cam);
                        window.scrollTo({ top: 120, behavior: "smooth" });
                      }}
                      className={`clay-card p-4 cursor-pointer flex flex-col justify-between border-2 transition ${
                        isSelected
                          ? "border-blue-600 shadow-md ring-2 ring-blue-100"
                          : "border-transparent hover:border-slate-200"
                      }`}
                    >
                      <div>
                        {/* Top Badges */}
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isOnline
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                              }`}
                            />
                            {isOnline ? "Live" : "Standby"}
                          </span>

                          {cam.isOfficial ? (
                            <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5">
                              <ShieldCheck className="w-3.5 h-3.5" /> Resmi
                            </span>
                          ) : (
                            <span className="text-[11px] font-semibold text-purple-600 flex items-center gap-0.5">
                              <Sparkles className="w-3.5 h-3.5" /> OSINT
                            </span>
                          )}
                        </div>

                        {/* Camera Title */}
                        <h4 className="text-sm font-bold text-slate-900 line-clamp-1 mb-1">
                          {cam.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mb-3">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{cam.locationName}</span>
                        </p>
                      </div>

                      {/* Footer info */}
                      <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate">{cam.sourceName}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCameras.length === 0 && (
                <div className="clay-card p-12 text-center text-slate-500">
                  <Filter className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                  <p className="text-sm font-semibold text-slate-700">
                    Tidak ada kamera yang cocok
                  </p>
                  <p className="text-xs text-slate-400">
                    Coba ganti kata kunci pencarian atau matikan filter "Hanya Online".
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-8 px-4 sm:px-8 bg-white border-t border-slate-200/80 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div>
            <p className="font-bold text-slate-700">
              PWT360 &bull; Platform Eksplorasi CCTV & Ruang Kota Purwokerto
            </p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Menghubungkan data siaran publik ATCS Banyumas, YouTube Live, dan sensor terbuka untuk kenyamanan warga.
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <a
              href="https://atcs.banyumaskab.go.id"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              ATCS Banyumas
            </a>
            <span className="text-slate-300">&bull;</span>
            <a
              href="https://www.openstreetmap.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              OpenStreetMap
            </a>
            <span className="text-slate-300">&bull;</span>
            <span className="font-mono text-slate-400">v0.1.0</span>
          </div>
        </div>
      </footer>

      {/* Report Modal */}
      {reportingCamera && (
        <ReportModal
          camera={reportingCamera}
          onClose={() => setReportingCamera(null)}
        />
      )}
    </div>
  );
}
