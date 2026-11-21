"use client";

import { DynamicWeather, WeatherConditionType } from "@/lib/weather";

interface WeatherCardProps {
  weather: DynamicWeather;
  isSplit?: boolean;
  isLoading?: boolean;
}

export default function WeatherCard({
  weather,
  isSplit = false,
  isLoading = false,
}: WeatherCardProps) {
  const { conditionType, rainChance } = weather;
  const isSunny = conditionType === "sunny";
  const isRainy = conditionType === "rainy";
  const isThunderstorm = conditionType === "thunderstorm";
  const isCloudy = conditionType === "cloudy";

  // Hero tile background color based on weather
  const heroBg = isSunny
    ? "bg-[#FFE7B3]"
    : isCloudy
    ? "bg-[#E2EAF8]"
    : isThunderstorm
    ? "bg-[#C6D6F8]"
    : "bg-[#D2DEFB]";

  // Weather Icon Component
  const renderWeatherIcon = (size: "compact" | "full") => {
    const iconSize = size === "compact" ? "w-10 h-10" : "w-20 h-20";

    if (isSunny) {
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${size === "compact" ? "w-10 h-10" : "w-24 h-24"}`}>
          {/* Rotating Sun Rays */}
          <svg
            className={`text-[#F59E0B] animate-sun-spin ${iconSize}`}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            {/* Sun Core */}
            <circle cx="32" cy="32" r="14" fill="#FFA500" />
            <circle cx="32" cy="32" r="11" fill="#FFC107" />
            {/* 8 Radiating Beams */}
            <line x1="32" y1="6" x2="32" y2="13" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="32" y1="51" x2="32" y2="58" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="6" y1="32" x2="13" y2="32" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="51" y1="32" x2="58" y2="32" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="14" y1="14" x2="19" y2="19" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="45" y1="45" x2="50" y2="50" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="14" y1="50" x2="19" y2="45" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
            <line x1="45" y1="19" x2="50" y2="14" stroke="#F59E0B" strokeWidth="3.6" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    if (isCloudy) {
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${size === "compact" ? "w-10 h-10" : "w-24 h-24"}`}>
          <svg
            className={`text-[#8C9FCF] animate-cloud ${iconSize}`}
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 40C13.58 40 10 36.42 10 32C10 27.86 13.14 24.46 17.18 24.04C18.66 16.98 24.94 12 32.5 12C41.06 12 48 18.94 48 27.5C52.42 27.5 56 31.08 56 35.5C56 39.92 52.42 43.5 48 43.5H18"
              fill="#FFFFFF"
            />
          </svg>
        </div>
      );
    }

    if (isThunderstorm) {
      return (
        <div className={`relative flex items-center justify-center shrink-0 ${size === "compact" ? "w-10 h-10" : "w-24 h-24"}`}>
          <svg className={iconSize} viewBox="0 0 64 64" fill="none" aria-hidden="true">
            <path
              d="M18 38C13.58 38 10 34.42 10 30C10 25.86 13.14 22.46 17.18 22.04C18.66 14.98 24.94 10 32.5 10C41.06 10 48 16.94 48 25.5C52.42 25.5 56 29.08 56 33.5C56 37.92 52.42 41.5 48 41.5H18"
              fill="#D6E0F8"
            />
            {/* Lightning Bolt */}
            <polygon points="34,36 26,48 33,48 29,58 42,44 35,44" fill="#F59E0B" />
            {/* Raindrops */}
            <line x1="18" y1="46" x2="16" y2="52" stroke="#4C78DD" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="48" y1="46" x2="46" y2="52" stroke="#4C78DD" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </div>
      );
    }

    // Default: Rainy
    return (
      <div className={`relative flex items-center justify-center shrink-0 ${size === "compact" ? "w-10 h-10" : "w-24 h-24"}`}>
        <svg className={`text-[#6B7CC5] ${iconSize}`} viewBox="0 0 64 64" fill="none" aria-hidden="true">
          <path
            d="M18 42C13.58 42 10 38.42 10 34C10 29.86 13.14 26.46 17.18 26.04C18.66 18.98 24.94 14 32.5 14C41.06 14 48 20.94 48 29.5C52.42 29.5 56 33.08 56 37.5C56 41.92 52.42 45.5 48 45.5H18"
            fill="#FFFFFF"
          />
          <line x1="24" y1="48" x2="24" y2="55" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
          <line x1="33" y1="48" x2="33" y2="55" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
          <line x1="42" y1="48" x2="42" y2="55" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  };

  // Compact Mode when CCTV is open
  if (isSplit) {
    return (
      <div
        className={`clay-panel p-4 sm:p-5 flex flex-col gap-3 w-full bg-[#F3F5FF] transition-all duration-300 animate-in fade-in zoom-in-95 ${
          isLoading ? "opacity-75" : ""
        }`}
      >
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-[#2A2950] font-heading shrink-0">
              Cuaca Sekarang
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9EDFB] text-[#565A85] truncate max-w-[140px]">
              {weather.cityName || "Pusat Kota"}
            </span>
          </div>
          <span className="text-xs font-bold text-[#2A2950] font-heading shrink-0">
            {weather.temperature}°C &bull; {isSunny ? "Terik" : isRainy ? "Hujan" : "Berawan"}
          </span>
        </div>

        {/* Compact Hero Tile */}
        <div className={`clay-inset p-3 rounded-[20px] flex items-center justify-between transition-colors duration-300 ${heroBg}`}>
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl font-bold text-[#2A2950] font-heading leading-none">
              {weather.temperature}°
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-[#2A2950]">
                {weather.conditionText}
              </p>
              <p className="text-[10px] font-bold text-[#565A85]">
                {isSunny
                  ? "Sinar matahari terik cerah"
                  : isRainy
                  ? `Peluang hujan ${rainChance}% • Bawa payung`
                  : isThunderstorm
                  ? "Waspada kilat petir & genangan"
                  : "Kondisi berawan sejuk"}
              </p>
            </div>
          </div>

          {renderWeatherIcon("compact")}
        </div>

        {/* Compact 3 Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">Lembap</span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">
              {weather.humidity}%
            </span>
          </div>

          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">Angin</span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">
              {weather.windSpeed} km/j
            </span>
          </div>

          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">
              {isSunny ? "Indeks UV" : "Hujan"}
            </span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">
              {isSunny ? "Tinggi" : `${weather.rainChance}%`}
            </span>
          </div>
        </div>

        {/* Compact Hourly Forecast */}
        <div className="pt-1 border-t border-[#E0E5F5]/60 flex items-center justify-between text-center px-1">
          {weather.hourly.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold text-[#565A85]">{item.time}</span>
              <div className="w-5 h-5 flex items-center justify-center">
                {item.type === "sunny" ? (
                  <svg className="w-4 h-4 text-[#F59E0B]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" fill="#F59E0B" />
                    <line x1="12" y1="2" x2="12" y2="4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="20" x2="12" y2="22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="12" x2="4" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="12" x2="22" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : item.rain ? (
                  <svg className="w-4 h-4 text-[#7F91D8]" viewBox="0 0 24 24" fill="none">
                    <path d="M17.5 14a3.5 3.5 0 0 0-2.45-5.95 5.5 5.5 0 0 0-10.1 2.05A4 4 0 0 0 5 18h12.5" fill="#C8D4F5" />
                    <path d="M8 19v3M12 19v3M16 19v3" stroke="#4C78DD" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-[#7F91D8]" viewBox="0 0 24 24" fill="none">
                    <path d="M17.5 15a3.5 3.5 0 0 0-2.45-5.95 5.5 5.5 0 0 0-10.1 2.05A4 4 0 0 0 5 19h12.5" fill="#C8D4F5" />
                  </svg>
                )}
              </div>
              <span className="text-[10px] font-bold text-[#2A2950] font-heading">{item.temp}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Full-size Mode when no CCTV is open (Initial Default)
  return (
    <div
      className={`clay-panel p-7 sm:p-8 flex flex-col gap-6 w-full lg:w-[380px] xl:w-[420px] shrink-0 transition-all duration-300 ${
        isLoading ? "opacity-75" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2A2950] font-heading">
          Cuaca Sekarang
        </h2>
        <span className="text-xs font-bold text-[#565A85] tracking-wide max-w-[160px] truncate">
          {weather.cityName || "Pusat Kota"}
        </span>
      </div>

      {/* Hero Weather Tile */}
      <div className={`clay-inset rounded-[26px] p-6 flex items-center justify-between transition-colors duration-300 ${heroBg}`}>
        <div>
          <div className="text-6xl sm:text-7xl font-bold text-[#2A2950] tracking-tight leading-none mb-1.5 font-heading">
            {weather.temperature}°
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#2A2950] max-w-[130px] leading-snug">
            {weather.conditionText}
          </p>
        </div>

        {renderWeatherIcon("full")}
      </div>

      {/* Weather Context Banner (Adapted to Sunny / Rainy) */}
      {isSunny ? (
        <div className="bg-[#FFE8B8] rounded-[20px] p-3.5 flex items-center gap-3 border border-[#FFD580]/60 shadow-xs">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#B87000] shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#2A2950] leading-snug">
            Sinar matahari terik cerah. Jalanan kering, jarak pandang optimal.
          </p>
        </div>
      ) : isRainy || isThunderstorm ? (
        <div className="bg-[#FFD3E2] rounded-[20px] p-3.5 flex items-center gap-3 border border-[#FFBFD5]/50 shadow-xs">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#B8185A] shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M22 12a10.06 10.06 0 0 0-20 0Z" />
              <path d="M12 12v8a2 2 0 0 0 4 0" />
              <path d="M12 2v1" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#2A2950] leading-snug">
            {isThunderstorm
              ? "Waspada hujan disertai kilat petir & genangan di jalan."
              : `Potensi hujan tinggi (${weather.rainChance}%). Bawa payung & waspadai genangan.`}
          </p>
        </div>
      ) : (
        <div className="bg-[#E6EEFB] rounded-[20px] p-3.5 flex items-center gap-3 border border-[#C8DCF8]/60 shadow-xs">
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[#4A64A8] shrink-0">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
            </svg>
          </div>
          <p className="text-xs font-bold text-[#2A2950] leading-snug">
            Langit berawan sejuk. Suhu nyaman untuk beraktivitas luar ruangan.
          </p>
        </div>
      )}

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">Lembap</span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">
            {weather.humidity}%
          </span>
        </div>

        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">Angin</span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">
            {weather.windSpeed} km/j
          </span>
        </div>

        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">
            {isSunny ? "Indeks UV" : "Hujan"}
          </span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">
            {isSunny ? "Tinggi" : `${weather.rainChance}%`}
          </span>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div>
        <h4 className="text-xs font-bold text-[#565A85] mb-2.5">Perkiraan per jam</h4>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {weather.hourly.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85]">{item.time}</span>
              <div className="w-7 h-7 flex items-center justify-center">
                {item.type === "sunny" ? (
                  <svg className="w-5 h-5 text-[#F59E0B]" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="5" fill="#F59E0B" />
                    <line x1="12" y1="2" x2="12" y2="4" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="12" y1="20" x2="12" y2="22" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="2" y1="12" x2="4" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                    <line x1="20" y1="12" x2="22" y2="12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : item.rain ? (
                  <svg className="w-5 h-5 text-[#7F91D8]" viewBox="0 0 24 24" fill="none">
                    <path d="M17.5 14a3.5 3.5 0 0 0-2.45-5.95 5.5 5.5 0 0 0-10.1 2.05A4 4 0 0 0 5 18h12.5" fill="#C8D4F5" />
                    <path d="M8 19v3M12 19v3M16 19v3" stroke="#4C78DD" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-[#7F91D8]" viewBox="0 0 24 24" fill="none">
                    <path d="M17.5 15a3.5 3.5 0 0 0-2.45-5.95 5.5 5.5 0 0 0-10.1 2.05A4 4 0 0 0 5 19h12.5" fill="#C8D4F5" />
                  </svg>
                )}
              </div>
              <span className="text-xs font-bold text-[#2A2950] font-heading">{item.temp}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
