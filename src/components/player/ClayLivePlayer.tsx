"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { DashboardCamera } from "@/types/camera";

interface ClayLivePlayerProps {
  camera: DashboardCamera;
  onClose?: () => void;
}

export default function ClayLivePlayer({
  camera,
  onClose,
}: ClayLivePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);

  // Category pin colors
  const pinBg =
    camera.category === "traffic"
      ? "#B84A08"
      : camera.category === "public_space"
      ? "#1B7F46"
      : camera.category === "tourism"
      ? "#B8185A"
      : "#2A64C8";

  useEffect(() => {
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

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div className="clay-panel p-5 sm:p-6 flex flex-col gap-3.5 w-full bg-[#F3F5FF] animate-in fade-in zoom-in-95 duration-200">
      {/* Player Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            style={{ backgroundColor: pinBg }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold font-heading text-xs border-2 border-white shadow-sm shrink-0"
          >
            {camera.number}
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-[#2A2950] font-heading truncate leading-tight">
              {camera.name}
            </h3>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#565A85]">
              <span>{camera.categoryLabel}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <span
                  style={{ backgroundColor: camera.conditionColor }}
                  className="w-1.5 h-1.5 rounded-full"
                />
                <span className="text-[#2A2950]">{camera.condition}</span>
              </span>
            </div>
          </div>
        </div>

        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full clay-pill flex items-center justify-center text-[#565A85] hover:text-[#2A2950] transition shrink-0 cursor-pointer"
            title="Tutup Pemutar"
          >
            <svg
              className="w-3.5 h-3.5"
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
        )}
      </div>

      {/* Video Viewport with Inset Clay Frame */}
      <div className="clay-inset relative aspect-video w-full rounded-[22px] overflow-hidden bg-slate-950 flex items-center justify-center">
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
          <div className="text-center p-4 text-white">
            <p className="text-xs font-bold text-amber-400 mb-1">
              Feed Sedang Memperbarui
            </p>
            <p className="text-[11px] text-slate-400 mb-2.5">
              Koneksi publik server sumber sedang padat.
            </p>
            <button
              type="button"
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) videoRef.current.load();
              }}
              className="px-3 py-1 rounded-xl bg-[#6B5CE7] text-white text-[11px] font-bold"
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
              muted={isMuted}
              controls
              className="w-full h-full object-contain"
            />
            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/75 flex flex-col items-center justify-center gap-1.5 text-white text-xs">
                <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
                <span className="text-[11px] font-bold">Memuat Siaran...</span>
              </div>
            )}
          </>
        )}

        {/* Top-Left LIVE Badge */}
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C62A5B] text-white text-[10px] font-bold shadow-md pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span>LIVE</span>
        </div>

        {/* Top-Right Audio Mute Toggle for HLS */}
        {camera.streamType === "hls" && !hasError && (
          <button
            type="button"
            onClick={toggleMute}
            className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white transition text-xs"
            title={isMuted ? "Aktifkan Suara" : "Matikan Suara"}
          >
            {isMuted ? (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="1" y1="1" x2="23" y2="23" />
                <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
                <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0a7 7 0 0 1-.11 1.23" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
              </svg>
            ) : (
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Sub-bar: Format and Location */}
      <div className="flex items-center justify-between text-[11px] font-bold text-[#565A85]">
        <span>Live CCTV Purwokerto</span>
        <span className="text-[#2A2950] font-heading">{camera.time} WIB</span>
      </div>
    </div>
  );
}
