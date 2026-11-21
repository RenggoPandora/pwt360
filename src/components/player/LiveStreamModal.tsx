"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { DashboardCamera } from "@/types/camera";

interface LiveStreamModalProps {
  camera: DashboardCamera | null;
  onClose: () => void;
}

export default function LiveStreamModal({
  camera,
  onClose,
}: LiveStreamModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!camera) return;
    setIsLoading(true);
    setHasError(false);

    if (camera.streamType === "youtube") {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video || !camera.streamUrl) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        lowLatencyMode: true,
        maxBufferLength: 8,
        backBufferLength: 0,
      });

      hls.loadSource(camera.streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        video.muted = true;
        video.play().catch(() => {});
      });

      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls?.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls?.recoverMediaError();
              break;
            default:
              hls?.destroy();
              setHasError(true);
              setIsLoading(false);
              break;
          }
        }
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = camera.streamUrl;
      video.addEventListener("loadedmetadata", () => {
        setIsLoading(false);
        video.play().catch(() => {});
      });
      video.addEventListener("error", () => {
        setHasError(true);
        setIsLoading(false);
      });
    }

    return () => {
      if (hls) hls.destroy();
    };
  }, [camera]);

  if (!camera) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2A2950]/50 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="clay-panel w-full max-w-3xl p-6 sm:p-8 bg-[#F3F5FF] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E0E5F5]">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-full bg-[#6B5CE7] text-white font-bold font-heading flex items-center justify-center text-sm shadow-sm">
              {camera.number}
            </span>
            <div>
              <h3 className="text-lg font-bold text-[#2A2950] font-heading">
                {camera.name}
              </h3>
              <p className="text-xs font-bold text-[#565A85]">
                {camera.categoryLabel} &bull; Kondisi:{" "}
                <span className="text-[#2A2950]">{camera.condition}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-full clay-pill flex items-center justify-center text-[#565A85] hover:text-[#2A2950] transition cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Video Player Box */}
        <div className="clay-inset relative aspect-video w-full rounded-[24px] overflow-hidden bg-slate-950 flex items-center justify-center">
          {camera.streamType === "youtube" && camera.youtubeVideoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${camera.youtubeVideoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`}
              title={camera.name}
              className="w-full h-full border-0"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : hasError ? (
            <div className="text-center p-6 text-white">
              <p className="text-sm font-bold text-amber-400 mb-1">
                Koneksi siaran sementara padat
              </p>
              <p className="text-xs text-slate-400 max-w-sm mb-4">
                Server live stream publik sedang memperbarui segmen video.
              </p>
              <button
                type="button"
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                  if (videoRef.current) videoRef.current.load();
                }}
                className="px-4 py-2 rounded-xl bg-[#6B5CE7] text-white text-xs font-bold"
              >
                Muat Ulang
              </button>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                autoPlay
                muted
                controls
                className="w-full h-full object-contain"
              />
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/70 flex flex-col items-center justify-center gap-2 text-white text-xs">
                  <div className="w-8 h-8 rounded-full border-3 border-white border-t-transparent animate-spin" />
                  <span>Menghubungkan Siaran Langsung...</span>
                </div>
              )}
            </>
          )}

          {/* Top-Left Live badge */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C62A5B] text-white text-xs font-bold shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>LIVE</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-2 flex items-center justify-between text-xs text-[#565A85]">
          <span>Format: {camera.streamType.toUpperCase()} Live Feed</span>
          <span className="font-bold text-[#2A2950]">Purwokerto &bull; Jawa Tengah</span>
        </div>
      </div>
    </div>
  );
}
