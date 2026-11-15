// ===== 0. Tandai bahwa JavaScript aktif =====
// CSS memakai class "js" ini supaya tanpa JavaScript website tetap berfungsi penuh.
document.documentElement.classList.add('js');


// ===== 1. Menu hamburger (bonus 3 poin) =====
const tombolMenu = document.querySelector('.hamburger');
const menu = document.querySelector('#menu-utama');

if (tombolMenu && menu) {
  tombolMenu.addEventListener('click', function () {
    // classList.toggle: tambah class "buka" kalau belum ada, hapus kalau sudah ada
    const terbuka = menu.classList.toggle('buka');
    tombolMenu.setAttribute('aria-expanded', terbuka);
    tombolMenu.textContent = terbuka ? '✕' : '☰';
  });
}


// ===== 2. Validasi formulir kontak (bonus 3 poin) =====
const form = document.querySelector('.form-kontak form');

if (form) {
  const pesanSukses = document.querySelector('#pesan-sukses');
  const semuaKolom = form.querySelectorAll('input, select, textarea');

  // Matikan balon pesan bawaan browser, kita tampilkan pesan sendiri di bawah kolom
  form.noValidate = true;

  // Pilih teks kesalahan sesuai jenis masalahnya
  function ambilPesanError(kolom) {
    if (kolom.validity.valueMissing) return 'Kolom ini wajib diisi.';
    if (kolom.validity.typeMismatch) return 'Format email tidak valid.';
    if (kolom.validity.patternMismatch) return 'Nomor HP harus 10 sampai 13 digit angka.';
    if (kolom.minLength > 0 && kolom.value.length < kolom.minLength) {
      return 'Pesan minimal ' + kolom.minLength + ' karakter.';
    }
    return '';
  }

  // Tampilkan atau hapus pesan di bawah kolom. Hasilnya true kalau kolom valid.
  function periksaKolom(kolom) {
    let tempatPesan = document.getElementById('error-' + kolom.id);

    if (!tempatPesan) {
      tempatPesan = document.createElement('small');
      tempatPesan.id = 'error-' + kolom.id;
      tempatPesan.className = 'error';
      kolom.insertAdjacentElement('afterend', tempatPesan);
      kolom.setAttribute('aria-describedby', tempatPesan.id);
    }

    const teks = ambilPesanError(kolom);
    tempatPesan.textContent = teks;
    kolom.classList.toggle('tidak-valid', teks !== '');
    return teks === '';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // cegah halaman dimuat ulang

    let semuaValid = true;
    semuaKolom.forEach(function (kolom) {
      if (!periksaKolom(kolom)) {
        semuaValid = false;
      }
    });

    if (semuaValid) {
      if (pesanSukses) {
        pesanSukses.textContent = 'Terima kasih! Formulirmu sudah valid dan pesan berhasil dikirim.';
        pesanSukses.hidden = false;
      }
      form.reset();
    } else {
      if (pesanSukses) pesanSukses.hidden = true;
      form.querySelector('.tidak-valid').focus();
    }
  });

  // Saat pengguna memperbaiki isian, pesan kesalahan ikut diperbarui
  semuaKolom.forEach(function (kolom) {
    kolom.addEventListener('input', function () {
      if (kolom.classList.contains('tidak-valid')) {
        periksaKolom(kolom);
      }
    });
  });
}


// ===== 3. Filter dan pencarian katalog (bonus 4 poin) =====
// Data proyek berupa array objek. Kalau katalog diubah, ubah di sini juga.
const daftarProyek = [
  {
    nama: 'Jadwal Kuliah',
    kategori: 'Web',
    deskripsi: 'Jadwal kuliah mingguan dalam bentuk tabel yang mudah dibaca.',
    gambar: 'img/jadwal.jpeg',
    alt: 'Tangkapan layar website jadwal kuliah'
  },
  {
    nama: 'Kalkulator Sederhana',
    kategori: 'Utilitas',
    deskripsi: 'Kalkulator sederhana dengan tampilan yang rapi dan menarik.',
    gambar: 'img/kalkulator.jpeg',
    alt: 'Tangkapan layar kalkulator sederhana'
  },
  {
    nama: 'Profil Biodata',
    kategori: 'Web',
    deskripsi: 'Halaman biodata sederhana yang berisi profil diri.',
    gambar: 'img/profil.jpeg',
    alt: 'Tangkapan layar halaman profil biodata'
  },
  {
    nama: 'Web RSUD',
    kategori: 'Web',
    deskripsi: 'Website rumah sakit umum daerah yang dibuat sebagai latihan saat mengikuti bootcamp.',
    gambar: 'img/rsud.jpeg',
    alt: 'Tangkapan layar website RSUD'
  },
  {
    nama: 'TaskMate',
    kategori: 'Produktivitas',
    deskripsi: 'Web pencatat jadwal tugas yang menandai tugas selesai dan belum selesai, dengan pengingat deadline.',
    gambar: 'img/taskmate.jpeg',
    alt: 'Tangkapan layar website pencatat tugas TaskMate'
  },
  {
    nama: 'Ulang Tahun',
    kategori: 'Web',
    deskripsi: 'Halaman ulang tahun dengan tema berbeda sesuai tanggal lahir dan zodiak.',
    gambar: 'img/ultah.jpeg',
    alt: 'Tangkapan layar halaman ulang tahun bertema'
  }
];

const wadah = document.querySelector('#daftar-proyek');
const pilihKategori = document.querySelector('#filter-kategori');
const cariNama = document.querySelector('#cari-nama');

if (wadah && pilihKategori && cariNama) {
  // Buat satu kartu (elemen HTML) dari satu objek proyek
  function buatKartu(proyek) {
    const kartu = document.createElement('article');
    kartu.className = 'kartu-proyek';

    const gambar = document.createElement('img');
    gambar.src = proyek.gambar;
    gambar.alt = proyek.alt;

    const isi = document.createElement('div');
    isi.className = 'isi';

    const kategori = document.createElement('p');
    kategori.className = 'kategori';
    kategori.textContent = proyek.kategori;

    const judul = document.createElement('h3');
    judul.textContent = proyek.nama;

    const deskripsi = document.createElement('p');
    deskripsi.textContent = proyek.deskripsi;

    isi.append(kategori, judul, deskripsi);
    kartu.append(gambar, isi);
    return kartu;
  }

  // Saring data sesuai kategori dan kata pencarian, lalu tampilkan ke halaman
  function tampilkanProyek() {
    const kategoriDipilih = pilihKategori.value;
    const kataCari = cariNama.value.trim().toLowerCase();

    const hasil = daftarProyek.filter(function (proyek) {
      const cocokKategori = kategoriDipilih === 'semua' || proyek.kategori === kategoriDipilih;
      const cocokNama = proyek.nama.toLowerCase().includes(kataCari);
      return cocokKategori && cocokNama;
    });

    wadah.innerHTML = '';

    if (hasil.length === 0) {
      const kosong = document.createElement('p');
      kosong.className = 'kosong';
      kosong.textContent = 'Proyek tidak ditemukan.';
      wadah.append(kosong);
      return;
    }

    hasil.forEach(function (proyek) {
      wadah.append(buatKartu(proyek));
    });
  }

  // Isi pilihan kategori otomatis dari data (tanpa duplikat)
  const kategoriUnik = [...new Set(daftarProyek.map(function (p) { return p.kategori; }))];
  kategoriUnik.forEach(function (nama) {
    const opsi = document.createElement('option');
    opsi.value = nama;
    opsi.textContent = nama;
    pilihKategori.append(opsi);
  });

  pilihKategori.addEventListener('change', tampilkanProyek);
  cariNama.addEventListener('input', tampilkanProyek);

  tampilkanProyek();
}