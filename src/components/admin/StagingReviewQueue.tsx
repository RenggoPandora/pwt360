"use client";

import { Camera } from "@/types/camera";
import { CheckCircle2, XCircle, Sparkles, MapPin, ExternalLink, ShieldAlert } from "lucide-react";

interface StagingReviewQueueProps {
  stagingCameras: Camera[];
  onApprove: (camera: Camera) => void;
  onReject: (camera: Camera) => void;
}

export default function StagingReviewQueue({
  stagingCameras,
  onApprove,
  onReject,
}: StagingReviewQueueProps) {
  if (stagingCameras.length === 0) {
    return (
      <div className="clay-card p-12 text-center flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 border border-purple-200">
          <Sparkles className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">
          Antrean Review OSINT Bersih
        </h3>
        <p className="text-sm text-slate-500 max-w-md">
          Semua feed hasil automated discovery dan dorks telah dikurasi. Belum ada feed baru yang menunggu verifikasi ruang publik.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="clay-card-flat p-4 bg-purple-50/60 border border-purple-200/80 flex items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-purple-950">
              Antrean Verifikasi Sumber Terbuka (OSINT Staging)
            </h3>
            <p className="text-xs text-purple-700">
              Model Hybrid: Setiap feed internet terbuka wajib diverifikasi agar tidak mengekspos area privat.
            </p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full bg-purple-200 text-purple-800 text-xs font-bold">
          {stagingCameras.length} Menunggu Approval
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stagingCameras.map((cam) => (
          <div
            key={cam.id}
            className="clay-card p-5 flex flex-col justify-between border-slate-200"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-100 text-purple-800">
                  {cam.sourceName}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {cam.lat.toFixed(4)}, {cam.lng.toFixed(4)}
                </span>
              </div>

              <h4 className="text-base font-bold text-slate-800 mb-1">
                {cam.name}
              </h4>
              <p className="text-xs text-slate-500 mb-3">
                {cam.description || "Titik pantau ruang publik terdeteksi melalui scanner OSINT."}
              </p>

              <div className="flex items-center gap-2 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">{cam.locationName} &bull; {cam.subdistrict || "Banyumas"}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                href={cam.streamUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-semibold text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
              >
                Cek Stream <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReject(cam)}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-xs font-semibold inline-flex items-center gap-1 transition"
                >
                  <XCircle className="w-4 h-4" /> Tolak
                </button>
                <button
                  type="button"
                  onClick={() => onApprove(cam)}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition"
                >
                  <CheckCircle2 className="w-4 h-4" /> Setujui & Terbitkan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
