"use client";

import dynamic from "next/dynamic";
import { Camera } from "@/types/camera";
import { Loader2 } from "lucide-react";

const LeafletMap = dynamic(() => import("./LeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] rounded-2xl bg-slate-100 flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      <span className="text-xs font-medium">Memuat Peta Interaktif Purwokerto...</span>
    </div>
  ),
});

interface MapWrapperProps {
  cameras: Camera[];
  selectedCamera: Camera | null;
  onSelectCamera: (camera: Camera) => void;
}

export default function MapWrapper(props: MapWrapperProps) {
  return <LeafletMap {...props} />;
}
