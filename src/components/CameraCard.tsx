"use client";

import { DashboardCamera } from "@/types/camera";

interface CameraCardProps {
  camera: DashboardCamera;
  isSelected: boolean;
  onSelect: (camera: DashboardCamera) => void;
  onPlayStream: (camera: DashboardCamera) => void;
}

export default function CameraCard({
  camera,
  isSelected,
  onSelect,
  onPlayStream,
}: CameraCardProps) {
  // Category pin colors
  const pinBg =
    camera.category === "traffic"
      ? "#B84A08"
      : camera.category === "public_space"
      ? "#1B7F46"
      : camera.category === "tourism"
      ? "#B8185A"
      : "#2A64C8";

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(camera)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelect(camera);
        }
      }}
      className={`clay-card p-4 sm:p-5 flex flex-col justify-between cursor-pointer select-none transition-all duration-200 ${
        isSelected ? "ring-4 ring-[#6B5CE7]" : ""
      }`}
    >
      {/* Thumbnail Area with Clay Inset */}
      <div
        className="clay-inset relative w-full h-[158px] rounded-[22px] overflow-hidden mb-4 bg-[#E0E7FA] flex items-center justify-center group"
        onClick={(e) => {
          e.stopPropagation();
          onPlayStream(camera);
        }}
      >
        {/* Cute Pastel Illustration representing the location */}
        {camera.thumbnailSvgType === "traffic" && (
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 280 160"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft Sky & City Buildings */}
            <rect width="280" height="160" fill="#D3DDF8" />
            <rect x="40" y="55" width="45" height="50" rx="6" fill="#A8BAE8" />
            <rect x="95" y="40" width="55" height="65" rx="6" fill="#B4C4EC" />
            <rect x="160" y="50" width="50" height="55" rx="6" fill="#A8BAE8" />
            {/* Gray Road Surface */}
            <rect x="0" y="95" width="280" height="65" fill="#8E99B8" />
            <line
              x1="0"
              y1="125"
              x2="280"
              y2="125"
              stroke="#D3DDF8"
              strokeWidth="4"
              strokeDasharray="16 14"
            />
            {/* Cars (Pastel Pills) */}
            <rect x="35" y="112" width="28" height="12" rx="6" fill="#F87171" />
            <rect x="110" y="132" width="32" height="13" rx="6.5" fill="#60A5FA" />
            <rect x="180" y="114" width="28" height="12" rx="6" fill="#F472B6" />
          </svg>
        )}

        {camera.thumbnailSvgType === "park" && (
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 280 160"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Soft Sky & Rolling Green Grass */}
            <rect width="280" height="160" fill="#D8E8FA" />
            <path
              d="M 0 110 Q 90 75 190 100 T 280 90 L 280 160 L 0 160 Z"
              fill="#A2DBB6"
            />
            <path
              d="M 0 125 Q 110 105 220 120 T 280 110 L 280 160 L 0 160 Z"
              fill="#F0DBB4"
            />
            {/* Trees */}
            <rect x="68" y="85" width="8" height="30" fill="#9C6B46" rx="2" />
            <circle cx="72" cy="75" r="22" fill="#75C794" />
            <rect x="220" y="78" width="8" height="32" fill="#9C6B46" rx="2" />
            <circle cx="224" cy="68" r="24" fill="#75C794" />
            {/* Small colorful dots (flowers/people) */}
            <circle cx="110" cy="130" r="4" fill="#F87171" />
            <circle cx="125" cy="132" r="3.5" fill="#60A5FA" />
          </svg>
        )}

        {camera.thumbnailSvgType === "landmark" && (
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 280 160"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Sunset Warm Sky & Landmark Tower */}
            <rect width="280" height="160" fill="#FFE3D4" />
            <path
              d="M 0 120 Q 140 100 280 120 L 280 160 L 0 160 Z"
              fill="#F9D2B5"
            />
            {/* Monument Silhouette */}
            <polygon points="140,30 152,105 128,105" fill="#D78E72" />
            <rect x="120" y="105" width="40" height="20" rx="3" fill="#B56E52" />
            <polygon points="140,20 144,30 136,30" fill="#EFA286" />
            {/* Small dots */}
            <circle cx="90" cy="135" r="4.5" fill="#F472B6" />
            <circle cx="190" cy="132" r="4.5" fill="#60A5FA" />
          </svg>
        )}

        {camera.thumbnailSvgType === "transit" && (
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 280 160"
            preserveAspectRatio="xMidYMid slice"
          >
            {/* Blue Sky & Station Platform */}
            <rect width="280" height="160" fill="#D5E4FA" />
            <rect x="45" y="45" width="190" height="50" rx="10" fill="#88A8E8" />
            <g fill="#EAF1FC">
              <rect x="65" y="58" width="22" height="22" rx="4" />
              <rect x="100" y="58" width="22" height="22" rx="4" />
              <rect x="135" y="58" width="22" height="22" rx="4" />
              <rect x="170" y="58" width="22" height="22" rx="4" />
            </g>
            <rect x="0" y="95" width="280" height="65" fill="#8695BC" />
            {/* Platform edge dots */}
            <g fill="#FFFFFF" opacity="0.9">
              <rect x="40" y="120" width="16" height="6" rx="3" />
              <rect x="66" y="120" width="16" height="6" rx="3" />
              <rect x="92" y="120" width="16" height="6" rx="3" />
              <rect x="118" y="120" width="16" height="6" rx="3" />
            </g>
          </svg>
        )}

        {/* Hover Overlay to Play Live Stream */}
        <div className="absolute inset-0 bg-[#2A2950]/30 opacity-0 group-hover:opacity-100 backdrop-blur-2xs transition-opacity duration-200 flex items-center justify-center">
          <div className="clay-pill px-4 py-2 bg-white text-xs font-bold text-[#6B5CE7] flex items-center gap-1.5 shadow-lg scale-95 group-hover:scale-100 transition-transform">
            <svg
              className="w-3.5 h-3.5 fill-current"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <span>Buka Siaran</span>
          </div>
        </div>

        {/* Top-Left: LIVE Badge */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C62A5B] text-white text-[11px] font-bold shadow-md">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Top-Right: Time Badge */}
        <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-white/90 text-[#2A2950] text-[11px] font-bold shadow-sm font-heading">
          {camera.time}
        </div>
      </div>

      {/* Card Info Bottom Row */}
      <div className="flex items-start gap-3">
        {/* Category Numbered Badge */}
        <div
          style={{ backgroundColor: pinBg }}
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold font-heading text-sm border-2 border-white shadow-md shrink-0"
        >
          {camera.number}
        </div>

        {/* Name and Condition */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-bold text-[#2A2950] font-heading leading-tight truncate mb-1">
            {camera.name}
          </h3>
          <div className="flex items-center gap-2 text-xs font-bold text-[#565A85]">
            <span>{camera.categoryLabel}</span>
            <div className="flex items-center gap-1">
              <span
                style={{ backgroundColor: camera.conditionColor }}
                className="w-2 h-2 rounded-full shrink-0"
              />
              <span className="text-[#2A2950]">{camera.condition}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
