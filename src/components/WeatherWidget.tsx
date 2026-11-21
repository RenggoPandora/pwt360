"use client";

import { useEffect, useState } from "react";
import { CloudRain, Sun, Wind, Droplets, Clock } from "lucide-react";

export default function WeatherWidget() {
  const [currentTime, setCurrentTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Jakarta",
        }) + " WIB"
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="clay-card-flat p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-gradient-to-r from-blue-50/50 via-white to-purple-50/50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-amber-100 border border-amber-200/60 flex items-center justify-center text-amber-600">
          <Sun className="w-5 h-5 animate-spin-slow" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-800">Purwokerto</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              29°C &bull; Berawan Cerah
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Kondisi Jalanan Kering &bull; Angin 11 km/j</p>
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-600">
        <div className="flex items-center gap-1.5 font-medium">
          <Droplets className="w-3.5 h-3.5 text-blue-500" />
          <span>Kelembapan 74%</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono font-semibold text-slate-700 bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          <span>{currentTime || "11:15:00 WIB"}</span>
        </div>
      </div>
    </div>
  );
}
