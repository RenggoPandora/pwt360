const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");
const path = require("path");

// Load .env.local if present
const envPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey || supabaseUrl.includes("your-supabase-url")) {
  console.log("\x1b[33m[Supabase Seed] Notice: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not configured in .env.local.\x1b[0m");
  console.log("Please create a Supabase project and set credentials in .env.local to run automated seeding, OR copy & paste supabase/seed.sql into Supabase SQL Editor.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const camerasToSeed = [
  { id: "cam-01", number: "01", name: "Simpang Alun-Alun Purwokerto", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 34, map_y: 29, lat: -7.424932, lng: 109.229526, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_alun_alun/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-02", number: "02", name: "Simpang Pasar Kebondalem", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 48, map_y: 34, lat: -7.423226, lng: 109.243957, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_kebon_dalem_timur/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-03", number: "03", name: "Simpang GOR Satria", category: "public_space", category_label: "Ruang Publik", condition: "Ramai", condition_color: "#EF4444", time: "11.26", map_x: 25, map_y: 32, lat: -7.416955, lng: 109.244709, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-04", number: "04", name: "Simpang Karang Bawang (Taman Andhang)", category: "public_space", category_label: "Ruang Publik", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 15, map_y: 25, lat: -7.438869, lng: 109.248905, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-05", number: "05", name: "Simpang GOR Satria Selatan", category: "tourism", category_label: "Wisata", condition: "Ramai", condition_color: "#EF4444", time: "11.26", map_x: 58, map_y: 23, lat: -7.417550, lng: 109.244709, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria_selatan/index.m3u8", stream_type: "hls", thumbnail_svg_type: "landmark", status: "online", tier: 1 },
  { id: "cam-06", number: "06", name: "Tugu Adipura Berkoh", category: "tourism", category_label: "Wisata", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 39, map_y: 22, lat: -7.437586, lng: 109.264338, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_ruas_tugu_adipura/index.m3u8", stream_type: "hls", thumbnail_svg_type: "landmark", status: "online", tier: 1 },
  { id: "cam-07", number: "07", name: "Underpass Stasiun Purwokerto", category: "transit", category_label: "Transit", condition: "Ramai", condition_color: "#EF4444", time: "11.26", map_x: 53, map_y: 41, lat: -7.423766, lng: 109.223471, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_underpass/index.m3u8", stream_type: "hls", thumbnail_svg_type: "transit", status: "online", tier: 1 },
  { id: "cam-08", number: "08", name: "Simpang Sokaraja Barat", category: "transit", category_label: "Transit", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 19, map_y: 40, lat: -7.457541, lng: 109.298955, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sokaraja_barat/index.m3u8", stream_type: "hls", thumbnail_svg_type: "transit", status: "online", tier: 1 },
  { id: "cam-09", number: "09", name: "Simpang Sutosuman", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.427812, lng: 109.243707, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sutosuman/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-10", number: "10", name: "Simpang Kalibogor", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.422333, lng: 109.212768, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibogor/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-11", number: "11", name: "Simpang Patriot", category: "transit", category_label: "Transit", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.441046, lng: 109.239392, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_patriot/index.m3u8", stream_type: "hls", thumbnail_svg_type: "transit", status: "online", tier: 1 },
  { id: "cam-12", number: "12", name: "Ruas Jalan Patriot", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.440661, lng: 109.240746, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_ruas_patriot/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-13", number: "13", name: "Simpang Tanjung Utara", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.438541, lng: 109.219958, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_tanjung_utara/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-14", number: "14", name: "Simpang Sawangan", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.424356, lng: 109.226798, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sawangan/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-15", number: "15", name: "Simpang Museum BRI", category: "tourism", category_label: "Wisata", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 50, map_y: 50, lat: -7.424148, lng: 109.225818, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_museum_bri/index.m3u8", stream_type: "hls", thumbnail_svg_type: "landmark", status: "online", tier: 1 },
  { id: "cam-16", number: "16", name: "Simpang Situmpur", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.429136, lng: 109.243720, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_situmpur/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-17", number: "17", name: "Simpang Karang Bawang Timur", category: "public_space", category_label: "Ruang Publik", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 50, map_y: 50, lat: -7.438869, lng: 109.251200, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_timur/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-18", number: "18", name: "Simpang Karang Bawang Barat", category: "public_space", category_label: "Ruang Publik", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 50, map_y: 50, lat: -7.438869, lng: 109.246500, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_barat/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-19", number: "19", name: "Simpang Sangkal Putung Timur", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.457607, lng: 109.287330, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sangkal_putung_timur/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-20", number: "20", name: "Simpang Sokaraja Selatan 2", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.459200, lng: 109.298955, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sokaraja_selatan_2/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-21", number: "21", name: "Simpang Linggamas", category: "transit", category_label: "Transit", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.464169, lng: 109.299249, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_linggamas/index.m3u8", stream_type: "hls", thumbnail_svg_type: "transit", status: "online", tier: 1 },
  { id: "cam-22", number: "22", name: "Simpang Kalibagor", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.474381, lng: 109.300275, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibagor/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-23", number: "23", name: "Simpang Karanglo (Jalur Barat)", category: "traffic", category_label: "Lalu Lintas", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.399235, lng: 109.112593, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_karanglo/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "cam-24", number: "24", name: "Simpang Ajibarang Kota", category: "transit", category_label: "Transit", condition: "Ramai", condition_color: "#EF4444", time: "11.26", map_x: 50, map_y: 50, lat: -7.408765, lng: 109.080156, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_ajibarang/index.m3u8", stream_type: "hls", thumbnail_svg_type: "transit", status: "online", tier: 1 },
  { id: "cam-25", number: "25", name: "Simpang Bundaran GOR Utara", category: "public_space", category_label: "Ruang Publik", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 50, map_y: 50, lat: -7.415200, lng: 109.244709, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-26", number: "26", name: "Kawasan Menara Teratai Purwokerto", category: "tourism", category_label: "Wisata", condition: "Ramai", condition_color: "#EF4444", time: "11.26", map_x: 50, map_y: 50, lat: -7.429770, lng: 109.231140, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_ruas_tugu_adipura/index.m3u8", stream_type: "hls", thumbnail_svg_type: "landmark", status: "online", tier: 1 },
  { id: "cam-27", number: "27", name: "Simpang Masjid Agung Baitussalam", category: "public_space", category_label: "Ruang Publik", condition: "Tenang", condition_color: "#3B82F6", time: "11.26", map_x: 50, map_y: 50, lat: -7.423900, lng: 109.228800, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_alun_alun/index.m3u8", stream_type: "hls", thumbnail_svg_type: "park", status: "online", tier: 1 },
  { id: "cam-28", number: "28", name: "Simpang Sutoruman Barat", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.427812, lng: 109.241500, stream_url: "https://cctv.dev.banyumaskab.go.id/cctv_simpang_sutosuman/index.m3u8", stream_type: "hls", thumbnail_svg_type: "traffic", status: "online", tier: 1 },
  { id: "osint-01", number: "29", name: "Live CCTV Purwokerto & Sokaraja (24 Jam)", category: "traffic", category_label: "Lalu Lintas", condition: "Lancar", condition_color: "#10B981", time: "11.26", map_x: 50, map_y: 50, lat: -7.456200, lng: 109.289100, stream_url: "https://www.youtube.com/watch?v=eyyrDRVRgCI", stream_type: "youtube", youtube_video_id: "eyyrDRVRgCI", thumbnail_svg_type: "traffic", status: "online", tier: 2 },
  { id: "osint-02", number: "30", name: "Siaran Pantau ATCS Banyumas", category: "transit", category_label: "Transit", condition: "Padat", condition_color: "#F59E0B", time: "11.26", map_x: 50, map_y: 50, lat: -7.421500, lng: 109.229500, stream_url: "https://www.youtube.com/watch?v=K0wpLHKgbOM", stream_type: "youtube", youtube_video_id: "K0wpLHKgbOM", thumbnail_svg_type: "transit", status: "online", tier: 2 }
];

async function runSeed() {
  console.log(`[Supabase Seed] Upserting ${camerasToSeed.length} cameras to ${supabaseUrl}...`);
  const { data, error } = await supabase.from("cameras").upsert(camerasToSeed, { onConflict: "id" });

  if (error) {
    console.error("\x1b[31m[Supabase Seed] Error:\x1b[0m", error.message);
    process.exit(1);
  }

  console.log("\x1b[32m[Supabase Seed] Successfully seeded all 30 cameras into Supabase!\x1b[0m");
}

runSeed();
