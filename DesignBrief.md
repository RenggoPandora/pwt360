# PWT360 — Design Brief (Claymorphism Live CCTV Dashboard)

Nov 21, 2026

## 1. Ringkasan

PWT360 adalah website publik yang menampilkan CCTV live, peta lokasi kamera, dan cuaca dalam satu layar, dengan tema visual **Claymorphism**. Tugas agent: membangun halaman ini (desktop + mobile) sesuai desain referensi.

- **Pengguna:** warga dan wisatawan yang ingin cek kondisi lalu lintas, taman, tempat wisata, dan stasiun sebelum berangkat.
- **Tujuan utama:** pengguna langsung melihat *di mana* kamera berada (peta), lalu menyaring dan membuka siaran per kategori.
- **Referensi desain (interaktif):** [PWT360 — Claymorphism Live CCTV Dashboard](https://claude.ai/artifact/DeNZL5v3ABMdsoC6Y3Qsb3). Artboard `Desktop — Dashboard` dan `Mobile — Dashboard`.
- **Bahasa antarmuka:** Indonesia.

## 2. Struktur halaman (urutan wajib)

Urutan konten desktop **tidak boleh diubah**: peta adalah konten utama, filter berada di bawahnya.

1. **Hero** — logo PWT360 + tagline, pill `LIVE · N kamera`, pill tanggal/jam WIB, judul H1 "Pantau kota, langsung dari layar." dan satu kalimat pengantar.
2. **Main Content** — dua kolom. Kiri: **peta besar** (min. tinggi 640px, lebar fleksibel) dengan pin kamera. Kanan: **kartu cuaca** (lebar 360–460px).
3. **Filter + daftar CCTV** — judul "Kamera CCTV", baris chip kategori, lalu grid kartu kamera.
4. **Footer** — satu baris catatan.

Urutan mobile sama persis: Hero, peta, kartu cuaca, filter (chip bisa digeser horizontal), daftar kamera.

Kategori filter (teks harus persis seperti ini, urutan tetap):

1. Semua Kategori
2. Lalu Lintas & Simpang
3. Ruang Publik & Taman
4. Wisata & Landmark
5. Stasiun & Transit

## 3. Design tokens (Claymorphism)

Gaya clay = permukaan pastel *datar* (tanpa gradien) yang tampak empuk lewat bayangan ganda: bayangan luar gelap-lembut, sorotan luar putih, dan dua bayangan dalam. Semua sudut sangat membulat.

| Token | Nilai | Pemakaian |
| --- | --- | --- |
| Latar halaman | `#E9EDFB` | Background body |
| Permukaan | `#F3F5FF` | Kartu, pill, panel |
| Teks utama | `#2A2950` | Judul, isi |
| Teks sekunder | `#565A85` | Label, keterangan |
| Aksen utama | `#6B5CE7` | Logo, chip aktif, ring kartu terpilih |
| LIVE / siaran | `#C62A5B` | Badge LIVE (teks putih) |
| Lalu Lintas | tint `#FFD9B8`, pin `#B84A08` | Chip, pin, badge nomor |
| Ruang Publik | tint `#CDEFD6`, pin `#1B7F46` | Chip, pin, badge nomor |
| Wisata | tint `#FFD3E2`, pin `#B8185A` | Chip, pin, badge nomor |
| Transit | tint `#CFE3FF`, pin `#2A64C8` | Chip, pin, badge nomor |
| Font judul | Fredoka 500–700 | H1, H2, nama kamera, angka besar |
| Font isi | Nunito 600–800 | Semua teks lain |
| Radius | 22 (media), 32 (kartu), 40 (panel besar), 26 (chip) px | Selalu besar |

Resep bayangan (ganti nilai warna sesuai tint permukaan):

```css
/* Kartu / panel timbul */
box-shadow:
  14px 14px 28px rgba(108,118,184,0.30),
  -12px -12px 24px rgba(255,255,255,0.95),
  inset -8px -8px 16px rgba(108,118,184,0.12),
  inset 8px 8px 16px rgba(255,255,255,0.9);

/* Area tertekan (thumbnail kamera, peta, tile info) */
box-shadow:
  inset 6px 6px 12px rgba(60,66,130,0.30),
  inset -4px -4px 8px rgba(255,255,255,0.6);

/* Chip aktif */
box-shadow:
  inset 6px 6px 12px rgba(30,20,120,0.45),
  inset -4px -4px 10px rgba(255,255,255,0.25),
  6px 6px 14px rgba(107,92,231,0.35);
```

Larangan: tanpa gradien, tanpa glassmorphism/blur latar, tanpa emoji sebagai ikon (pakai SVG stroke 2.4px, `currentColor`).

## 4. Komponen dan perilaku

| Komponen | Spesifikasi | Perilaku |
| --- | --- | --- |
| Peta | Panel clay 40px, area peta tertekan, tinggi min. 640px. Overlay: judul "Peta Lokasi" + jumlah titik (kiri atas), kartu "Kamera dipilih" (kiri bawah), legenda 4 kategori (kanan bawah). | Menampilkan hanya pin kategori yang aktif. Basemap pada desain adalah ilustrasi; ganti dengan peta sungguhan bergaya pastel. |
| Pin kamera | Lingkaran 48px (58px bila dipilih), border putih 3px, warna kategori, nomor 01–08 putih. Pin terpilih: ring ungu 6px + label nama di bawahnya. | Klik pin = pilih kamera; kartu terkait di daftar ikut ber-ring ungu. |
| Chip filter | Tinggi 52px, radius 26px, ikon + label + badge jumlah. Aktif: ungu `#6B5CE7`, teks putih, bayangan tertekan. Tidak aktif: warna tint kategori. | Satu pilihan aktif. Mengubah filter menyaring **pin di peta dan kartu kamera sekaligus**. Atur `aria-pressed`. |
| Kartu kamera | Grid `auto-fill, minmax(260px, 1fr)`, gap 28px. Thumbnail 158px, badge LIVE kiri atas, jam kanan atas, badge nomor berwarna kategori, nama, kategori, status. | Klik = pilih kamera (ring ungu 4px, sinkron dengan peta). Pembukaan siaran/pemutar menunggu keputusan (lihat bagian 8). |
| Status kamera | Pill dengan titik berwarna + teks: Lancar, Padat, Ramai, Tenang. | Selalu teks + titik, tidak hanya warna. |
| Kartu cuaca | Panel clay 40px: tile hero (suhu 68px, kondisi, ikon), banner hujan (bersyarat), 3 tile info (Lembap, Angin, Hujan), perkiraan 5 jam. | Lihat bagian 5. |

## 5. Cuaca dan animasi hujan

Animasi hujan aktif ketika **peluang hujan ≥ 50%**. Di bawah itu, tampilan cerah tanpa animasi.

| Elemen | Kondisi hujan (≥ 50%) | Kondisi kering (< 50%) |
| --- | --- | --- |
| Tile hero cuaca | Latar `#D2DEFB`, suhu contoh 27°, "Mendung, potensi hujan", ikon awan dengan 3 tetes kecil melayang naik-turun | Latar `#FFE7B3`, suhu contoh 29°, "Cerah berawan", ikon matahari + awan |
| Banner | "Potensi hujan tinggi (N%). Bawa payung & waspadai genangan." (latar `#FFD3E2`, ikon payung) | Tidak tampil |
| Overlay di peta | 3 awan SVG (`#7F91D8`–`#8FA0E2`) bergeser horizontal 9 detik, bolak-balik; 36 tetes hujan jatuh 1,0–1,7 detik per putaran; lapisan biru tipis `rgba(70,90,170,0.14)` | Tidak ada |
| Perkiraan per jam | Ikon awan lalu hujan | Ikon matahari lalu awan |

Aturan teknis:

- Overlay hujan berada **di atas peta tetapi di bawah pin dan kartu overlay**, dengan `pointer-events: none`.
- Animasi hanya memakai `transform` dan `opacity` (CSS keyframes), agar ringan.
- Hormati `prefers-reduced-motion: reduce`: matikan semua animasi, tetesan tampil statis setengah transparan.
- Sumber nilai: peluang hujan dari API cuaca per lokasi. Pada desain, nilai diatur lewat slider `rainChance` (default 60).

## 6. Responsif dan versi mobile

Halaman fluid dengan lebar maksimum 1440px dan padding 40px (desktop), 18px (mobile). Tata letak memakai flex-wrap, bukan breakpoint kaku.

- **Main Content:** peta `flex: 999 1 640px`, cuaca `flex: 1 1 360px; max-width: 460px`. Di layar sempit cuaca turun di bawah peta.
- **Mobile (390px):** satu kolom. Peta tinggi 440px dengan pin 46–56px; kartu cuaca ringkas; chip filter satu baris yang bisa digeser horizontal; kartu kamera 2 kolom.
- **Target sentuh:** semua tombol, chip, dan pin minimal 44px.
- **Overlay peta di mobile:** hanya judul dan kartu "Kamera dipilih"; legenda disembunyikan agar tidak menutup peta.

## 7. Aksesibilitas dan prinsip UI/UX

- **Kontras:** teks 4.5:1 atau lebih. Teks putih hanya di atas warna pekat (`#6B5CE7`, `#C62A5B`, warna pin); teks pada tint pastel selalu `#2A2950`.
- **Jangan andalkan warna saja:** kategori punya ikon + label; status punya titik + teks; pin punya nomor yang cocok dengan badge di kartu.
- **Elemen interaktif asli:** `<button>` untuk chip, kartu, dan pin; `aria-pressed` pada filter dan kartu; `aria-label` berisi nama kamera + kategori pada pin; SVG dekoratif `aria-hidden`.
- **Hierarki:** satu H1, H2 per bagian (Peta, Cuaca, Kamera CCTV). Peta mendahului daftar karena lokasi adalah konteks utama.
- **Umpan balik seketika:** filter, pilihan kamera, dan pin saling sinkron tanpa muat ulang.
- **Gerak:** animasi hujan dekoratif, tidak membawa informasi unik (banner teks tetap ada) dan bisa dimatikan lewat reduced motion.
- **Bahasa:** `lang="id"`, format jam 24 jam dengan titik (11.26 WIB).

## 8. Data, integrasi, dan placeholder

Semua data pada desain adalah **contoh**. Agent perlu menggantinya dengan sumber nyata.

| Bagian di desain | Status | Yang dibutuhkan |
| --- | --- | --- |
| Daftar kamera (8 buah), nama, kategori, koordinat | Placeholder | Daftar kamera resmi: id, nama, kategori (4 nilai), lat/lng, URL siaran |
| Thumbnail kamera | Ilustrasi SVG | Snapshot atau stream asli per kamera |
| Status (Lancar/Padat/Ramai/Tenang) | Placeholder | Sumber status, atau hapus bila tidak tersedia |
| Basemap peta | Ilustrasi SVG | Penyedia peta + gaya pastel yang selaras tema |
| Cuaca (suhu, lembap, angin, peluang hujan, per jam) | Placeholder | API cuaca per koordinat; bagian 5 bergantung pada peluang hujan |
| Jam dan tanggal | Teks statis | Waktu nyata zona WIB |

Keputusan yang belum dibuat:

- [ ] Apa yang terjadi saat kartu kamera diklik: pemutar di modal, halaman detail, atau hanya memilih di peta?
- [ ] Penyedia peta dan cara menata pin.
- [ ] Kota/wilayah cakupan dan sumber CCTV yang boleh ditampilkan secara publik.
