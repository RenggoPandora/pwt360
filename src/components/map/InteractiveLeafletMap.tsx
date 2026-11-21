"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { DashboardCamera, CameraCategory } from "@/types/camera";
import { WeatherConditionType } from "@/lib/weather";

interface InteractiveLeafletMapProps {
  cameras: DashboardCamera[];
  selectedCamera: DashboardCamera;
  onSelectCamera: (camera: DashboardCamera) => void;
  activeCategory: CameraCategory | "all";
  rainChance?: number;
  conditionType?: WeatherConditionType;
}

export default function InteractiveLeafletMap({
  cameras,
  selectedCamera,
  onSelectCamera,
  activeCategory,
  rainChance = 60,
  conditionType = "rainy",
}: InteractiveLeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});
  const isRaining = rainChance >= 50;

  // Filter cameras visible on map based on category
  const visibleCameras = cameras.filter(
    (c) => activeCategory === "all" || c.category === activeCategory
  );

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Purwokerto encompassing downtown and eastern corridor
    const center: [number, number] = [-7.432, 109.252];
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 13,
      zoomControl: false,
      minZoom: 11,
      maxZoom: 18,
    });

    // Custom positioned zoom control (top-right so it doesn't overlap bottom legends)
    L.control.zoom({ position: "topright" }).addTo(map);

    // 100% Free OpenStreetMap tiles (No API key required)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Sync Markers with visibleCameras and selectedCamera
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    visibleCameras.forEach((cam) => {
      const isSelected = selectedCamera.id === cam.id;

      const pinBg =
        cam.category === "traffic"
          ? "#B84A08"
          : cam.category === "public_space"
          ? "#1B7F46"
          : cam.category === "tourism"
          ? "#B8185A"
          : "#2A64C8";

      const pinSize = isSelected ? 56 : 46;

      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
          <!-- Pin Circle -->
          <div style="
            width: ${pinSize}px;
            height: ${pinSize}px;
            background-color: ${pinBg};
            color: #ffffff;
            border-radius: 50%;
            border: 3px solid #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: var(--font-fredoka), sans-serif;
            font-size: ${isSelected ? "17px" : "14px"};
            font-weight: 700;
            box-shadow: 0 8px 20px rgba(0,0,0,0.22);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            ${
              isSelected
                ? "box-shadow: 0 0 0 6px #6B5CE7, 0 10px 24px rgba(107, 92, 231, 0.45); transform: scale(1.1);"
                : ""
            }
          ">
            ${cam.number}
          </div>

          <!-- Selected Name Callout -->
          ${
            isSelected
              ? `<div style="
                  margin-top: 8px;
                  padding: 4px 12px;
                  background-color: #ffffff;
                  color: #2A2950;
                  font-family: var(--font-nunito), sans-serif;
                  font-size: 11px;
                  font-weight: 800;
                  border-radius: 9999px;
                  white-space: nowrap;
                  box-shadow: 0 4px 14px rgba(0,0,0,0.18);
                  border: 1px solid rgba(255,255,255,0.8);
                ">
                  ${cam.name}
                </div>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-leaflet-pin",
        html: iconHtml,
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize / 2],
      });

      const marker = L.marker([cam.lat, cam.lng], { icon: customIcon });

      marker.on("click", () => {
        onSelectCamera(cam);
      });

      marker.addTo(map);
      markersRef.current[cam.id] = marker;
    });
  }, [visibleCameras, selectedCamera, onSelectCamera]);

  // Smooth flyTo selected camera
  useEffect(() => {
    if (selectedCamera && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedCamera.lat, selectedCamera.lng],
        15,
        {
          duration: 1.0,
        }
      );
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 300);
    }
  }, [selectedCamera]);

  return (
    <div className="clay-panel p-5 sm:p-7 flex flex-col flex-1 min-w-0 h-[620px] sm:h-[680px] relative shrink-0">
      {/* Inner Map Viewport with Clay Inset */}
      <div className="clay-inset relative w-full h-full rounded-[32px] overflow-hidden bg-[#CCD9F6]">
        {/* Leaflet Map Div */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Atmospheric Weather Overlay: Sunny, Cloudy, Rainy, Thunderstorm */}
        {conditionType === "sunny" && (
          <div className="absolute top-4 right-4 z-10 pointer-events-none overflow-hidden flex items-center justify-center">
            {/* Ambient Golden Sun Flare & Radiating Rays */}
            <div className="relative w-44 h-44 flex items-center justify-center">
              <div
                className="absolute inset-0 rounded-full animate-sun-pulse"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255, 185, 30, 0.45) 0%, rgba(255, 215, 60, 0.22) 45%, transparent 75%)",
                }}
              />
              <svg
                className="w-28 h-28 text-[#F59E0B] animate-sun-spin opacity-85"
                viewBox="0 0 100 100"
                fill="none"
              >
                <circle cx="50" cy="50" r="20" fill="#FFA500" />
                <circle cx="50" cy="50" r="16" fill="#FFC107" />
                {/* 12 Sunbeams */}
                {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
                  <line
                    key={deg}
                    x1="50"
                    y1="18"
                    x2="50"
                    y2="8"
                    stroke="#F59E0B"
                    strokeWidth="4"
                    strokeLinecap="round"
                    transform={`rotate(${deg} 50 50)`}
                  />
                ))}
              </svg>
            </div>
          </div>
        )}

        {(conditionType === "cloudy" || conditionType === "rainy" || conditionType === "thunderstorm") && (
          <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden opacity-65">
            {/* Top Clouds */}
            <svg
              className={`absolute -top-6 left-0 right-0 w-full h-28 animate-cloud ${
                conditionType === "thunderstorm"
                  ? "text-[#5A6D9E]"
                  : conditionType === "rainy"
                  ? "text-[#7E92D8]"
                  : "text-[#9EB1E8]"
              }`}
              viewBox="0 0 1000 120"
              fill="currentColor"
            >
              <path d="M 60 40 Q 80 10 130 15 Q 180 -10 240 10 Q 300 15 320 45 Q 340 90 300 120 Q 250 140 190 130 Q 120 145 70 120 Q 20 85 60 40 Z" />
              <path d="M 330 35 Q 380 -5 450 0 Q 530 -20 620 5 Q 710 10 730 45 Q 755 90 720 125 Q 670 145 590 135 Q 490 150 430 130 Q 340 105 330 35 Z" />
              <path d="M 740 40 Q 800 0 880 10 Q 960 5 1010 40 Q 1040 85 1000 120 Q 940 140 860 130 Q 780 140 730 110 Q 690 75 740 40 Z" />
            </svg>

            {/* Falling Raindrops (Only if rainy or thunderstorm) */}
            {(conditionType === "rainy" || conditionType === "thunderstorm") && (
              <svg
                className="w-full h-full animate-rain text-[#587CD4]"
                viewBox="0 0 1000 700"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
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
              </svg>
            )}
          </div>
        )}

        {/* Overlay Top-Left: Peta Lokasi + N titik */}
        <div className="absolute top-5 left-5 z-20 flex items-center gap-2 pointer-events-auto">
          <div className="clay-pill px-5 py-2.5 bg-[#F3F5FF] flex items-center gap-2.5 shadow-lg">
            <span className="text-sm font-bold text-[#2A2950] font-heading">
              Peta Lokasi
            </span>
            <span className="clay-inset px-2.5 py-0.5 rounded-full bg-[#E9EDFB] text-xs font-bold text-[#565A85]">
              {visibleCameras.length} titik
            </span>
          </div>
        </div>

        {/* Overlay Bottom-Left: Kamera dipilih Card */}
        <div className="absolute bottom-5 left-5 z-20 max-w-[280px] sm:max-w-[340px] pointer-events-auto">
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
        <div className="hidden sm:block absolute bottom-5 right-5 z-20 pointer-events-auto">
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
