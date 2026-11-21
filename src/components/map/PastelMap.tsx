"use client";

import dynamic from "next/dynamic";
import { DashboardCamera, CameraCategory } from "@/types/camera";

interface PastelMapProps {
  cameras: DashboardCamera[];
  selectedCamera: DashboardCamera;
  onSelectCamera: (camera: DashboardCamera) => void;
  activeCategory: CameraCategory | "all";
  rainChance?: number;
}

const InteractiveLeafletMap = dynamic(
  () => import("./InteractiveLeafletMap"),
  {
    ssr: false,
    loading: () => (
      <div className="clay-panel p-5 sm:p-7 flex flex-col flex-1 min-w-0 min-h-[580px] sm:min-h-[640px] relative">
        <div className="clay-inset w-full h-full min-h-[540px] sm:min-h-[600px] rounded-[32px] bg-[#CCD9F6] flex flex-col items-center justify-center gap-3 text-[#565A85]">
          <div className="w-10 h-10 rounded-full border-3 border-[#6B5CE7] border-t-transparent animate-spin" />
          <span className="text-xs font-bold font-heading">
            Memuat Peta Interaktif Purwokerto...
          </span>
        </div>
      </div>
    ),
  }
);

export default function PastelMap(props: PastelMapProps) {
  return <InteractiveLeafletMap {...props} />;
}
