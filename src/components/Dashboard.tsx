import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Home, FileText, Wallet, Megaphone, Users, Shield, ArrowRight, Star, HeartHandshake, Edit3, X, Save, Lock, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { Announcement } from '../types';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  announcements: Announcement[];
  totalBalance: number;
  isAdmin?: boolean;
  onResetWargaPassword?: (targetUsername: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  onCreateWargaAccount?: (displayName: string, username: string, password: string) => Promise<{ success: boolean; message?: string; error?: string }>;
}

export default function Dashboard({ onNavigate, announcements, totalBalance, isAdmin, onResetWargaPassword, onCreateWargaAccount }: DashboardProps) {
  // Pengurus RT State
  const [management, setManagement] = useState({
    ketua: 'Bp. Hendra Kurniawan',
    sekretaris: 'Bp. Tarman Sugandi',
    bendahara: 'Ibu Susan Natalia',
  });
  const [isEditingManagement, setIsEditingManagement] = useState(false);
  const [editForm, setEditForm] = useState(management);

  // Dashboard Stats State
  const [dashboardStats, setDashboardStats] = useState({
    kk: '450+',
    warga: '1.600+',
    keamanan: '24/7 Aktif',
    layanan: '98% Efisien',
  });
  const [isEditingStats, setIsEditingStats] = useState(false);
  const [editStatsForm, setEditStatsForm] = useState(dashboardStats);

  // Admin Reset Warga Password State
  const [targetUsername, setTargetUsername] = useState('');
  const [newWargaPassword, setNewWargaPassword] = useState('');
  const [showWargaPassword, setShowWargaPassword] = useState(false);
  const [resetWargaLoading, setResetWargaLoading] = useState(false);
  const [resetWargaMessage, setResetWargaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleResetWargaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onResetWargaPassword || !targetUsername || !newWargaPassword) return;

    setResetWargaLoading(true);
    setResetWargaMessage(null);
    try {
      const res = await onResetWargaPassword(targetUsername, newWargaPassword);
      if (res.success) {
        setResetWargaMessage({ type: 'success', text: `Password untuk ${targetUsername} berhasil direset!` });
        setTargetUsername('');
        setNewWargaPassword('');
      } else {
        setResetWargaMessage({ type: 'error', text: res.error || 'Gagal mereset password' });
      }
    } catch (error) {
      setResetWargaMessage({ type: 'error', text: 'Terjadi kesalahan' });
    } finally {
      setResetWargaLoading(false);
    }
  };

  // Admin Create Warga State
  const [createWargaDisplayName, setCreateWargaDisplayName] = useState('');
  const [createWargaUsername, setCreateWargaUsername] = useState('');
  const [createWargaPassword, setCreateWargaPassword] = useState('');
  const [showCreateWargaPassword, setShowCreateWargaPassword] = useState(false);
  const [createWargaLoading, setCreateWargaLoading] = useState(false);
  const [createWargaMessage, setCreateWargaMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleCreateWargaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCreateWargaAccount || !createWargaDisplayName || !createWargaUsername || !createWargaPassword) return;

    setCreateWargaLoading(true);
    setCreateWargaMessage(null);
    try {
      const res = await onCreateWargaAccount(createWargaDisplayName, createWargaUsername, createWargaPassword);
      if (res.success) {
        setCreateWargaMessage({ type: 'success', text: res.message || `Akun warga ${createWargaUsername} berhasil dibuat!` });
        setCreateWargaDisplayName('');
        setCreateWargaUsername('');
        setCreateWargaPassword('');
      } else {
        setCreateWargaMessage({ type: 'error', text: res.error || 'Gagal membuat akun warga' });
      }
    } catch (error) {
      setCreateWargaMessage({ type: 'error', text: 'Terjadi kesalahan' });
    } finally {
      setCreateWargaLoading(false);
    }
  };

  // Editing handlers...


  useEffect(() => {
    const saved = localStorage.getItem('rt005_management');
    if (saved) {
      try {
        setManagement(JSON.parse(saved));
        setEditForm(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse management data', e);
      }
    }

    const savedStats = localStorage.getItem('rt005_stats');
    if (savedStats) {
      try {
        setDashboardStats(JSON.parse(savedStats));
        setEditStatsForm(JSON.parse(savedStats));
      } catch (e) {
        console.error('Failed to parse stats data', e);
      }
    }

    const savedChart = localStorage.getItem('rt005_org_chart');
    if (savedChart) setOrgChartImage(savedChart);
  }, []);

  // Org Chart State
  const [orgChartImage, setOrgChartImage] = useState<string | null>(null);

  const handleOrgChartUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setOrgChartImage(base64String);
        localStorage.setItem('rt005_org_chart', base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Slider & Lightbox State
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const activities = announcements.filter(a => a.category === 'Kegiatan' && a.imageUrl);

  useEffect(() => {
    if (activities.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activities.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activities.length]);

  const handleSaveManagement = () => {
    setManagement(editForm);
    localStorage.setItem('rt005_management', JSON.stringify(editForm));
    setIsEditingManagement(false);
  };

  const handleSaveStats = () => {
    setDashboardStats(editStatsForm);
    localStorage.setItem('rt005_stats', JSON.stringify(editStatsForm));
    setIsEditingStats(false);
  };

  // Get pinned or latest announcements
  const featuredAnnouncements = announcements
    .filter(a => a.isPinned)
    .concat(announcements.filter(a => !a.isPinned))
    .slice(0, 3);


  // Dummy Data Keluarga (Sekarang Dinamis)
  const stats = [
    { label: 'Kepala Keluarga', value: dashboardStats.kk, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Total Warga', value: dashboardStats.warga, icon: Home, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Keamanan Lingkungan', value: dashboardStats.keamanan, icon: Shield, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Layanan Digital', value: dashboardStats.layanan, icon: FileText, color: 'text-primary', bg: 'bg-primary-light' },
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
              <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> RT 002 / RW 16 • Perumahan TAMAN CIBIRU Cibatu
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Lingkungan Modern <br className="hidden md:inline" />Dimulai dari Warga Terhubung.
            </h1>
            <p className="text-blue-100 text-base md:text-lg max-w-xl leading-relaxed">
              Selamat datang di Portal Digital RT 002 RW 16. Prumahan Taman Cibiru   Di sini Anda dapat mengurus surat pengantar domisili, memantau laporan keuangan kas iuran secara transparan, serta mengakses pengumuman resmi dari kenyamanan rumah Anda.
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
                  <p className="text-xs text-blue-200 font-medium font-mono">TOTAL KAS RT 002</p>
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

      {/* Slider Kegiatan */}
      {activities.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Sorotan Kegiatan</h2>
              <p className="text-sm text-slate-500 mt-1">Galeri momen kebersamaan dan aktivitas warga RT 002</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentSlide(prev => (prev === 0 ? activities.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentSlide(prev => (prev + 1) % activities.length)}
                className="p-2 rounded-full bg-white shadow-sm border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="relative h-[250px] md:h-[450px] w-full rounded-[2rem] overflow-hidden group border border-white/60 shadow-xl shadow-slate-200/50 bg-slate-100">
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, filter: 'blur(10px)' }}
                animate={{ opacity: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, filter: 'blur(10px)' }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <img
                  src={activities[currentSlide].imageUrl!.startsWith('/') ? `http://localhost:3001${activities[currentSlide].imageUrl}` : activities[currentSlide].imageUrl!}
                  alt={activities[currentSlide].title}
                  className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 hover:scale-105"
                  onClick={() => setEnlargedImage(activities[currentSlide].imageUrl!)}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent pointer-events-none" />
                <div className="absolute bottom-0 left-0 p-6 md:p-10 w-full text-white pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-600/90 backdrop-blur-md rounded-full text-[11px] font-bold uppercase tracking-wider mb-3 border border-white/20">
                    <Star className="h-3 w-3" /> {activities[currentSlide].date}
                  </span>
                  <h3 className="text-2xl md:text-4xl font-extrabold mb-3 leading-tight drop-shadow-md">{activities[currentSlide].title}</h3>
                  <button
                    onClick={(e) => { e.stopPropagation(); onNavigate('pengumuman'); }}
                    className="mt-2 inline-flex items-center gap-2 text-sm font-bold bg-white/20 hover:bg-white/30 border border-white/30 backdrop-blur-md px-5 py-2.5 rounded-full transition-colors pointer-events-auto cursor-pointer"
                  >
                    Selengkapnya <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      )}

      {/* Stats Grid */}
      <section>
        <div className="flex justify-end mb-3">
          {isAdmin && !isEditingStats && (
            <button
              onClick={() => setIsEditingStats(true)}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 cursor-pointer flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full hover:bg-slate-50 transition-colors"
            >
              <Edit3 className="h-3.5 w-3.5" /> Edit Data Statistik
            </button>
          )}
        </div>

        {isEditingStats ? (
          <div className="glass-panel p-6 rounded-[2rem] space-y-4 bg-white/60">
            <h3 className="font-bold text-slate-800">Edit Data Statistik</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Kepala Keluarga</label>
                <input
                  type="text"
                  value={editStatsForm.kk}
                  onChange={e => setEditStatsForm({ ...editStatsForm, kk: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-blue-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Total Warga</label>
                <input
                  type="text"
                  value={editStatsForm.warga}
                  onChange={e => setEditStatsForm({ ...editStatsForm, warga: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-blue-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Keamanan</label>
                <input
                  type="text"
                  value={editStatsForm.keamanan}
                  onChange={e => setEditStatsForm({ ...editStatsForm, keamanan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-blue-500 font-bold"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 block mb-1">Layanan</label>
                <input
                  type="text"
                  value={editStatsForm.layanan}
                  onChange={e => setEditStatsForm({ ...editStatsForm, layanan: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-blue-500 font-bold"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => { setIsEditingStats(false); setEditStatsForm(dashboardStats); }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveStats}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-colors shadow-md shadow-blue-500/20 cursor-pointer"
              >
                <Save className="h-3.5 w-3.5" /> Simpan Perubahan
              </button>
            </div>
          </div>
        ) : (
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
        )}
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
                      src={ann.imageUrl.startsWith('/') ? `http://localhost:3001${ann.imageUrl}` : ann.imageUrl}
                      alt={ann.imageAlt || ann.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className={`p-2.5 rounded-xl hidden md:block border border-white ${ann.category === 'Darurat' ? 'bg-red-100/50 text-red-600' :
                    ann.category === 'Kegiatan' ? 'bg-blue-100/50 text-blue-600' :
                      ann.category === 'Keamanan' ? 'bg-emerald-100/50 text-emerald-600' :
                        'bg-slate-100/50 text-slate-600'
                    }`}>
                    <Megaphone className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase font-mono font-extrabold px-2 py-0.5 rounded-md border border-white/30 ${ann.category === 'Darurat' ? 'bg-red-100/50 text-red-800' :
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-extrabold text-slate-800">Kepengurusan RT 002</h2>
            {isAdmin && (
              <button
                onClick={() => setIsEditingManagement(true)}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </button>
            )}
          </div>

          <div className="glass-panel p-6 rounded-[2rem] space-y-6">
            {/* Header of management board */}
            <div className="flex items-center gap-3 pb-4 border-b border-white/40">
              <div className="p-2.5 bg-blue-100/50 text-blue-600 border border-white rounded-xl">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Rukun Tetangga 002</h4>
                <p className="text-xs text-slate-500">Masa Bakti Kepengurusan 2024 - 2029</p>
              </div>
            </div>

            {/* Bagan Struktur Organisasi */}
            <div className="relative group">
              <div
                className="relative rounded-xl overflow-hidden border border-white/60 shadow-inner group-hover:shadow-lg transition-all cursor-pointer bg-white"
                onClick={() => setEnlargedImage(orgChartImage || '/images/struktur_organisasi.png')}
              >
                <img
                  src={orgChartImage || '/images/struktur_organisasi.png'}
                  alt="Bagan Struktur Organisasi RT 005"
                  className="w-full h-40 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                  <span className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    Perbesar Bagan
                  </span>
                </div>
              </div>

              {isAdmin && (
                <label className="absolute top-2 right-2 bg-white/90 backdrop-blur text-blue-600 hover:bg-blue-600 hover:text-white p-2 rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors z-10 flex items-center gap-1">
                  <Edit3 className="h-3.5 w-3.5" />
                  <span>Ubah Bagan</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleOrgChartUpload} />
                </label>
              )}
            </div>

            {/* List of personnel */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Ketua RT</p>
                  <p className="font-bold text-slate-800 text-sm">{management.ketua}</p>
                </div>
                <span className="text-xs text-emerald-700 bg-emerald-100/50 border border-white/40 px-2.5 py-1 rounded-full font-bold">Aktif</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Sekretaris RT</p>
                  <p className="font-bold text-slate-800 text-sm">{management.sekretaris}</p>
                </div>
                <span className="text-xs text-slate-500 bg-white/50 border border-white/40 px-2.5 py-1 rounded-full font-medium">Aktif</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase font-mono tracking-wider">Bendahara RT</p>
                  <p className="font-bold text-slate-800 text-sm">{management.bendahara}</p>
                </div>
                <span className="text-xs text-slate-500 bg-white/50 border border-white/40 px-2.5 py-1 rounded-full font-medium">Aktif</span>
              </div>
            </div>

            {/* Address callout */}
            <div className="p-4 bg-white/25 rounded-xl space-y-1 border border-white/30">
              <p className="text-xs font-extrabold text-slate-400 uppercase font-mono">Sekretariat Utama</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Perumahan Harper Blok A/01, RT 002 / RW 16, Kelurahan Cibatu.
              </p>
            </div>
          </div>

          {/* Fitur Spesial Admin: Tambah Akun Warga & Reset Password */}
          {isAdmin && (
            <div className="space-y-6">
              <div className="glass-panel p-6 rounded-[2rem] space-y-4 border-2 border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center gap-3 pb-3 border-b border-emerald-200">
                  <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">Tambah Akun Warga</h4>
                    <p className="text-xs text-emerald-700/80">Buat akun baru untuk warga</p>
                  </div>
                </div>

                <form onSubmit={handleCreateWargaSubmit} className="space-y-3 pt-2">
                  {createWargaMessage && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${createWargaMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {createWargaMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {createWargaMessage.text}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-900">Nama Lengkap Warga</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                      <input
                        type="text"
                        required
                        value={createWargaDisplayName}
                        onChange={(e) => setCreateWargaDisplayName(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        placeholder="Nama warga..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-900">Username (Untuk Login)</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                      <input
                        type="text"
                        required
                        value={createWargaUsername}
                        onChange={(e) => setCreateWargaUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        placeholder="Contoh: Harper_A01"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-emerald-900">Password Awal</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
                      <input
                        type={showCreateWargaPassword ? 'text' : 'password'}
                        required
                        value={createWargaPassword}
                        onChange={(e) => setCreateWargaPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 border border-emerald-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                        placeholder="Password standar..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowCreateWargaPassword(!showCreateWargaPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showCreateWargaPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={createWargaLoading}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-sm transition-colors mt-2"
                  >
                    {createWargaLoading ? 'Memproses...' : 'Buat Akun Warga'}
                  </button>
                </form>
              </div>

              <div className="glass-panel p-6 rounded-[2rem] space-y-4 border-2 border-red-100 bg-red-50/30">
                <div className="flex items-center gap-3 pb-3 border-b border-red-200">
                  <div className="p-2.5 bg-red-100 text-red-600 rounded-xl">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-red-900 text-sm">Manajemen Akun Warga</h4>
                    <p className="text-xs text-red-700/80">Reset password akun warga spesifik</p>
                  </div>
                </div>

                <form onSubmit={handleResetWargaSubmit} className="space-y-3 pt-2">
                  {resetWargaMessage && (
                    <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${resetWargaMessage.type === 'success' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                      {resetWargaMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                      {resetWargaMessage.text}
                    </div>
                  )}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-red-900">Username Warga (Misal: Harper_A01)</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                      <input
                        type="text"
                        required
                        value={targetUsername}
                        onChange={(e) => setTargetUsername(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                        placeholder="Username warga..."
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-red-900">Password Baru Warga</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-400" />
                      <input
                        type={showWargaPassword ? 'text' : 'password'}
                        required
                        value={newWargaPassword}
                        onChange={(e) => setNewWargaPassword(e.target.value)}
                        className="w-full pl-9 pr-10 py-2 border border-red-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white"
                        placeholder="Masukkan password baru..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowWargaPassword(!showWargaPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                      >
                        {showWargaPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={resetWargaLoading}
                    className="w-full px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                  >
                    {resetWargaLoading && <div className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />}
                    Simpan Password Warga
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Management Modal */}
      {isEditingManagement && (
        <div className="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-md flex items-center justify-center px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="w-full max-w-md glass-panel rounded-[2rem] p-6 md:p-7 shadow-2xl border border-white/70 relative"
          >
            <button
              type="button"
              onClick={() => setIsEditingManagement(false)}
              className="absolute right-5 top-5 p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white/40 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1">
                  Edit Pengurus RT
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed mt-2">
                  Ubah nama kepengurusan RT yang sedang menjabat.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Ketua RT</label>
                  <input
                    type="text"
                    value={editForm.ketua}
                    onChange={(e) => setEditForm({ ...editForm, ketua: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Sekretaris RT</label>
                  <input
                    type="text"
                    value={editForm.sekretaris}
                    onChange={(e) => setEditForm({ ...editForm, sekretaris: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Nama Bendahara RT</label>
                  <input
                    type="text"
                    value={editForm.bendahara}
                    onChange={(e) => setEditForm({ ...editForm, bendahara: e.target.value })}
                    className="w-full px-4 py-3 bg-white/50 border border-white/70 focus:bg-white/80 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </div>

                <button
                  onClick={handleSaveManagement}
                  className="w-full px-5 py-3.5 rounded-xl font-extrabold text-sm shadow-md transition-all inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10 cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Simpan Perubahan
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      <AnimatePresence>
        {enlargedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
            onClick={() => setEnlargedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={e => e.stopPropagation()}
            >
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={() => setEnlargedImage(null)}
                  className="p-2 bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur text-white rounded-full transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-auto bg-slate-100 p-2 sm:p-6 flex items-center justify-center">
                <img
                  src={enlargedImage}
                  alt="Enlarged view"
                  className="max-w-full h-auto object-contain rounded-xl shadow-sm border border-slate-200/60"
                  style={{ maxHeight: 'calc(90vh - 3rem)' }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
