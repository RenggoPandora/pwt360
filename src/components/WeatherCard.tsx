"use client";

interface WeatherCardProps {
  rainChance?: number;
  isSplit?: boolean;
}

export default function WeatherCard({
  rainChance = 60,
  isSplit = false,
}: WeatherCardProps) {
  const isRaining = rainChance >= 50;

  // Compact Mode when CCTV is open
  if (isSplit) {
    return (
      <div className="clay-panel p-4 sm:p-5 flex flex-col gap-3 w-full bg-[#F3F5FF] transition-all duration-300 animate-in fade-in zoom-in-95">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-[#2A2950] font-heading">
              Cuaca Sekarang
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E9EDFB] text-[#565A85]">
              Pusat Kota
            </span>
          </div>
          <span className="text-xs font-bold text-[#2A2950] font-heading">
            27°C &bull; Mendung
          </span>
        </div>

        {/* Compact Hero Tile */}
        <div
          className={`clay-inset p-3 rounded-[20px] flex items-center justify-between ${
            isRaining ? "bg-[#D2DEFB]" : "bg-[#FFE7B3]"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl font-bold text-[#2A2950] font-heading leading-none">
              27°
            </div>
            <div className="leading-tight">
              <p className="text-xs font-bold text-[#2A2950]">
                {isRaining ? "Mendung, potensi hujan" : "Cerah berawan"}
              </p>
              <p className="text-[10px] font-bold text-[#565A85]">
                {isRaining ? "Peluang hujan 60% &bull; Bawa payung" : "Kondisi kering normal"}
              </p>
            </div>
          </div>

          <div className="w-10 h-10 flex items-center justify-center shrink-0">
            <svg
              className="w-9 h-9 text-[#6B7CC5]"
              viewBox="0 0 64 64"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M18 42C13.58 42 10 38.42 10 34C10 29.86 13.14 26.46 17.18 26.04C18.66 18.98 24.94 14 32.5 14C41.06 14 48 20.94 48 29.5C52.42 29.5 56 33.08 56 37.5C56 41.92 52.42 45.5 48 45.5H18"
                fill="#FFFFFF"
              />
              {isRaining && (
                <>
                  <line x1="24" y1="48" x2="24" y2="54" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
                  <line x1="33" y1="48" x2="33" y2="54" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
                  <line x1="42" y1="48" x2="42" y2="54" stroke="#4C78DD" strokeWidth="3" strokeLinecap="round" />
                </>
              )}
            </svg>
          </div>
        </div>

        {/* Compact 3 Metrics */}
        <div className="grid grid-cols-3 gap-2">
          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">Lembap</span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">78%</span>
          </div>

          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">Angin</span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">9 km/j</span>
          </div>

          <div className="clay-inset bg-[#E9EDFB] rounded-[16px] py-1.5 px-2 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] font-bold text-[#565A85]">Hujan</span>
            <span className="text-xs sm:text-sm font-bold text-[#2A2950] font-heading">{rainChance}%</span>
          </div>
        </div>

        {/* Compact Hourly Forecast */}
        <div className="pt-1 border-t border-[#E0E5F5]/60 flex items-center justify-between text-center px-1">
          {[
            { time: "12.00", temp: "28°", rain: false },
            { time: "13.00", temp: "28°", rain: false },
            { time: "14.00", temp: "27°", rain: true },
            { time: "15.00", temp: "26°", rain: true },
            { time: "16.00", temp: "26°", rain: true },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] font-bold text-[#565A85]">{item.time}</span>
              <div className="w-5 h-5 flex items-center justify-center">
                {item.rain ? (
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
    <div className="clay-panel p-7 sm:p-8 flex flex-col gap-6 w-full lg:w-[380px] xl:w-[420px] shrink-0 transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl sm:text-2xl font-bold text-[#2A2950] font-heading">
          Cuaca Sekarang
        </h2>
        <span className="text-xs font-bold text-[#565A85] tracking-wide">
          Pusat Kota
        </span>
      </div>

      {/* Hero Weather Tile */}
      <div
        className={`clay-inset rounded-[26px] p-6 flex items-center justify-between transition-colors duration-300 ${
          isRaining ? "bg-[#D2DEFB]" : "bg-[#FFE7B3]"
        }`}
      >
        <div>
          <div className="text-6xl sm:text-7xl font-bold text-[#2A2950] tracking-tight leading-none mb-1.5 font-heading">
            27°
          </div>
          <p className="text-xs sm:text-sm font-bold text-[#2A2950] max-w-[130px] leading-snug">
            {isRaining ? "Mendung, potensi hujan" : "Cerah berawan"}
          </p>
        </div>

        {/* Cloud with Rain Illustration */}
        <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
          <svg
            className="w-20 h-20 text-[#6B7CC5]"
            viewBox="0 0 64 64"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 42C13.58 42 10 38.42 10 34C10 29.86 13.14 26.46 17.18 26.04C18.66 18.98 24.94 14 32.5 14C41.06 14 48 20.94 48 29.5C52.42 29.5 56 33.08 56 37.5C56 41.92 52.42 45.5 48 45.5H18"
              fill="#FFFFFF"
            />
            {isRaining && (
              <>
                <line x1="24" y1="49" x2="24" y2="55" stroke="#4C78DD" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="33" y1="49" x2="33" y2="55" stroke="#4C78DD" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="42" y1="49" x2="42" y2="55" stroke="#4C78DD" strokeWidth="3.2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </div>
      </div>

      {/* Rain Alert Banner (Conditional) */}
      {isRaining && (
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
            Potensi hujan tinggi ({rainChance}%). Bawa payung &amp; waspadai genangan.
          </p>
        </div>
      )}

      {/* 3 Metric Tiles */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">Lembap</span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">78%</span>
        </div>

        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">Angin</span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">9 km/j</span>
        </div>

        <div className="clay-inset bg-[#E9EDFB] rounded-[20px] py-3 px-2 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85] mb-0.5">Hujan</span>
          <span className="text-sm sm:text-base font-bold text-[#2A2950] font-heading">{rainChance}%</span>
        </div>
      </div>

      {/* Hourly Forecast */}
      <div>
        <h4 className="text-xs font-bold text-[#565A85] mb-2.5">Perkiraan per jam</h4>
        <div className="grid grid-cols-5 gap-1.5 text-center">
          {[
            { time: "12.00", temp: "28°", rain: false },
            { time: "13.00", temp: "28°", rain: false },
            { time: "14.00", temp: "27°", rain: true },
            { time: "15.00", temp: "26°", rain: true },
            { time: "16.00", temp: "26°", rain: true },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-[10px] sm:text-[11px] font-bold text-[#565A85]">{item.time}</span>
              <div className="w-7 h-7 flex items-center justify-center">
                {item.rain ? (
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
