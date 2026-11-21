"use client";

import { useState, useMemo, useEffect } from "react";
import WeatherCard from "@/components/WeatherCard";
import PastelMap from "@/components/map/PastelMap";
import FilterBar from "@/components/FilterBar";
import CameraCard from "@/components/CameraCard";
import ClayLivePlayer from "@/components/player/ClayLivePlayer";
import { DASHBOARD_CAMERAS } from "@/data/cameras";
import { DashboardCamera, CameraCategory } from "@/types/camera";
import { fetchLivePinWeather, DynamicWeather } from "@/lib/weather";

const DEFAULT_WEATHER: DynamicWeather = {
  temperature: 27,
  conditionText: "Mendung, potensi hujan",
  isRaining: true,
  rainChance: 60,
  humidity: 78,
  windSpeed: 9,
  hourly: [
    { time: "12.00", temp: "28°", rain: false },
    { time: "13.00", temp: "28°", rain: false },
    { time: "14.00", temp: "27°", rain: true },
    { time: "15.00", temp: "26°", rain: true },
    { time: "16.00", temp: "26°", rain: true },
  ],
  cityName: "Pusat Kota",
};

export default function Home() {
  const [cameras] = useState<DashboardCamera[]>(DASHBOARD_CAMERAS);
  const [selectedCamera, setSelectedCamera] = useState<DashboardCamera>(
    DASHBOARD_CAMERAS[0]
  );
  const [activeLiveCamera, setActiveLiveCamera] =
    useState<DashboardCamera | null>(null);
  const [activeCategory, setActiveCategory] = useState<CameraCategory | "all">(
    "all"
  );
  const [weather, setWeather] = useState<DynamicWeather>(DEFAULT_WEATHER);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);

  // Fetch dynamic live weather for selected pin location using 100% free Open-Meteo
  useEffect(() => {
    let isCancelled = false;
    setIsWeatherLoading(true);

    fetchLivePinWeather(
      selectedCamera.lat,
      selectedCamera.lng,
      selectedCamera.name
    ).then((data) => {
      if (!isCancelled) {
        setWeather(data);
        setIsWeatherLoading(false);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [selectedCamera.lat, selectedCamera.lng, selectedCamera.name]);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: cameras.length,
      traffic: cameras.filter((c) => c.category === "traffic").length,
      public_space: cameras.filter((c) => c.category === "public_space").length,
      tourism: cameras.filter((c) => c.category === "tourism").length,
      transit: cameras.filter((c) => c.category === "transit").length,
    };
  }, [cameras]);

  // Filtered cameras for the grid
  const filteredCameras = useMemo(() => {
    if (activeCategory === "all") return cameras;
    return cameras.filter((c) => c.category === activeCategory);
  }, [cameras, activeCategory]);

  const handleSelectCamera = (cam: DashboardCamera) => {
    setSelectedCamera(cam);
    setActiveLiveCamera(cam);

    // Scroll up smoothly if user is down on the card grid
    const mainSection = document.getElementById("main-map-section");
    if (mainSection && window.scrollY > mainSection.offsetTop + 200) {
      mainSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#E9EDFB] text-[#2A2950] selection:bg-[#6B5CE7] selection:text-white pb-14">
      {/* Container with max-width 1440px and responsive padding */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 pt-7 sm:pt-9 space-y-9 sm:space-y-11">
        {/* 1. HERO SECTION */}
        <header className="space-y-6">
          {/* Top Bar: Brand & Live Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Brand Logo & Tagline */}
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-[18px] bg-[#6B5CE7] flex items-center justify-center text-white shadow-md shadow-[#6B5CE7]/30 shrink-0">
                <svg
                  className="w-7 h-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <div>
                <span className="text-2xl font-bold font-heading text-[#2A2950] tracking-tight block leading-tight">
                  PWT360
                </span>
                <span className="text-xs font-bold text-[#565A85]">
                  CCTV publik, peta &amp; cuaca dalam satu layar
                </span>
              </div>
            </div>

            {/* Top Right Pills */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* LIVE Camera Counter Pill */}
              <div className="clay-pill px-4 sm:px-5 py-2.5 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C62A5B] animate-pulse shrink-0" />
                <span className="text-xs sm:text-sm font-bold font-heading text-[#2A2950]">
                  LIVE &bull; {cameras.length} kamera
                </span>
              </div>

              {/* Date & Time Pill */}
              <div className="clay-pill px-4 sm:px-5 py-2.5 flex items-center gap-2">
                <svg
                  className="w-4 h-4 text-[#565A85] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span className="text-xs sm:text-sm font-bold font-heading text-[#2A2950]">
                  Sabtu, 21 Nov 2026 &bull; 11.26 WIB
                </span>
              </div>
            </div>
          </div>

          {/* Hero H1 & Intro Sentence */}
          <div className="space-y-2 max-w-3xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-heading text-[#2A2950] tracking-tight">
              Pantau kota, langsung dari layar.
            </h1>
            <p className="text-sm sm:text-base font-bold text-[#565A85] leading-relaxed">
              Lihat posisi kamera di peta, cek cuaca sekitar, lalu pilih kategori untuk membuka siaran langsungnya.
            </p>
          </div>
        </header>

        {/* 2. MAIN CONTENT (TWO COLUMNS: MAP + RIGHT COLUMN [LIVE CCTV + WEATHER]) */}
        <section
          id="main-map-section"
          aria-label="Peta dan Cuaca"
          className="flex flex-col lg:flex-row items-start gap-7 sm:gap-8"
        >
          {/* Left Column: Pastel Map with Real Live Rain overlay */}
          <PastelMap
            cameras={cameras}
            selectedCamera={selectedCamera}
            onSelectCamera={handleSelectCamera}
            activeCategory={activeCategory}
            rainChance={weather.rainChance}
          />

          {/* Right Column: Splits into Live CCTV on Top + Weather Card Below */}
          <div className="flex flex-col gap-6 w-full lg:w-[380px] xl:w-[420px] shrink-0 transition-all duration-300">
            {/* Top Section: Live CCTV Player (Appears when pin or card clicked) */}
            {activeLiveCamera && (
              <ClayLivePlayer
                camera={activeLiveCamera}
                onClose={() => setActiveLiveCamera(null)}
              />
            )}

            {/* Bottom Section: Dynamic Weather Card */}
            <WeatherCard
              weather={weather}
              isSplit={Boolean(activeLiveCamera)}
              isLoading={isWeatherLoading}
            />
          </div>
        </section>

        {/* 3. FILTER + CAMERA CCTV DIRECTORY */}
        <section aria-label="Daftar Kamera CCTV" className="space-y-6 pt-2">
          {/* Section Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-[#2A2950]">
            Kamera CCTV
          </h2>

          {/* Filter Bar Chips */}
          <FilterBar
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            counts={counts}
          />

          {/* Camera Grid (4 columns desktop, 2 columns mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {filteredCameras.map((cam) => (
              <CameraCard
                key={cam.id}
                camera={cam}
                isSelected={selectedCamera.id === cam.id}
                onSelect={handleSelectCamera}
                onPlayStream={handleSelectCamera}
              />
            ))}
          </div>
        </section>

        {/* 4. FOOTER */}
        <footer className="pt-8 pb-4 text-center text-xs font-bold text-[#565A85]">
          <p>Contoh desain &bull; data kamera, lokasi, dan cuaca hanya ilustrasi</p>
        </footer>
      </div>
    </div>
  );
}
