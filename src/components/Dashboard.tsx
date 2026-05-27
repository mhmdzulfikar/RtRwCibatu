import { motion } from 'motion/react';
import { Home, FileText, Wallet, Megaphone, Users, Shield, ArrowRight, Star, HeartHandshake } from 'lucide-react';
import { Announcement } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  announcements: Announcement[];
  totalBalance: number;
}

export default function Dashboard({ onNavigate, announcements, totalBalance }: DashboardProps) {
  // Get pinned or latest announcements
  const featuredAnnouncements = announcements
    .filter(a => a.isPinned)
    .concat(announcements.filter(a => !a.isPinned))
    .slice(0, 3);

  const stats = [
    { label: 'Kepala Keluarga', value: '450+', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Warga', value: '1.600+', icon: Home, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Keamanan Lingkungan', value: '24/7 Aktif', icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Layanan Digital', value: '98% Efisien', icon: FileText, color: 'text-primary', bg: 'bg-primary-light' },
  ];

  const quickLinks = [
    {
      title: 'Ajukan Surat Domisili',
      description: 'Isi formulir pengantar surat domisili secara online, tunggu persetujuan RT, cetak langsung dari rumah.',
      tab: 'surat',
      icon: FileText,
      badge: 'Proses Cepat',
      color: 'border-red-100 hover:border-red-300 bg-white'
    },
    {
      title: 'Cek & Bayar Iuran',
      description: 'Transparansi laporan kas warga, cek status iuran bulanan rumah Anda, dan unggah bukti pembayaran.',
      tab: 'keuangan',
      icon: Wallet,
      badge: 'Transparan',
      color: 'border-amber-100 hover:border-amber-300 bg-white'
    },
    {
      title: 'Pengumuman Terbaru',
      description: 'Lihat agenda kerja bakti, posyandu bulanan, atau maklumat penting pengurus RT 005 lainnya.',
      tab: 'pengumuman',
      icon: Megaphone,
      badge: 'Agenda Warga',
      color: 'border-blue-100 hover:border-blue-300 bg-white'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-blue-600/95 via-indigo-600/90 to-blue-700/95 text-white shadow-2xl shadow-indigo-200/50 border border-white/20">
        <div className="absolute top-0 right-0 -m-10 h-72 w-72 rounded-full bg-blue-400/20 blur-2xl" />
        <div className="absolute bottom-0 left-0 -m-10 h-72 w-72 rounded-full bg-teal-400/20 blur-2xl" />
        
        <div className="relative px-6 py-12 md:p-16 lg:px-20 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold uppercase tracking-wider text-blue-100">
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> RT 005 / RW 02 • Jatibening Baru
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Lingkungan Modern <br className="hidden md:inline" />Dimulai dari Warga Terhubung.
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-xl leading-relaxed">
              Selamat datang di Portal Digital RT 005. Di sini Anda dapat mengurus surat pengantar domisili, memantau laporan keuangan kas iuran secara transparan, serta mengakses pengumuman resmi dari kenyamanan rumah Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button 
                onClick={() => onNavigate('surat')}
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-white text-blue-600 hover:bg-slate-50 rounded-full font-bold shadow-md transition-all active:scale-95 text-sm cursor-pointer"
              >
                Ajukan Surat <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => onNavigate('keuangan')}
                className="inline-flex justify-center items-center gap-2 px-6 py-3.5 bg-indigo-950/30 text-white hover:bg-indigo-950/55 border border-white/20 rounded-full font-bold transition-all active:scale-95 text-sm cursor-pointer"
              >
                Lihat Laporan Kas
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 p-6 space-y-4">
              <h3 className="font-bold text-lg text-white">Ikhtisar Cepat</h3>
              
              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 border border-white/5">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <Megaphone className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-blue-200 font-medium font-mono">PENGUMUMAN PINNED</p>
                  <p className="text-sm text-white font-bold truncate">
                    {announcements.find(a => a.isPinned)?.title || 'Tidak ada pengumuman disematkan'}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 border border-white/5">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 font-medium font-mono">TOTAL KAS RT 005</p>
                  <p className="text-sm text-white font-extrabold text-lg">
                    Rp {totalBalance.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="bg-white/10 rounded-xl p-4 flex items-center gap-4 border border-white/5">
                <div className="p-2.5 rounded-lg bg-white/20 text-white">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-blue-200 font-medium font-mono">STATUS PROSES SURAT</p>
                  <p className="text-sm text-white font-bold">
                    Layanan Mandiri 24 Jam
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel glass-panel-hover p-5 rounded-2xl flex flex-col justify-between"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-semibold text-slate-500 max-w-[100px] leading-tight">{stat.label}</span>
                <div className={`p-2 rounded-xl bg-white/50 border border-white/80 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{stat.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="space-y-6">
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Layanan Warga Mandiri</h2>
          <p className="text-slate-500 mt-1">Kemudahan mengurus segala administrasi dalam satu klik</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickLinks.map((link) => (
            <button
              key={link.title}
              onClick={() => onNavigate(link.tab)}
              className="flex flex-col text-left p-6 rounded-[2rem] glass-panel glass-panel-hover cursor-pointer group"
            >
              <div className="flex justify-between items-start w-full">
                <div className="p-3 rounded-xl bg-blue-100/50 text-blue-600 border border-white group-hover:scale-110 transition-transform">
                  <link.icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100/50 px-2.5 py-1 rounded-full border border-white">{link.badge}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mt-6 group-hover:text-blue-600 transition-colors">{link.title}</h3>
              <p className="text-sm text-slate-500 mt-2 flex-grow leading-relaxed">{link.description}</p>
              <span className="inline-flex items-center gap-1.5 text-blue-600 text-xs font-bold mt-4">
                Buka Layanan <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Split section for announcements summary and info RT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4">
        {/* Latest Pinned/Important Announcements */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-800">Pengumuman Terkini</h2>
            <button 
              onClick={() => onNavigate('pengumuman')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {featuredAnnouncements.map((ann) => (
              <div 
                key={ann.id} 
                onClick={() => onNavigate('pengumuman')}
                className="glass-panel glass-panel-hover p-5 rounded-2xl cursor-pointer flex flex-col sm:flex-row gap-4 items-start"
              >
                {ann.imageUrl ? (
                  <div className="h-32 w-full sm:h-24 sm:w-32 shrink-0 overflow-hidden rounded-xl border border-white/60 bg-slate-100">
                    <img
                      src={ann.imageUrl}
                      alt={ann.imageAlt || ann.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-xl hidden md:block border border-white ${
                    ann.category === 'Darurat' ? 'bg-red-100/50 text-red-600' :
                    ann.category === 'Kegiatan' ? 'bg-blue-100/50 text-blue-600' :
                    ann.category === 'Keamanan' ? 'bg-emerald-100/50 text-emerald-600' :
                    'bg-slate-100/50 text-slate-600'
                  }`}>
                    <Megaphone className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md border border-white/30 ${
                      ann.category === 'Darurat' ? 'bg-red-100/50 text-red-800' :
                      ann.category === 'Kegiatan' ? 'bg-blue-100/50 text-blue-800' :
                      ann.category === 'Keamanan' ? 'bg-emerald-100/50 text-emerald-800' :
                      'bg-slate-100/55 text-slate-800'
                    }`}>
                      {ann.category}
                    </span>
                    {ann.isPinned && (
                      <span className="text-[10px] text-amber-800 bg-amber-100/60 border border-white/30 px-2 py-0.5 rounded-md font-bold">
                        Penting/Sematkan
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono font-medium ml-auto">{ann.date}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 hover:text-blue-600 transition-colors block text-sm sm:text-base leading-snug">
                    {ann.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                    {ann.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Structural Info Box & FAQ */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xl font-extrabold text-slate-800">Kepengurusan RT 005</h2>
          
          <div className="glass-panel p-6 rounded-[2rem] space-y-6">
            {/* Header of management board */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/40">
              <div className="p-2.5 bg-blue-100/50 text-blue-600 border border-white rounded-xl">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Rukun Tetangga 005</h4>
                <p className="text-xs text-slate-500">Masa Bakti Kepengurusan 2024 - 2029</p>
              </div>
            </div>

            {/* List of personnel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Ketua RT</p>
                  <p className="font-bold text-slate-800 text-sm">Bp. Hendra Kurniawan</p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100/50 border border-white/40 px-2.5 py-1 rounded-full font-bold">Aktif</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Sekretaris RT</p>
                  <p className="font-bold text-slate-800 text-sm">Bp. Tarman Sugandi</p>
                </div>
                <span className="text-xs text-slate-500 bg-white/50 border border-white/40 px-2.5 py-1 rounded-full font-medium">Aktif</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Bendahara RT</p>
                  <p className="font-bold text-slate-800 text-sm">Ibu Susan Natalia</p>
                </div>
                <span className="text-xs text-slate-500 bg-white/50 border border-white/40 px-2.5 py-1 rounded-full font-medium">Aktif</span>
              </div>
            </div>

            {/* Address callout */}
            <div className="p-4 bg-white/25 rounded-xl space-y-1 border border-white/30">
              <p className="text-xs font-extrabold text-slate-400 uppercase font-mono">Sekretariat Utama</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kavling Melati Indah Blok A/01, Jalan Melati Raya, RT 005 / RW 02, Kelurahan Jatibening Baru, Kecamatan Pondok Gede, Kota Bekasi, Jawa Barat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
