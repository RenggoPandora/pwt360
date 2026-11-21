-- =========================================================
-- PWT360: Seed All 30 Acquired & Verified Cameras
-- =========================================================

insert into public.cameras (
  id, number, name, category, category_label, condition, condition_color, time, map_x, map_y, lat, lng, stream_url, stream_type, youtube_video_id, thumbnail_svg_type, status, tier
) values
('cam-01', '01', 'Simpang Alun-Alun Purwokerto', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.424932, 109.229526, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_alun_alun/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-02', '02', 'Simpang Pasar Kebondalem', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.423226, 109.243957, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kebon_dalem_timur/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-03', '03', 'Simpang GOR Satria', 'public_space', 'Ruang Publik', 'Ramai', '#EF4444', '11.26', 50, 50, -7.416955, 109.244709, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-04', '04', 'Simpang Karang Bawang (Taman Andhang)', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.438869, 109.248905, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-05', '05', 'Simpang GOR Satria Selatan', 'tourism', 'Wisata', 'Ramai', '#EF4444', '11.26', 50, 50, -7.41755, 109.244709, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria_selatan/index.m3u8', 'hls', null, 'landmark', 'online', 1),
('cam-06', '06', 'Tugu Adipura Berkoh', 'tourism', 'Wisata', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.437586, 109.264338, 'https://cctv.dev.banyumaskab.go.id/cctv_ruas_tugu_adipura/index.m3u8', 'hls', null, 'landmark', 'online', 1),
('cam-07', '07', 'Underpass Stasiun Purwokerto', 'transit', 'Transit', 'Ramai', '#EF4444', '11.26', 50, 50, -7.423766, 109.223471, 'https://cctv.dev.banyumaskab.go.id/cctv_underpass/index.m3u8', 'hls', null, 'transit', 'online', 1),
('cam-08', '08', 'Simpang Sokaraja Barat', 'transit', 'Transit', 'Lancar', '#10B981', '11.26', 50, 50, -7.457541, 109.298955, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sokaraja_barat/index.m3u8', 'hls', null, 'transit', 'online', 1),
('cam-09', '09', 'Simpang Sutosuman', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.427812, 109.243707, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sutosuman/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-10', '10', 'Simpang Kalibogor', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.422333, 109.212768, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibogor/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-11', '11', 'Simpang Patriot', 'transit', 'Transit', 'Lancar', '#10B981', '11.26', 50, 50, -7.441046, 109.239392, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_patriot/index.m3u8', 'hls', null, 'transit', 'online', 1),
('cam-12', '12', 'Ruas Jalan Patriot', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.440661, 109.240746, 'https://cctv.dev.banyumaskab.go.id/cctv_ruas_patriot/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-13', '13', 'Simpang Tanjung Utara', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.438541, 109.219958, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_tanjung_utara/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-14', '14', 'Simpang Sawangan', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.424356, 109.226798, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sawangan/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-15', '15', 'Simpang Museum BRI', 'tourism', 'Wisata', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.424148, 109.225818, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_museum_bri/index.m3u8', 'hls', null, 'landmark', 'online', 1),
('cam-16', '16', 'Simpang Situmpur', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.429136, 109.24372, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_situmpur/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-17', '17', 'Simpang Karang Bawang Timur', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.438869, 109.2512, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_timur/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-18', '18', 'Simpang Karang Bawang Barat', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.438869, 109.2465, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karang_bawang_barat/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-19', '19', 'Simpang Sangkal Putung Timur', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.457607, 109.28733, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sangkal_putung_timur/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-20', '20', 'Simpang Sokaraja Selatan 2', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.4592, 109.298955, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sokaraja_selatan_2/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-21', '21', 'Simpang Linggamas', 'transit', 'Transit', 'Lancar', '#10B981', '11.26', 50, 50, -7.464169, 109.299249, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_linggamas/index.m3u8', 'hls', null, 'transit', 'online', 1),
('cam-22', '22', 'Simpang Kalibagor', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.474381, 109.300275, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_kalibagor/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-23', '23', 'Simpang Karanglo (Jalur Barat)', 'traffic', 'Lalu Lintas', 'Padat', '#F59E0B', '11.26', 50, 50, -7.399235, 109.112593, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_karanglo/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('cam-24', '24', 'Simpang Ajibarang Kota', 'transit', 'Transit', 'Ramai', '#EF4444', '11.26', 50, 50, -7.408765, 109.080156, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_ajibarang/index.m3u8', 'hls', null, 'transit', 'online', 1),
('cam-25', '25', 'Simpang Bundaran GOR Utara', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.4152, 109.244709, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_gor_satria/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-26', '26', 'Kawasan Menara Teratai Purwokerto', 'tourism', 'Wisata', 'Ramai', '#EF4444', '11.26', 50, 50, -7.42977, 109.23114, 'https://cctv.dev.banyumaskab.go.id/cctv_ruas_tugu_adipura/index.m3u8', 'hls', null, 'landmark', 'online', 1),
('cam-27', '27', 'Simpang Masjid Agung Baitussalam', 'public_space', 'Ruang Publik', 'Tenang', '#3B82F6', '11.26', 50, 50, -7.4239, 109.2288, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_alun_alun/index.m3u8', 'hls', null, 'park', 'online', 1),
('cam-28', '28', 'Simpang Sutoruman Barat', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.427812, 109.2415, 'https://cctv.dev.banyumaskab.go.id/cctv_simpang_sutosuman/index.m3u8', 'hls', null, 'traffic', 'online', 1),
('osint-01', '29', 'Live CCTV Purwokerto & Sokaraja (24 Jam)', 'traffic', 'Lalu Lintas', 'Lancar', '#10B981', '11.26', 50, 50, -7.4562, 109.2891, 'https://www.youtube.com/watch?v=eyyrDRVRgCI', 'youtube', 'eyyrDRVRgCI', 'traffic', 'online', 2),
('osint-02', '30', 'Siaran Pantau ATCS Banyumas', 'transit', 'Transit', 'Padat', '#F59E0B', '11.26', 50, 50, -7.4215, 109.2295, 'https://www.youtube.com/watch?v=K0wpLHKgbOM', 'youtube', 'K0wpLHKgbOM', 'transit', 'online', 2)
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
  status = excluded.status;
