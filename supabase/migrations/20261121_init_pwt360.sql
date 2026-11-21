-- =========================================================
-- PWT360: Supabase PostgreSQL Schema & Seed Migration
-- =========================================================

-- 1. Create Cameras Table
create table if not exists public.cameras (
  id text primary key,
  number text not null,
  name text not null,
  category text not null check (category in ('traffic', 'public_space', 'tourism', 'transit')),
  category_label text not null,
  condition text not null check (condition in ('Lancar', 'Padat', 'Ramai', 'Tenang')),
  condition_color text not null,
  time text default '11.26',
  map_x numeric default 50,
  map_y numeric default 50,
  lat numeric not null,
  lng numeric not null,
  stream_url text not null,
  stream_type text not null default 'hls' check (stream_type in ('hls', 'youtube')),
  youtube_video_id text,
  source_name text default 'ATCS Dishub Banyumas',
  source_url text default 'https://atcs.banyumaskab.go.id/',
  thumbnail_svg_type text default 'traffic' check (thumbnail_svg_type in ('traffic', 'park', 'landmark', 'transit')),
  status text not null default 'online' check (status in ('online', 'standby', 'staging_review')),
  tier integer default 1 check (tier in (1, 2)),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Index for geographical queries and filtering
create index if not exists idx_cameras_category on public.cameras(category);
create index if not exists idx_cameras_status on public.cameras(status);
create index if not exists idx_cameras_coords on public.cameras(lat, lng);

-- 2. Create Camera Reports Table (Citizen issue & privacy reports)
create table if not exists public.camera_reports (
  id uuid primary key default gen_random_uuid(),
  camera_id text references public.cameras(id) on delete set null,
  reason text not null,
  note text,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at timestamptz default now()
);

-- 3. Row Level Security (RLS)
alter table public.cameras enable row level security;
alter table public.camera_reports enable row level security;

-- Public can read all published online/standby cameras
create policy "Allow public read access for cameras"
  on public.cameras for select
  using (status in ('online', 'standby'));

-- Authenticated users (admin) can do full CRUD on cameras
create policy "Allow authenticated admin full access to cameras"
  on public.cameras for all
  to authenticated
  using (true)
  with check (true);

-- Anyone can submit a camera issue report
create policy "Allow public insert for camera reports"
  on public.camera_reports for insert
  to anon, authenticated
  with check (true);

-- Authenticated users (admin) can view and manage reports
create policy "Allow authenticated view camera reports"
  on public.camera_reports for select
  to authenticated
  using (true);

-- 4. Seed Data: Verified Official Streams
-- =========================================================
-- PWT360: Seed Verified Official Streams (Pemkab & ATCS)
-- =========================================================

-- Clean up any legacy youtube records
delete from public.cameras where id like 'osint-%' or stream_type = 'youtube';

insert into public.cameras (
  id, number, name, category, category_label, condition, condition_color, time, map_x, map_y, lat, lng, stream_url, stream_type, youtube_video_id, thumbnail_svg_type, source_name, source_url, status, tier
) values
('cam-01', '01', 'Simpang Alun-Alun Purwokerto', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 34, 29, -7.424932, 109.229526, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_alun_alun/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-02', '02', 'Simpang Pasar Kebondalem', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 48, 34, -7.423226, 109.243957, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kebon_dalem_timur/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-03', '03', 'Simpang GOR Satria', 'public_space', 'Ruang Publik', 'Ramai', '#EF4444', '11.26', 25, 32, -7.416955, 109.244709, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria/index.m3u8', 'hls', null, 'park', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-04', '04', 'Simpang Karang Bawang (Taman Andhang)', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.25', 15, 25, -7.438869, 109.248905, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang/index.m3u8', 'hls', null, 'park', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-05', '05', 'Simpang GOR Satria Selatan', 'tourism', 'Wisata', 'Ramai', '#EF4444', '11.26', 58, 23, -7.41755, 109.244709, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria_selatan/index.m3u8', 'hls', null, 'landmark', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-06', '06', 'Tugu Adipura Berkoh', 'tourism', 'Wisata', 'Tenang', '#3B82F6', '11.26', 39, 22, -7.437586, 109.264338, 'https://cctv.dev.banyumaskab.go.id/cctv_ruas_tugu_adipura/index.m3u8', 'hls', null, 'landmark', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-07', '07', 'Underpass Stasiun Purwokerto', 'transit', 'Transit', 'Ramai', '#EF4444', '11.26', 53, 41, -7.423766, 109.223471, 'https://cctv.dev.banyumaskab.go.id/cctv_underpass/index.m3u8', 'hls', null, 'transit', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-08', '08', 'Simpang Sokaraja Barat', 'transit', 'Transit', 'Lancar', '#10B981', '11.25', 19, 40, -7.457541, 109.298955, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sokaraja_barat/index.m3u8', 'hls', null, 'transit', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-09', '09', 'Simpang Kalibogor', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.422333, 109.212768, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibogor/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-10', '10', 'Simpang Patriot', 'transit', 'Transit', 'Lancar', '#10B981', '11.26', 50, 50, -7.441046, 109.239392, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_simpang_patriot/index.m3u8', 'hls', null, 'transit', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-11', '11', 'Ruas Jalan Patriot', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.440661, 109.240746, 'https://cctv.dev.banyumaskab.go.id/cctv_ruas_patriot/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-12', '12', 'Simpang Tanjung Utara', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.438541, 109.219958, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_tanjung_utara/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-13', '13', 'Simpang Museum BRI', 'tourism', 'Wisata', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.424148, 109.225818, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_museum_bri/index.m3u8', 'hls', null, 'landmark', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-14', '14', 'Simpang Situmpur', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.429136, 109.24372, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_situmpur/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-15', '15', 'Simpang Karang Bawang Timur', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.438869, 109.2512, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_timur/index.m3u8', 'hls', null, 'park', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-16', '16', 'Simpang Karang Bawang Barat', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.438869, 109.2465, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_barat/index.m3u8', 'hls', null, 'park', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-17', '17', 'Simpang Linggamas', 'transit', 'Transit', 'Lancar', '#10B981', '11.26', 50, 50, -7.464169, 109.299249, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_linggamas/index.m3u8', 'hls', null, 'transit', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-18', '18', 'Simpang Kalibagor', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.474381, 109.300275, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibagor/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-19', '19', 'Simpang Karanglo (Jalur Barat)', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.399235, 109.112593, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karanglo/index.m3u8', 'hls', null, 'traffic', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1),
('cam-20', '20', 'Simpang Ajibarang Kota', 'transit', 'Transit', 'Ramai', '#EF4444', '11.26', 50, 50, -7.408765, 109.080156, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_ajibarang/index.m3u8', 'hls', null, 'transit', 'Pemkab & ATCS Banyumas', 'https://www.banyumaskab.go.id/cctv', 'online', 1)
on conflict (id) do update set
  number = excluded.number,
  name = excluded.name,
  category = excluded.category,
  category_label = excluded.category_label,
  condition = excluded.condition,
  condition_color = excluded.condition_color,
  lat = excluded.lat,
  lng = excluded.lng,
  stream_url = excluded.stream_url,
  stream_type = excluded.stream_type,
  youtube_video_id = excluded.youtube_video_id,
  thumbnail_svg_type = excluded.thumbnail_svg_type,
  source_name = excluded.source_name,
  source_url = excluded.source_url,
  status = excluded.status;
