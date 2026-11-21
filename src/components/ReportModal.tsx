"use client";

import { useState } from "react";
import { Camera } from "@/types/camera";
import { Flag, X, CheckCircle, ShieldAlert } from "lucide-react";

interface ReportModalProps {
  camera: Camera | null;
  onClose: () => void;
}

export default function ReportModal({ camera, onClose }: ReportModalProps) {
  const [reason, setReason] = useState<string>("offline");
  const [note, setNote] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  if (!camera) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="clay-card w-full max-w-md p-6 bg-white relative animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-800 mb-1">
              Laporan Berhasil Terkirim
            </h4>
            <p className="text-xs text-slate-500">
              Terima kasih telah membantu menjaga akurasi & keamanan feed PWT360.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-2 text-rose-600 mb-3">
              <Flag className="w-5 h-5" />
              <h3 className="text-base font-bold text-slate-900">
                Laporkan Kendala Kamera
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 mb-4 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">{camera.name}</p>
              <p className="text-slate-500">
                {camera.locationName} &bull; {camera.sourceName}
              </p>
            </div>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-semibold text-slate-700">
                Pilih Jenis Masalah
              </label>
              <div className="grid grid-cols-1 gap-2 text-xs">
                {[
                  { id: "offline", label: "Stream Mati / Tidak Bisa Diputar" },
                  { id: "location", label: "Posisi GPS / Nama Lokasi Salah" },
                  { id: "privacy", label: "Pelanggaran Privasi (Bukan Ruang Publik)" },
                  { id: "other", label: "Masalah Lainnya" },
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                      reason === item.id
                        ? "border-blue-500 bg-blue-50/50 text-blue-900 font-medium"
                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="report_reason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={(e) => setReason(e.target.value)}
                      className="text-blue-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Jelaskan secara singkat kendala yang terjadi..."
                  rows={3}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-blue-500 text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition"
              >
                Kirim Laporan
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
