"use client";

import { DashboardCamera, CameraCategory } from "@/types/camera";

interface PastelMapProps {
  cameras: DashboardCamera[];
  selectedCamera: DashboardCamera;
  onSelectCamera: (camera: DashboardCamera) => void;
  activeCategory: CameraCategory | "all";
  rainChance?: number;
}

export default function PastelMap({
  cameras,
  selectedCamera,
  onSelectCamera,
  activeCategory,
  rainChance = 60,
}: PastelMapProps) {
  const isRaining = rainChance >= 50;

  // Filter cameras visible on map based on category
  const visibleCameras = cameras.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  );

  return (
    <div className="clay-panel p-5 sm:p-7 flex flex-col flex-1 min-w-0 min-h-[580px] sm:min-h-[640px] relative">
      {/* Inner Map Viewport with Clay Inset */}
      <div className="clay-inset relative w-full h-full min-h-[540px] sm:min-h-[600px] rounded-[32px] overflow-hidden bg-[#CCD9F6] select-none">
        {/* SVG Basemap with Pastel Roads, River & Green Parks */}
        <svg
          className="absolute inset-0 w-full h-full object-cover"
          viewBox="0 0 1000 700"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          {/* Base Background */}
          <rect width="1000" height="700" fill="#CCD8F4" />

          {/* Green Park Zones (Organic soft shapes) */}
          <path
            d="M -50 150 C 50 120 180 180 220 280 C 240 330 180 390 120 400 C 30 410 -20 380 -50 350 Z"
            fill="#BFE1CE"
            opacity="0.9"
          />
          <path
            d="M 680 -20 C 750 60 880 70 950 140 C 990 180 980 260 920 300 C 850 340 760 300 720 250 C 660 170 630 60 680 -20 Z"
            fill="#BFE1CE"
            opacity="0.8"
          />

          {/* Soft Pastel Roads Network */}
          <g fill="none" stroke="#E5ECFA" strokeLinecap="round" strokeLinejoin="round">
            {/* Major Horizontal Avenues */}
            <path d="M -50 200 L 1050 210" strokeWidth="32" />
            <path d="M -50 360 L 1050 370" strokeWidth="44" />
            <path d="M -50 510 L 1050 490" strokeWidth="36" />

            {/* Major Vertical Avenues */}
            <path d="M 280 -50 L 290 750" strokeWidth="40" />
            <path d="M 520 -50 L 510 750" strokeWidth="48" />
            <path d="M 760 -50 L 780 750" strokeWidth="36" />

            {/* Diagonal Connecting Boulevards */}
            <path d="M -50 420 Q 300 370 650 340 T 1050 300" strokeWidth="28" />
            <path d="M 180 -50 L 750 750" strokeWidth="22" strokeDasharray="1 0" />
            <path d="M 900 -50 L 350 750" strokeWidth="24" />
          </g>

          {/* Waterway / River Ribbon */}
          <path
            d="M -50 580 Q 250 560 520 480 T 1050 460 L 1050 560 Q 600 580 300 660 T -50 680 Z"
            fill="#A7CBF4"
            opacity="0.95"
          />

          {/* Clouds in the Sky (Top Area) */}
          <g className={isRaining ? "animate-cloud" : ""} opacity="0.9">
            {/* Cloud 1 */}
            <path
              d="M 60 40 Q 80 10 130 15 Q 180 -10 240 10 Q 300 15 320 45 Q 340 90 300 120 Q 250 140 190 130 Q 120 145 70 120 Q 20 85 60 40 Z"
              fill="#7E92D8"
            />
            {/* Cloud 2 (Center) */}
            <path
              d="M 330 35 Q 380 -5 450 0 Q 530 -20 620 5 Q 710 10 730 45 Q 755 90 720 125 Q 670 145 590 135 Q 490 150 430 130 Q 340 105 330 35 Z"
              fill="#6C7FCE"
            />
            {/* Cloud 3 */}
            <path
              d="M 740 40 Q 800 0 880 10 Q 960 5 1010 40 Q 1040 85 1000 120 Q 940 140 860 130 Q 780 140 730 110 Q 690 75 740 40 Z"
              fill="#7E92D8"
            />
          </g>

          {/* Rain Overlay Drops (Only if rainChance >= 50) */}
          {isRaining && (
            <g
              stroke="#587CD4"
              strokeWidth="2.8"
              strokeLinecap="round"
              opacity="0.75"
              className="animate-rain"
            >
              {[
                { x: 120, y: 160 }, { x: 180, y: 220 }, { x: 250, y: 180 },
                { x: 340, y: 240 }, { x: 420, y: 190 }, { x: 480, y: 260 },
                { x: 550, y: 210 }, { x: 620, y: 270 }, { x: 710, y: 220 },
                { x: 790, y: 280 }, { x: 860, y: 200 }, { x: 920, y: 250 },
                { x: 150, y: 320 }, { x: 220, y: 380 }, { x: 310, y: 350 },
                { x: 390, y: 400 }, { x: 460, y: 340 }, { x: 540, y: 420 },
                { x: 630, y: 370 }, { x: 720, y: 430 }, { x: 810, y: 360 },
                { x: 890, y: 410 }, { x: 170, y: 470 }, { x: 260, y: 520 },
              ].map((d, i) => (
                <line key={i} x1={d.x} y1={d.y} x2={d.x - 4} y2={d.y + 14} />
              ))}
            </g>
          )}
        </svg>

        {/* Overlay Top-Left: Peta Lokasi + N titik */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2">
          <div className="clay-pill px-5 py-2.5 bg-[#F3F5FF] flex items-center gap-2.5">
            <span className="text-sm font-bold text-[#2A2950] font-heading">
              Peta Lokasi
            </span>
            <span className="clay-inset px-2.5 py-0.5 rounded-full bg-[#E9EDFB] text-xs font-bold text-[#565A85]">
              {visibleCameras.length} titik
            </span>
          </div>
        </div>

        {/* Camera Pins positioned on the map */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {visibleCameras.map((cam) => {
            const isSelected = selectedCamera.id === cam.id;

            // Determine pin color based on category
            const pinBg =
              cam.category === "traffic"
                ? "#B84A08"
                : cam.category === "public_space"
                ? "#1B7F46"
                : cam.category === "tourism"
                ? "#B8185A"
                : "#2A64C8";

            return (
              <div
                key={cam.id}
                style={{
                  left: `${cam.mapX}%`,
                  top: `${cam.mapY}%`,
                  transform: "translate(-50%, -50%)",
                }}
                className="absolute pointer-events-auto flex flex-col items-center group cursor-pointer transition-transform duration-200"
                onClick={() => onSelectCamera(cam)}
              >
                {/* Pin Circle */}
                <button
                  type="button"
                  aria-label={`Kamera ${cam.number} - ${cam.name}`}
                  aria-pressed={isSelected}
                  style={{
                    backgroundColor: pinBg,
                  }}
                  className={`flex items-center justify-center rounded-full text-white font-bold font-heading border-[3px] border-white shadow-lg transition-all duration-200 ${
                    isSelected
                      ? "w-14 h-14 text-base ring-6 ring-[#6B5CE7] ring-offset-0 scale-110 shadow-2xl"
                      : "w-11 h-11 sm:w-12 sm:h-12 text-sm hover:scale-105"
                  }`}
                >
                  {cam.number}
                </button>

                {/* Selected Camera Label Callout beneath pin */}
                {isSelected && (
                  <div className="mt-2.5 clay-pill px-3.5 py-1 bg-white text-xs font-bold text-[#2A2950] whitespace-nowrap shadow-md pointer-events-none animate-in fade-in zoom-in-95 duration-150">
                    {cam.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Overlay Bottom-Left: Kamera dipilih Card */}
        <div className="absolute bottom-5 left-5 z-20 max-w-[280px] sm:max-w-[340px]">
          <div className="clay-pill px-5 py-3 bg-[#F3F5FF] flex items-center justify-between gap-4 shadow-xl">
            <div className="min-w-0">
              <span className="block text-[11px] font-bold text-[#565A85]">
                Kamera dipilih
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading truncate">
                {selectedCamera.name}
              </h4>
            </div>
            <div className="clay-inset px-3 py-1 rounded-full bg-[#E9EDFB] text-[11px] font-bold text-[#2A2950] shrink-0">
              {selectedCamera.condition}
            </div>
          </div>
        </div>

        {/* Overlay Bottom-Right: Legenda (Hidden on mobile) */}
        <div className="hidden sm:block absolute bottom-5 right-5 z-20">
          <div className="clay-pill px-4 py-3 bg-[#F3F5FF] flex flex-col gap-1.5 shadow-xl text-xs font-bold text-[#2A2950]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B84A08]" />
              <span>Lalu Lintas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1B7F46]" />
              <span>Ruang Publik</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#B8185A]" />
              <span>Wisata</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2A64C8]" />
              <span>Transit</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
