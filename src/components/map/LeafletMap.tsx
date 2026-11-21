"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import { Camera } from "@/types/camera";

interface LeafletMapProps {
  cameras: Camera[];
  selectedCamera: Camera | null;
  onSelectCamera: (camera: Camera) => void;
}

export default function LeafletMap({
  cameras,
  selectedCamera,
  onSelectCamera,
}: LeafletMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [id: string]: L.Marker }>({});

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center of Purwokerto
    const initialCenter: [number, number] = [-7.424, 109.239];
    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 13,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    cameras.forEach((cam) => {
      const isSelected = selectedCamera?.id === cam.id;
      const isOnline = cam.status === "online";
      const isOsint = !cam.isOfficial;

      const markerColor = isOnline
        ? isOsint
          ? "#8B5CF6"
          : "#10B981"
        : "#F59E0B";

      const iconHtml = `
        <div style="
          position: relative;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-radius: 50%;
          border: 2px solid ${markerColor};
          box-shadow: 0 4px 12px rgba(0,0,0,0.25);
          cursor: pointer;
          transform: ${isSelected ? "scale(1.25)" : "scale(1)"};
          transition: transform 0.2s ease;
        ">
          <div style="
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${markerColor};
          "></div>
          ${
            isOnline
              ? `<div style="
                  position: absolute;
                  inset: -4px;
                  border-radius: 50%;
                  border: 2px solid ${markerColor};
                  opacity: 0.6;
                  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                "></div>`
              : ""
          }
        </div>
      `;

      const customIcon = L.divIcon({
        className: "custom-camera-marker",
        html: iconHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([cam.lat, cam.lng], { icon: customIcon });

      const popupContent = `
        <div style="font-family: inherit; min-width: 200px; padding: 4px;">
          <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${
            cam.isOfficial ? "#2563EB" : "#7C3AED"
          }; margin-bottom: 2px;">
            ${cam.isOfficial ? "Resmi &bull; ATCS" : "OSINT Public Feed"}
          </div>
          <h4 style="font-size: 14px; font-weight: 700; color: #1E293B; margin: 0 0 4px 0;">
            ${cam.name}
          </h4>
          <p style="font-size: 12px; color: #64748B; margin: 0 0 8px 0;">
            ${cam.locationName} &bull; ${cam.subdistrict || "Banyumas"}
          </p>
          <button id="btn-select-${cam.id}" style="
            width: 100%;
            padding: 6px 12px;
            font-size: 12px;
            font-weight: 600;
            color: #ffffff;
            background: #2563EB;
            border: none;
            border-radius: 8px;
            cursor: pointer;
          ">
            Buka Siaran Kamera
          </button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-select-${cam.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectCamera(cam);
            marker.closePopup();
          };
        }
      });

      marker.on("click", () => {
        onSelectCamera(cam);
      });

      marker.addTo(map);
      markersRef.current[cam.id] = marker;
    });
  }, [cameras, selectedCamera, onSelectCamera]);

  // Pan to selected camera
  useEffect(() => {
    if (selectedCamera && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(
        [selectedCamera.lat, selectedCamera.lng],
        15,
        { duration: 1.2 }
      );
    }
  }, [selectedCamera]);

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
