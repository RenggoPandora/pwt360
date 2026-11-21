"use client";

import { CameraCategory } from "@/types/camera";

interface FilterBarProps {
  activeCategory: CameraCategory | "all";
  onSelectCategory: (category: CameraCategory | "all") => void;
  counts: {
    all: number;
    traffic: number;
    public_space: number;
    tourism: number;
    transit: number;
  };
}

export default function FilterBar({
  activeCategory,
  onSelectCategory,
  counts,
}: FilterBarProps) {
  const filters: {
    id: CameraCategory | "all";
    label: string;
    tint: string;
    count: number;
    icon: React.ReactNode;
  }[] = [
    {
      id: "all",
      label: "Semua Kategori",
      tint: "#6B5CE7",
      count: counts.all,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
        </svg>
      ),
    },
    {
      id: "traffic",
      label: "Lalu Lintas & Simpang",
      tint: "#FFD9B8",
      count: counts.traffic,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 19V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v14" />
          <path d="M12 7v3M12 14v3" />
        </svg>
      ),
    },
    {
      id: "public_space",
      label: "Ruang Publik & Taman",
      tint: "#CDEFD6",
      count: counts.public_space,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21a8 8 0 0 0 8-8c0-3.5-3-6-8-10-5 4-8 6.5-8 10a8 8 0 0 0 8 8Z" />
          <path d="M12 11v10" />
        </svg>
      ),
    },
    {
      id: "tourism",
      label: "Wisata & Landmark",
      tint: "#FFD3E2",
      count: counts.tourism,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
    {
      id: "transit",
      label: "Stasiun & Transit",
      tint: "#CFE3FF",
      count: counts.transit,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="4" y="3" width="16" height="15" rx="3" />
          <path d="M4 11h16M8 18l-3 3M16 18l3 3M8 7h.01M16 7h.01" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none select-none">
      {filters.map((f) => {
        const isActive = activeCategory === f.id;

        return (
          <button
            key={f.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectCategory(f.id)}
            style={{
              backgroundColor: isActive ? "#6B5CE7" : f.tint,
              color: isActive ? "#FFFFFF" : "#2A2950",
            }}
            className={`clay-chip px-5 sm:px-6 flex items-center gap-3 shrink-0 cursor-pointer font-bold font-heading text-xs sm:text-sm ${
              isActive ? "clay-chip-active" : ""
            }`}
          >
            <span className="shrink-0">{f.icon}</span>
            <span className="whitespace-nowrap">{f.label}</span>
            <span
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-black/10 text-[#2A2950]"
              }`}
            >
              {f.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
