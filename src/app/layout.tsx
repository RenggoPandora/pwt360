import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PWT360 — CCTV publik, peta & cuaca dalam satu layar",
  description:
    "Pantau kota, langsung dari layar. Lihat posisi kamera di peta, cek cuaca sekitar, lalu pilih kategori untuk membuka siaran langsungnya.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${fredoka.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#E9EDFB] text-[#2A2950] font-sans">
        {children}
      </body>
    </html>
  );
}
