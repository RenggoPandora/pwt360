"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Camera } from "@/types/camera";
import {
  AlertCircle,
  ExternalLink,
  Flag,
  Maximize2,
  Minimize2,
  RefreshCw,
  Volume2,
  VolumeX,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface StreamPlayerProps {
  camera: Camera;
  onReport?: (camera: Camera) => void;
}

export default function StreamPlayer({ camera, onReport }: StreamPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (camera.streamType === "youtube") {
      setIsLoading(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (camera.streamType === "hls" && camera.streamUrl) {
      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60,
        });

        hls.loadSource(camera.streamUrl);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          video.play().catch(() => {
            // Autoplay policy: needs muted
            video.muted = true;
            setIsMuted(true);
            video.play().catch(() => {});
          });
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
        // Native Safari HLS
        video.src = camera.streamUrl;
        video.addEventListener("loadedmetadata", () => {
          setIsLoading(false);
          video.play().catch(() => {});
        });
        video.addEventListener("error", () => {
          setHasError(true);
          setIsLoading(false);
        });
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [camera]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex flex-col group"
    >
      {/* Video Viewport */}
      <div className="relative aspect-video w-full bg-slate-950 flex items-center justify-center overflow-hidden">
        {camera.streamType === "youtube" && camera.youtubeVideoId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${camera.youtubeVideoId}?autoplay=1&mute=1&playsinline=1&modestbranding=1`}
            title={camera.name}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : hasError || camera.status === "standby" ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-300">
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-amber-400">
              <AlertCircle className="w-7 h-7" />
            </div>
            <h4 className="text-base font-semibold text-white mb-1">
              {camera.status === "standby" ? "Stream dalam Antrean / Standby" : "Feed Saat Ini Tidak Menjawab"}
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {camera.status === "standby"
                ? "Server sumber sedang menghemat bandwidth atau berada di luar jam operasional siaran."
                : "Koneksi stream publik mengalami hambatan jaringan dari server penyedia."}
            </p>
            <div className="flex items-center gap-2">
              <a
                href={camera.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 inline-flex items-center gap-1.5 transition"
              >
                Kunjungi Sumber Asli <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {onReport && (
                <button
                  type="button"
                  onClick={() => onReport(camera)}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-medium text-rose-300 border border-rose-500/20 inline-flex items-center gap-1.5 transition"
                >
                  <Flag className="w-3.5 h-3.5" /> Laporkan
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted={isMuted}
              className="w-full h-full object-contain"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            {isLoading && (
              <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
                <span className="text-xs font-medium tracking-wide">Menghubungkan Stream Publik...</span>
              </div>
            )}
          </>
        )}

        {/* Live overlay badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none z-20">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-600/90 text-white shadow-lg backdrop-blur-md">
            <Radio className="w-3 h-3 animate-pulse" /> LIVE
          </span>
          {camera.isOfficial ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-600/80 text-white backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5" /> Resmi
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-600/80 text-white backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" /> OSINT Public
            </span>
          )}
        </div>

        {/* Stream controls overlay */}
        {camera.streamType === "hls" && !hasError && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-white backdrop-blur-md transition"
              title="Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Camera details sub-bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-300">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm sm:text-base font-bold text-white truncate">{camera.name}</h3>
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                camera.status === "online" ? "bg-emerald-400 animate-ping" : "bg-amber-400"
              }`}
            />
          </div>
          <p className="text-xs text-slate-400 truncate">
            {camera.locationName} &bull; {camera.subdistrict || "Banyumas"} &bull; Sumber: {camera.sourceName}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={camera.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs inline-flex items-center gap-1 transition"
            title="Kunjungi Sumber Asli"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          {onReport && (
            <button
              type="button"
              onClick={() => onReport(camera)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs inline-flex items-center transition"
              title="Laporkan Kendala"
            >
              <Flag className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
