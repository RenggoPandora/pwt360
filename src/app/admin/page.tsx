"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { DashboardCamera, CameraCategory, TrafficCondition } from "@/types/camera";
import { getAllCamerasAdmin, updateCameraAdmin } from "@/lib/supabase/cameras";
import ClayLivePlayer from "@/components/player/ClayLivePlayer";

const AdminPinMap = dynamic(() => import("@/components/admin/AdminPinMap"), {
  ssr: false,
  loading: () => (
    <div className="clay-panel p-5 flex flex-col w-full h-[540px] sm:h-[620px] relative">
      <div className="clay-inset w-full h-full rounded-[24px] bg-[#CCD9F6] flex flex-col items-center justify-center gap-3 text-[#565A85]">
        <div className="w-9 h-9 rounded-full border-3 border-[#6B5CE7] border-t-transparent animate-spin" />
        <span className="text-xs font-bold font-heading">
          Memuat Peta Editor Pin...
        </span>
      </div>
    </div>
  ),
});

export default function AdminPage() {
  const [cameras, setCameras] = useState<DashboardCamera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<DashboardCamera | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form edit state
  const [editName, setEditName] = useState<string>("");
  const [editCategory, setEditCategory] = useState<CameraCategory>("traffic");
  const [editCondition, setEditCondition] = useState<TrafficCondition>("Lancar");
  const [editLat, setEditLat] = useState<number>(-7.424);
  const [editLng, setEditLng] = useState<number>(109.239);
  const [editStreamUrl, setEditStreamUrl] = useState<string>("");
  const [editStreamType, setEditStreamType] = useState<"hls" | "youtube">("hls");
  const [editIsVisible, setEditIsVisible] = useState<boolean>(true);

  // Load cameras
  useEffect(() => {
    getAllCamerasAdmin().then((data) => {
      setCameras(data);
      if (data.length > 0) {
        selectCameraForEdit(data[0]);
      }
      setIsLoading(false);
    });
  }, []);

  const selectCameraForEdit = (cam: DashboardCamera) => {
    setSelectedCamera(cam);
    setEditName(cam.name);
    setEditCategory(cam.category);
    setEditCondition(cam.condition);
    setEditLat(cam.lat);
    setEditLng(cam.lng);
    setEditStreamUrl(cam.streamUrl);
    setEditStreamType(cam.streamType);
    setEditIsVisible(cam.status !== "hidden");
    setSaveMessage(null);
  };

  const handleCoordinatesChange = (lat: number, lng: number) => {
    setEditLat(lat);
    setEditLng(lng);
    if (selectedCamera) {
      setSelectedCamera((prev) => (prev ? { ...prev, lat, lng } : null));
    }
  };

  const handleSaveCamera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCamera) return;

    setIsSaving(true);
    setSaveMessage(null);

    const conditionColorMap: Record<TrafficCondition, string> = {
      Lancar: "#10B981",
      Padat: "#F59E0B",
      Ramai: "#EF4444",
      Tenang: "#3B82F6",
    };

    const categoryLabelMap: Record<CameraCategory, string> = {
      traffic: "Lalu Lintas",
      public_space: "Ruang Publik",
      tourism: "Wisata",
      transit: "Transit",
    };

    const updates: Partial<DashboardCamera> = {
      name: editName,
      category: editCategory,
      categoryLabel: categoryLabelMap[editCategory],
      condition: editCondition,
      conditionColor: conditionColorMap[editCondition],
      lat: editLat,
      lng: editLng,
      streamUrl: editStreamUrl,
      streamType: editStreamType,
      status: editIsVisible ? "online" : "hidden",
      isVisible: editIsVisible,
    };

    const res = await updateCameraAdmin(selectedCamera.id, updates);
    setIsSaving(false);

    if (res.success) {
      setSaveMessage("Perubahan kamera & posisi pin berhasil disimpan!");
      // Update local state
      setCameras((prev) =>
        prev.map((c) => (c.id === selectedCamera.id ? { ...c, ...updates } : c))
      );
      if (selectedCamera) {
        setSelectedCamera((prev) => (prev ? { ...prev, ...updates } : null));
      }
      setTimeout(() => setSaveMessage(null), 3500);
    } else {
      setSaveMessage(`Gagal menyimpan: ${res.error || "Unknown error"}`);
    }
  };

  const handleQuickToggleVisibility = async (cam: DashboardCamera) => {
    const newStatus = cam.status === "hidden" ? "online" : "hidden";
    const res = await updateCameraAdmin(cam.id, {
      status: newStatus,
      isVisible: newStatus === "online",
    });

    if (res.success) {
      setCameras((prev) =>
        prev.map((c) => (c.id === cam.id ? { ...c, status: newStatus } : c))
      );
      if (selectedCamera?.id === cam.id) {
        setEditIsVisible(newStatus === "online");
      }
    }
  };

  const publicCount = cameras.filter((c) => c.status !== "hidden").length;
  const hiddenCount = cameras.filter((c) => c.status === "hidden").length;

  return (
    <div className="min-h-screen bg-[#E9EDFB] text-[#2A2950] pb-16 selection:bg-[#6B5CE7] selection:text-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-10 pt-7 space-y-8">
        {/* Admin Navigation Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#D8DFEE]">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-[16px] bg-[#6B5CE7] text-white flex items-center justify-center font-bold text-lg shadow-md shadow-[#6B5CE7]/30">
              ⚡
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-heading text-[#2A2950]">
                PWT360 Admin Studio
              </h1>
              <p className="text-xs font-bold text-[#565A85]">
                Kelola nama, koordinat pin di peta, dan visibilitas kamera publik
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="clay-pill px-4 py-2 flex items-center gap-2 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>{publicCount} Ditampilkan</span>
              <span className="text-slate-300">&bull;</span>
              <span className="w-2 h-2 rounded-full bg-slate-400" />
              <span>{hiddenCount} Disembunyikan</span>
            </div>

            <Link
              href="/"
              className="clay-chip px-5 flex items-center gap-2 bg-[#6B5CE7] text-white font-bold text-xs shadow-md hover:opacity-95"
            >
              <span>Lihat Website Publik</span>
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </header>

        {/* Workspace: Interactive Map Pin Editor + Edit Form Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
          {/* Left Column: Interactive Map */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold font-heading text-[#2A2950]">
                Editor Posisi Pin di Peta
              </h2>
              <span className="text-xs font-bold text-[#565A85]">
                Pin Terpilih: {selectedCamera ? `#${selectedCamera.number} - ${selectedCamera.name}` : "-"}
              </span>
            </div>

            <AdminPinMap
              cameras={cameras}
              selectedCamera={selectedCamera}
              onSelectCamera={selectCameraForEdit}
              onCoordinatesChange={handleCoordinatesChange}
            />
          </div>

          {/* Right Column: Camera Edit Panel */}
          <div className="lg:col-span-5 space-y-4">
            <div className="clay-panel p-6 sm:p-7 flex flex-col gap-5 w-full bg-[#F3F5FF]">
              <div className="flex items-center justify-between pb-3 border-b border-[#E0E5F5]">
                <h3 className="text-base font-bold font-heading text-[#2A2950]">
                  Pengaturan Kamera
                </h3>
                {selectedCamera && (
                  <span className="w-7 h-7 rounded-full bg-[#6B5CE7] text-white text-xs font-bold font-heading flex items-center justify-center">
                    {selectedCamera.number}
                  </span>
                )}
              </div>

              {saveMessage && (
                <div
                  className={`p-3 rounded-[16px] text-xs font-bold animate-in fade-in ${
                    saveMessage.includes("berhasil")
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-rose-100 text-rose-800 border border-rose-200"
                  }`}
                >
                  {saveMessage}
                </div>
              )}

              {selectedCamera ? (
                <form onSubmit={handleSaveCamera} className="space-y-4 text-xs font-bold text-[#2A2950]">
                  {/* Public Visibility Toggle */}
                  <div className="clay-inset p-3.5 rounded-[18px] bg-[#E9EDFB] flex items-center justify-between">
                    <div>
                      <span className="block text-xs font-bold text-[#2A2950]">
                        Tampilkan ke Publik
                      </span>
                      <span className="text-[10px] font-medium text-[#565A85]">
                        {editIsVisible ? "Kamera muncul di peta & daftar" : "Kamera disembunyikan dari publik"}
                      </span>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editIsVisible}
                        onChange={(e) => setEditIsVisible(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#10B981]"></div>
                    </label>
                  </div>

                  {/* Camera Name */}
                  <div>
                    <label className="block text-[#565A85] mb-1">Nama Kamera</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-bold text-[#2A2950] focus:outline-[#6B5CE7]"
                    />
                  </div>

                  {/* Category & Traffic Condition */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#565A85] mb-1">Kategori</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as CameraCategory)}
                        className="w-full px-3 py-2.5 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-bold text-[#2A2950] focus:outline-[#6B5CE7]"
                      >
                        <option value="traffic">Lalu Lintas</option>
                        <option value="public_space">Ruang Publik</option>
                        <option value="tourism">Wisata</option>
                        <option value="transit">Transit</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[#565A85] mb-1">Kondisi Lalu Lintas</label>
                      <select
                        value={editCondition}
                        onChange={(e) => setEditCondition(e.target.value as TrafficCondition)}
                        className="w-full px-3 py-2.5 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-bold text-[#2A2950] focus:outline-[#6B5CE7]"
                      >
                        <option value="Lancar">Lancar</option>
                        <option value="Padat">Padat</option>
                        <option value="Ramai">Ramai</option>
                        <option value="Tenang">Tenang</option>
                      </select>
                    </div>
                  </div>

                  {/* Coordinates: Latitude & Longitude */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[#565A85]">Koordinat GPS Pin</label>
                      <span className="text-[10px] text-[#6B5CE7] font-semibold">
                        Bisa digeser langsung di peta
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="number"
                        step="0.000001"
                        value={editLat}
                        onChange={(e) => setEditLat(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-mono text-[#2A2950] focus:outline-[#6B5CE7]"
                        placeholder="Latitude"
                      />
                      <input
                        type="number"
                        step="0.000001"
                        value={editLng}
                        onChange={(e) => setEditLng(parseFloat(e.target.value) || 0)}
                        required
                        className="w-full px-3 py-2 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-mono text-[#2A2950] focus:outline-[#6B5CE7]"
                        placeholder="Longitude"
                      />
                    </div>
                  </div>

                  {/* Stream URL & Type */}
                  <div>
                    <label className="block text-[#565A85] mb-1">URL Siaran (HLS .m3u8 atau YouTube)</label>
                    <input
                      type="text"
                      value={editStreamUrl}
                      onChange={(e) => setEditStreamUrl(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-[14px] bg-white border border-[#CCD6EC] text-xs font-mono text-[#2A2950] focus:outline-[#6B5CE7]"
                      placeholder="https://.../index.m3u8"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-3 rounded-[18px] bg-[#6B5CE7] hover:bg-[#5b4cdb] text-white font-bold font-heading text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? "Menyimpan ke Database..." : "Simpan Perubahan Kamera"}
                  </button>
                </form>
              ) : (
                <p className="text-xs text-[#565A85]">Pilih kamera dari daftar atau peta untuk mengedit.</p>
              )}
            </div>

            {/* Quick Live Preview Player */}
            {selectedCamera && (
              <div className="clay-panel p-4 bg-[#F3F5FF]">
                <h4 className="text-xs font-bold text-[#565A85] mb-2 font-heading">
                  Preview Siaran Kamera
                </h4>
                <ClayLivePlayer camera={selectedCamera} />
              </div>
            )}
          </div>
        </div>

        {/* Camera List Table */}
        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-bold font-heading text-[#2A2950]">
            Daftar Seluruh Kamera ({cameras.length})
          </h2>

          <div className="clay-panel overflow-hidden bg-[#F3F5FF]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-bold">
                <thead className="bg-[#E4ECFA] text-[#565A85] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">No</th>
                    <th className="p-4">Nama Kamera</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Kondisi</th>
                    <th className="p-4">Koordinat GPS</th>
                    <th className="p-4 text-center">Status Publik</th>
                    <th className="p-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E0E5F5]">
                  {cameras.map((c) => {
                    const isSelected = selectedCamera?.id === c.id;
                    const isOnline = c.status !== "hidden";

                    return (
                      <tr
                        key={c.id}
                        className={`transition hover:bg-white/60 ${
                          isSelected ? "bg-white/80" : ""
                        }`}
                      >
                        <td className="p-4 font-heading">{c.number}</td>
                        <td className="p-4 text-[#2A2950] font-heading text-xs sm:text-sm">
                          {c.name}
                        </td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-[#E9EDFB] text-[#565A85] text-[10px]">
                            {c.categoryLabel}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1.5">
                            <span
                              style={{ backgroundColor: c.conditionColor }}
                              className="w-2 h-2 rounded-full"
                            />
                            {c.condition}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-[11px] text-[#565A85]">
                          {c.lat.toFixed(4)}, {c.lng.toFixed(4)}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleQuickToggleVisibility(c)}
                            className={`px-3 py-1 rounded-full text-[10px] font-bold cursor-pointer transition ${
                              isOnline
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                            }`}
                          >
                            {isOnline ? "● Tampil di Publik" : "○ Disembunyikan"}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              selectCameraForEdit(c);
                              window.scrollTo({ top: 120, behavior: "smooth" });
                            }}
                            className="px-3 py-1 rounded-[12px] bg-[#6B5CE7] hover:bg-[#5b4cdb] text-white text-[11px] cursor-pointer"
                          >
                            Edit Pin
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
