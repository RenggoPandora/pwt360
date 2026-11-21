"use client";

interface HeroWelcomeProps {
  onExploreClick: () => void;
  totalCameras: number;
}

export default function HeroWelcome({
  onExploreClick,
  totalCameras,
}: HeroWelcomeProps) {
  return (
    <section className="relative min-h-[92vh] sm:min-h-screen w-full flex flex-col justify-between items-center text-center px-4 sm:px-6 py-8 sm:py-12 overflow-hidden select-none">
      {/* Ambient Claymorphism Soft Background Elements */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
        {/* Soft Radial Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] sm:w-[900px] sm:h-[900px] rounded-full opacity-40 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(107, 92, 231, 0.28) 0%, rgba(206, 223, 255, 0.3) 50%, transparent 75%)",
          }}
        />

        {/* Floating Pastel Blobs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#D2DEFB] opacity-60 blur-2xl animate-cloud" />
        <div className="absolute top-1/3 -right-24 w-96 h-96 rounded-full bg-[#FFE7B3] opacity-45 blur-2xl" />
        <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-[#FFD3E2] opacity-40 blur-2xl" />

        {/* Subtle Decorative Road / Grid SVG Motif in Background */}
        <svg
          className="w-full h-full object-cover opacity-15"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 450C250 420 500 550 850 480C1200 410 1350 560 1600 500"
            stroke="#6B5CE7"
            strokeWidth="48"
            strokeLinecap="round"
          />
          <path
            d="M300 -100C350 250 550 500 650 1000"
            stroke="#ffffff"
            strokeWidth="36"
            strokeLinecap="round"
          />
          <path
            d="M1000 -100C920 300 1150 650 1100 1000"
            stroke="#ffffff"
            strokeWidth="32"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Top Bar Branding */}
      <div className="flex items-center gap-3 pt-2">
        <div className="w-11 h-11 rounded-[16px] bg-[#6B5CE7] flex items-center justify-center text-white shadow-md shadow-[#6B5CE7]/30">
          <svg
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <span className="text-xl sm:text-2xl font-bold font-heading text-[#2A2950] tracking-tight">
          PWT360
        </span>
      </div>

      {/* Main Centered Content */}
      <div className="max-w-3xl flex flex-col items-center justify-center gap-6 my-auto py-8">
        {/* Status Pill Badge */}
        <div className="clay-pill px-5 py-2 flex items-center gap-2.5 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C62A5B] animate-pulse" />
          <span className="text-xs sm:text-sm font-bold font-heading text-[#2A2950]">
            Siaran Langsung Publik &bull; {totalCameras} Titik Kamera
          </span>
        </div>

        {/* Short & Clean Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-heading text-[#2A2950] tracking-tight leading-[1.12]">
          Jelajahi Purwokerto,{" "}
          <span className="text-[#6B5CE7]">Dari Setiap Sudut.</span>
        </h1>

        {/* Concise Sub-headline */}
        <p className="text-base sm:text-lg md:text-xl font-bold text-[#565A85] max-w-2xl leading-relaxed">
          Satu layar untuk memantau arus jalan, suasana ruang kota, dan prakiraan cuaca secara langsung.
        </p>

        {/* Primary Call to Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3.5">
          <button
            type="button"
            onClick={onExploreClick}
            className="clay-chip px-8 sm:px-10 h-14 bg-[#6B5CE7] hover:bg-[#5b4cdb] text-white font-bold font-heading text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-[#6B5CE7]/35 cursor-pointer transition-all duration-200 active:scale-95"
          >
            <span>Mulai Memantau Kota</span>
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <polyline points="19 12 12 19 5 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Cue */}
      <div
        role="button"
        tabIndex={0}
        onClick={onExploreClick}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onExploreClick();
        }}
        className="flex flex-col items-center gap-1 text-[#565A85] hover:text-[#6B5CE7] cursor-pointer transition pb-2 group"
      >
        <span className="text-xs font-bold font-heading tracking-wide">
          Gulir ke Bawah
        </span>
        <div className="w-8 h-8 rounded-full clay-pill flex items-center justify-center group-hover:translate-y-1 transition-transform">
          <svg
            className="w-4 h-4 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </section>
  );
}
