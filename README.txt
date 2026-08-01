STRUKTUR FILE TikaStudio

koleksi.html
- Hanya berisi struktur dan tampilan halaman.
- Tidak menyimpan daftar produk secara hard-code.

koleksi.json
- Menyimpan teks halaman, kategori, opsi pengurutan, semua produk,
  harga, gambar, tag, skor urutan, tautan, dan bottom navigation.

koleksi.js
- Mengambil koleksi.json dengan fetch().
- Merender kategori, pengurutan, produk, harga, favorit, pencarian,
  empty state, dan bottom navigation.

PENTING
JSON yang dibaca dengan fetch() umumnya tidak berjalan bila koleksi.html
dibuka langsung melalui file://.

Jalankan melalui local server, misalnya:

1. Buka terminal di folder ini.
2. Jalankan:
   python -m http.server 8000
3. Buka:
   http://localhost:8000/koleksi.html

Pastikan index.html berada di folder yang sama supaya tombol Beranda bekerja.
