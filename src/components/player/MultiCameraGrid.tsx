"use client";

import { Camera } from "@/types/camera";
import StreamPlayer from "./StreamPlayer";
import { Plus, X, Grid2X2 } from "lucide-react";

interface MultiCameraGridProps {
  activeCameras: Camera[];
  availableCameras: Camera[];
  onRemoveCamera: (cameraId: string) => void;
  onAddCamera: (camera: Camera) => void;
  onClose: () => void;
}

export default function MultiCameraGrid({
  activeCameras,
  availableCameras,
  onRemoveCamera,
  onAddCamera,
  onClose,
}: MultiCameraGridProps) {
  const emptySlots = Math.max(0, 4 - activeCameras.length);

  return (
    <div className="clay-card p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
            <Grid2X2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Multi-Camera Wall (Simultan 2x2)
            </h3>
            <p className="text-xs text-slate-500">
              Pantau hingga 4 titik jalan atau ruang publik Purwokerto sekaligus.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {activeCameras.slice(0, 4).map((cam) => (
          <div key={cam.id} className="relative group">
            <StreamPlayer camera={cam} />
            <button
              type="button"
              onClick={() => onRemoveCamera(cam.id)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-rose-600 backdrop-blur-md z-30 transition opacity-0 group-hover:opacity-100 shadow-lg"
              title="Keluarkan dari Grid"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {Array.from({ length: emptySlots }).map((_, idx) => (
          <div
            key={`empty-${idx}`}
            className="aspect-video rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center p-6 text-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/30 transition group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-600 group-hover:border-blue-300 transition shadow-xs mb-2">
              <Plus className="w-5 h-5" />
            </div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Slot Kosong</p>
            <select
              defaultValue=""
              onChange={(e) => {
                const found = availableCameras.find((c) => c.id === e.target.value);
                if (found) onAddCamera(found);
              }}
              className="px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 text-slate-700 max-w-xs focus:outline-blue-500 shadow-xs"
            >
              <option value="" disabled>
                + Pilih Kamera Tambahan...
              </option>
              {availableCameras
                .filter((c) => !activeCameras.some((a) => a.id === c.id))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
