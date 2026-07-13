import { Announcement, FinancialTransaction, CitizenDues, LetterRequest, DuesPaymentRequest } from './types';

type AnnouncementPhoto = Required<Pick<Announcement, 'imageUrl' | 'imageAlt'>>;

const ANNOUNCEMENT_PHOTOS: Record<string, AnnouncementPhoto> = {
  'ann-1': {
    imageUrl: 'https://images.pexels.com/photos/36713461/pexels-photo-36713461.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&fit=crop',
    imageAlt: 'Warga bekerja sama membersihkan area lingkungan saat kerja bakti'
  },
  'ann-3': {
    imageUrl: 'https://images.pexels.com/photos/3997722/pexels-photo-3997722.jpeg?auto=compress&cs=tinysrgb&w=1200&h=760&fit=crop',
    imageAlt: 'Anak menerima imunisasi dalam kegiatan kesehatan warga'
  }
};

const findAnnouncementPhoto = (announcement: Announcement): AnnouncementPhoto | null => {
  const directPhoto = ANNOUNCEMENT_PHOTOS[announcement.id];
  if (directPhoto) return directPhoto;
  if (announcement.category !== 'Kegiatan') return null;

  const normalizedTitle = announcement.title.toLowerCase();
  if (normalizedTitle.includes('posyandu') || normalizedTitle.includes('imunisasi')) {
    return ANNOUNCEMENT_PHOTOS['ann-3'];
  }
  if (normalizedTitle.includes('kerja bakti') || normalizedTitle.includes('bersih')) {
    return ANNOUNCEMENT_PHOTOS['ann-1'];
  }

  return null;
};

export const hydrateAnnouncementPhotos = (announcements: Announcement[]): Announcement[] => {
  return announcements.map((announcement) => {
    if (announcement.imageUrl) {
      return {
        ...announcement,
        imageAlt: announcement.imageAlt || `${announcement.title} - dokumentasi kegiatan RT 005`
      };
    }

    const photo = findAnnouncementPhoto(announcement);
    return photo ? { ...announcement, ...photo } : announcement;
  });
};

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Kerja Bakti Akbar Menyambut Musim Hujan',
    content: 'Dihimbau kepada seluruh bapak-bapak dan pemuda RT 005 untuk hadir dalam kegiatan Kerja Bakti membersihkan saluran air (selokan) utama guna mengantisipasi banjir di musim hujan. Mohon membawa peralatan kerja bakti masing-masing dari rumah (cangkul, sapu lidi, dll).\n\nKonsumsi dan kopi disediakan oleh pihak PKK RT 005.',
    date: '2026-05-28',
    category: 'Kegiatan',
    author: 'Ketua RT (Bp. Hendra)',
    isPinned: false,
    ...ANNOUNCEMENT_PHOTOS['ann-1']
  },
  {
    id: 'ann-2',
    title: 'Pembayaran Iuran Warga Kini Bisa Melalui Portal Digital',
    content: 'Dalam rangka mempermudah pendataan dan meningkatkan transparansi keuangan, pembayaran iuran warga bulanan RT 005 (sebesar Rp 100.000) kini dapat diajukan secara langsung melalui Portal Digital ini. \n\nSilakan masuk ke menu "Laporan Keuangan", cari nama kepala keluarga Anda pada kolom status iuran, lalu klik "Bayar Iuran" untuk mengunggah bukti transfer. Panitia keuangan RT akan memverifikasi pembayaran Anda maksimal 1x24 jam.',
    date: '2026-05-25',
    category: 'Iuran',
    author: 'Bendahara RT (Ibu Susan)',
    isPinned: true
  },
  {
    id: 'ann-3',
    title: 'Jadwal Imunisasi Bulanan Posyandu Anggrek 5',
    content: 'Diberitahukan kepada ibu-ibu yang memiliki balita di lingkungan RT 005, bahwa kegiatan rutin imunisasi dan penimbangan balita akan dilaksanakan di Sekretariat RT 005 pada Hari Kamis, 28 Mei 2026 mulai pukul 08:30 WIB s.d Selesai. Mohon membawa buku KIA/KMS masing-masing.',
    date: '2026-05-22',
    category: 'Kegiatan',
    author: 'PKK RT 005',
    isPinned: true,
    ...ANNOUNCEMENT_PHOTOS['ann-3']
  },
  {
    id: 'ann-4',
    title: 'Peningkatan Pengamanan Malam Menyikapi Laporan Kehilangan',
    content: 'Menyikapi adanya laporan kehilangan perlengkapan outdoor di salah satu rumah warga beberapa hari lalu, seksi keamanan RT 5 telah meningkatkan patroli malam. Dihimbau kepada seluruh warga untuk selalu mengunci pagar rumah setelah pukul 22:00 WIB dan melaporkan segera kepatuhan tamu asing yang menginap lebih dari 1x24 jam kepada pengurus RT.',
    date: '2026-05-20',
    category: 'Keamanan',
    author: 'Seksi Keamanan (Bp. Tarman)',
    isPinned: false
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    id: 'tx-1',
    description: 'Sisa Saldo Kas Bulan April 2026',
    amount: 12450000,
    type: 'masuk',
    date: '2026-05-01',
    category: 'Lainnya',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-2',
    description: 'Penerimaan Iuran Warga Mei 2026 - Kolektif Tahap 1',
    amount: 4500000,
    type: 'masuk',
    date: '2026-05-15',
    category: 'Iuran Bulanan',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-3',
    description: 'Honor petugas keamanan (Bp. Agus & Bp. Sugeng)',
    amount: 3000000,
    type: 'keluar',
    date: '2026-05-20',
    category: 'Keamanan & Kebersihan',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-4',
    description: 'Uang iuran pengangkutan truk sampah bulanan ke TPA',
    amount: 1200000,
    type: 'keluar',
    date: '2026-05-21',
    category: 'Keamanan & Kebersihan',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-5',
    description: 'Pembelian 2 unit Lampu Sorot LED Lapangan Olahraga RT',
    amount: 450000,
    type: 'keluar',
    date: '2026-05-23',
    category: 'Pembangunan',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-6',
    description: 'Donasi Bpk. Bambang Pamungkas untuk kas sosial RT',
    amount: 1000000,
    type: 'masuk',
    date: '2026-05-24',
    category: 'Donasi',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-7',
    description: 'Konsumsi takziah & bunga duka wafat alm. warga Blok B',
    amount: 500000,
    type: 'keluar',
    date: '2026-05-25',
    category: 'Sosial',
    recordedBy: 'Bendahara RT (Ibu Susan)',
    rt: '005',
    rw: '02'
  },
  {
    id: 'tx-8',
    description: 'Penerimaan Iuran Warga Mei 2026 RT 006',
    amount: 1800000,
    type: 'masuk',
    date: '2026-05-25',
    category: 'Iuran Bulanan',
    recordedBy: 'Bendahara RW (Ibu Susan)',
    rt: '006',
    rw: '02'
  }
];

export const INITIAL_CITIZENS_DUES: CitizenDues[] = [
  {
    id: 'cz-1',
    citizenName: 'Bambang Pamungkas',
    houseNumber: 'Blok A/01',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Lunas',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-2',
    citizenName: 'Siti Aminah',
    houseNumber: 'Blok A/02',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Belum',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-3',
    citizenName: 'Joko Widodo',
    houseNumber: 'Blok A/03',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Lunas',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-4',
    citizenName: 'Ahmad Fauzi',
    houseNumber: 'Blok B/01',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Lunas',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-5',
    citizenName: 'Diana Lestari',
    houseNumber: 'Blok B/02',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Belum',
        'Mei': 'Belum',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-6',
    citizenName: 'Budi Santoso',
    houseNumber: 'Blok C/01',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Lunas',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-7',
    citizenName: 'Rina Wijaya',
    houseNumber: 'Blok C/02',
    rt: '005',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Lunas',
        'April': 'Lunas',
        'Mei': 'Lunas',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  },
  {
    id: 'cz-8',
    citizenName: 'Eka Putri',
    houseNumber: 'Blok D/01',
    rt: '006',
    rw: '02',
    paymentHistory: {
      2026: {
        'Januari': 'Lunas',
        'Februari': 'Lunas',
        'Maret': 'Belum',
        'April': 'Belum',
        'Mei': 'Belum',
        'Juni': 'Belum',
        'Juli': 'Belum',
        'Agustus': 'Belum',
        'September': 'Belum',
        'Oktober': 'Belum',
        'November': 'Belum',
        'Desember': 'Belum'
      }
    }
  }
];

export const INITIAL_LETTER_REQUESTS: LetterRequest[] = [
  {
    id: 'req-1',
    applicantName: 'Bambang Pamungkas',
    nik: '3275012345670001',
    kk: '3275012345678901',
    birthPlace: 'Bekasi',
    birthDate: '1985-06-10',
    gender: 'Laki-laki',
    phone: '081234567890',
    religion: 'Islam',
    profession: 'Karyawan Swasta',
    address: 'Perumahan Harper, Jl. Melati Raya No. 1, RT 005 RW 02, Cibatu',
    purpose: 'Persyaratan KPR Bank / Kredit Perumahan Syariah',
    status: 'ready',
    dateRequested: '2026-05-24',
    referenceNo: '045/SRT-DOM/V/2026'
  },
  {
    id: 'req-2',
    applicantName: 'Siti Aminah',
    nik: '3275019876540002',
    kk: '3275012345558888',
    birthPlace: 'Jakarta',
    birthDate: '1990-12-15',
    gender: 'Perempuan',
    phone: '087788990011',
    religion: 'Islam',
    profession: 'Ibu Rumah Tangga',
    address: 'Perumahan Harper Blok B/02, RT 005 RW 02, Cibatu',
    purpose: 'Pengurusan pendaftaran BPJS Kesehatan Mandiri keluarga',
    status: 'processing',
    dateRequested: '2026-05-25'
  }
];

export const INITIAL_PAYMENT_REQUESTS: DuesPaymentRequest[] = [
  {
    id: 'pay-1',
    citizenName: 'Diana Lestari',
    houseNumber: 'Blok B/02',
    month: 'April',
    year: 2026,
    amount: 100000,
    paymentMethod: 'Transfer BCA',
    dateSubmitted: '2026-05-26',
    status: 'pending',
    rt: '005',
    rw: '02'
  },
  {
    id: 'pay-2',
    citizenName: 'Eka Putri',
    houseNumber: 'Blok D/01',
    month: 'Maret',
    year: 2026,
    amount: 100000,
    paymentMethod: 'Transfer BCA',
    dateSubmitted: '2026-05-27',
    status: 'pending',
    rt: '006',
    rw: '02'
  }
];
