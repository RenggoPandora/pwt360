"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { DashboardCamera } from "@/types/camera";

interface AdminPinMapProps {
  cameras: DashboardCamera[];
  selectedCamera: DashboardCamera | null;
  onSelectCamera: (camera: DashboardCamera) => void;
  onCoordinatesChange: (lat: number, lng: number) => void;
}

export default function AdminPinMap({
  cameras,
  selectedCamera,
  onSelectCamera,
  onCoordinatesChange,
}: AdminPinMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const center: [number, number] = [-7.426, 109.238];
    const map = L.map(mapContainerRef.current, {
      center: center,
      zoom: 14,
      zoomControl: true,
    });

    // 100% Free OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Clicking anywhere on map repositions the currently selected camera pin
    map.on("click", (e: L.LeafletMouseEvent) => {
      onCoordinatesChange(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [onCoordinatesChange]);

  // Synchronize markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    Object.values(markersRef.current).forEach((m) => m.remove());
    markersRef.current = {};

    cameras.forEach((cam) => {
      const isSelected = selectedCamera?.id === cam.id;
      const isHidden = cam.status === "hidden";

      const pinBg = isHidden
        ? "#94A3B8"
        : cam.category === "traffic"
        ? "#B84A08"
        : cam.category === "public_space"
        ? "#1B7F46"
        : cam.category === "tourism"
        ? "#B8185A"
        : "#2A64C8";

      const pinSize = isSelected ? 52 : 42;

      const iconHtml = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
        ">
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
            font-size: ${isSelected ? "16px" : "13px"};
            font-weight: 700;
            box-shadow: 0 6px 16px rgba(0,0,0,0.25);
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            ${
              isSelected
                ? "box-shadow: 0 0 0 5px #6B5CE7, 0 8px 20px rgba(107, 92, 231, 0.45); transform: scale(1.1);"
                : ""
            }
          ">
            ${cam.number}
          </div>
          ${
            isSelected
              ? `<div style="
                  margin-top: 4px;
                  padding: 2px 8px;
                  background-color: #2A2950;
                  color: #ffffff;
                  font-family: var(--font-nunito), sans-serif;
                  font-size: 10px;
                  font-weight: 700;
                  border-radius: 9999px;
                  white-space: nowrap;
                  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                ">
                  Tarik untuk geser
                </div>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-admin-pin",
        html: iconHtml,
        iconSize: [pinSize, pinSize],
        iconAnchor: [pinSize / 2, pinSize / 2],
      });

      const marker = L.marker([cam.lat, cam.lng], {
        icon: customIcon,
        draggable: isSelected, // Pin can be dragged on map when selected!
      });

      marker.on("click", () => {
        onSelectCamera(cam);
      });

      // Handle dragging pin to update coordinate
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        onCoordinatesChange(Number(pos.lat.toFixed(6)), Number(pos.lng.toFixed(6)));
      });

      marker.addTo(map);
      markersRef.current[cam.id] = marker;
    });
  }, [cameras, selectedCamera, onSelectCamera, onCoordinatesChange]);

  // Pan to selected camera
  useEffect(() => {
    if (selectedCamera && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedCamera.lat, selectedCamera.lng],
        mapInstanceRef.current.getZoom(),
        { duration: 0.8 }
      );
    }
  }, [selectedCamera]);

  return (
    <div className="clay-panel p-4 sm:p-5 flex flex-col w-full h-[540px] sm:h-[620px] relative">
      <div className="clay-inset relative w-full h-full rounded-[24px] overflow-hidden bg-[#CCD9F6]">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Tip Badge */}
        <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
          <div className="clay-pill px-4 py-2 bg-white/95 text-xs font-bold text-[#2A2950] shadow-md flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#6B5CE7]" />
            <span>Klik di peta atau seret pin terpilih untuk menyesuaikan lokasi</span>
          </div>
        </div>
      </div>
    </div>
  );
}
