import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Home,
  FileText,
  Wallet,
  Megaphone,
  Shield,
  Lock,
  LogOut,
  UserRound,
  Menu,
  X,
  Building2,
  Calendar
} from 'lucide-react';

import { AuthenticatedUser, Announcement, FinancialTransaction, CitizenDues, LetterRequest, DuesPaymentRequest } from './types';

import {
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRANSACTIONS,
  INITIAL_CITIZENS_DUES,
  INITIAL_LETTER_REQUESTS,
  INITIAL_PAYMENT_REQUESTS,
  hydrateAnnouncementPhotos
} from './data';
import { ADMIN_SESSION_MAX_AGE_MS, AUTH_STORAGE_KEY, readStoredSession } from './security';

import Dashboard from './components/Dashboard';
import AnnouncementsView from './components/AnnouncementsView';
import FinancesView from './components/FinancesView';
import LetterRequestsView from './components/LetterRequestsView';
import AdminLoginModal from './components/AdminLoginModal';


export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('beranda');
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(() => readStoredSession());
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const isAdmin = currentUser?.role === 'admin';

  // Central Database States (Backed up by localStorage for persistent testing)
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [citizensDues, setCitizensDues] = useState<CitizenDues[]>([]);
  const [letterRequests, setLetterRequests] = useState<LetterRequest[]>([]);
  const [paymentRequests, setPaymentRequests] = useState<DuesPaymentRequest[]>([]);

  // Hydrate central states from localStorage on startup
  useEffect(() => {
    try {
      const storedAnn = localStorage.getItem('rt005_announcements');
      if (storedAnn) {
        const parsedAnnouncements = JSON.parse(storedAnn) as Announcement[];
        const announcementsWithPhotos = hydrateAnnouncementPhotos(parsedAnnouncements);
        setAnnouncements(announcementsWithPhotos);
        if (JSON.stringify(parsedAnnouncements) !== JSON.stringify(announcementsWithPhotos)) {
          localStorage.setItem('rt005_announcements', JSON.stringify(announcementsWithPhotos));
        }
      }
      else {
        const announcementsWithPhotos = hydrateAnnouncementPhotos(INITIAL_ANNOUNCEMENTS);
        setAnnouncements(announcementsWithPhotos);
        localStorage.setItem('rt005_announcements', JSON.stringify(announcementsWithPhotos));
      }

      const storedTx = localStorage.getItem('rt005_transactions');
      if (storedTx) setTransactions(JSON.parse(storedTx));
      else {
        setTransactions(INITIAL_TRANSACTIONS);
        localStorage.setItem('rt005_transactions', JSON.stringify(INITIAL_TRANSACTIONS));
      }

      const storedDues = localStorage.getItem('rt005_citizens_dues');
      if (storedDues) setCitizensDues(JSON.parse(storedDues));
      else {
        setCitizensDues(INITIAL_CITIZENS_DUES);
        localStorage.setItem('rt005_citizens_dues', JSON.stringify(INITIAL_CITIZENS_DUES));
      }

      const storedLetters = localStorage.getItem('rt005_letter_requests');
      if (storedLetters) setLetterRequests(JSON.parse(storedLetters));
      else {
        setLetterRequests(INITIAL_LETTER_REQUESTS);
        localStorage.setItem('rt005_letter_requests', JSON.stringify(INITIAL_LETTER_REQUESTS));
      }

      const storedPayments = localStorage.getItem('rt005_payment_requests');
      if (storedPayments) setPaymentRequests(JSON.parse(storedPayments));
      else {
        setPaymentRequests(INITIAL_PAYMENT_REQUESTS);
        localStorage.setItem('rt005_payment_requests', JSON.stringify(INITIAL_PAYMENT_REQUESTS));
      }
    } catch (e) {
      console.error('Failed to load local storage database. Falling back to memory.', e);
      setAnnouncements(INITIAL_ANNOUNCEMENTS);
      setTransactions(INITIAL_TRANSACTIONS);
      setCitizensDues(INITIAL_CITIZENS_DUES);
      setLetterRequests(INITIAL_LETTER_REQUESTS);
      setPaymentRequests(INITIAL_PAYMENT_REQUESTS);
    }
  }, []);

  // Helper helper to write states easily
  const saveStateToStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to write key to local storage', error);
    }
  };

  const handleAdminLogin = (user: AuthenticatedUser) => {
    setCurrentUser(user);
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    setShowAdminLogin(false);
    setActiveTab('beranda');
  };

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(null);
    setShowAdminLogin(false);
    setActiveTab('beranda');
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!currentUser) return;

    const checkExpiry = () => {
      const loginTime = new Date(currentUser.loginTime).getTime();
      if (!loginTime || Date.now() - loginTime > ADMIN_SESSION_MAX_AGE_MS) {
        handleLogout();
      }
    };

    const intervalId = window.setInterval(checkExpiry, 60 * 1000);
    checkExpiry();

    return () => window.clearInterval(intervalId);
  }, [currentUser]);

  const requireAdminAccess = () => {
    if (isAdmin) return true;
    alert('Akses admin ditolak. Silakan login sebagai pengurus RT.');
    return false;
  };

  // ----------------------------------------------------
  // ANNOUNCEMENTS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date'>) => {
    if (!requireAdminAccess()) return;

    const fresh: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...announcements];
    setAnnouncements(updated);
    saveStateToStorage('rt005_announcements', updated);
  };

  const handleDeleteAnnouncement = (id: string) => {
    if (!requireAdminAccess()) return;

    const updated = announcements.filter(a => a.id !== id);
    setAnnouncements(updated);
    saveStateToStorage('rt005_announcements', updated);
  };

  // ----------------------------------------------------
  // TRANSACTIONS ACTION DISPATCHERS
  // ----------------------------------------------------
  const handleAddTransaction = (newTx: Omit<FinancialTransaction, 'id' | 'recordedBy'>) => {
    if (!requireAdminAccess()) return;

    const fresh: FinancialTransaction = {
      ...newTx,
      id: `tx-${Date.now()}`,
      recordedBy: 'Admin RT / Bendahara'
    };
    const updated = [fresh, ...transactions];
    setTransactions(updated);
    saveStateToStorage('rt005_transactions', updated);
  };

  // ----------------------------------------------------
  // DUES / PAYMENT SUBMISSION AND VERIFICATION DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitPaymentRequest = (newPayReq: Omit<DuesPaymentRequest, 'id' | 'status' | 'dateSubmitted'>) => {
    const fresh: DuesPaymentRequest = {
      ...newPayReq,
      id: `pay-${Date.now()}`,
      status: 'pending',
      dateSubmitted: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...paymentRequests];
    setPaymentRequests(updated);
    saveStateToStorage('rt005_payment_requests', updated);

    // Also change that citizen's month history status from 'Belum' to 'Pending' so they see it in transition!
    const updatedDuesList = citizensDues.map(c => {
      // Match by name or house number and respect optional RT/RW when provided
      const nameMatch = c.citizenName.toLowerCase().trim() === newPayReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === newPayReq.houseNumber.toLowerCase().trim();
      const rtMatch = newPayReq.rt ? c.rt === newPayReq.rt : true;
      const rwMatch = newPayReq.rw ? c.rw === newPayReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[newPayReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [newPayReq.year]: {
              ...yearObj,
              [newPayReq.month]: 'Pending' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);
  };

  const handleApprovePaymentRequest = (id: string) => {
    if (!requireAdminAccess()) return;

    const targetReq = paymentRequests.find(p => p.id === id);
    if (!targetReq) return;

    // 1. Mark status as approved
    const updatedRequests = paymentRequests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r);
    setPaymentRequests(updatedRequests);
    saveStateToStorage('rt005_payment_requests', updatedRequests);

    // 2. Turn month status inside citizensDues from 'Pending' to 'Lunas'
    const updatedDuesList = citizensDues.map(c => {
      const nameMatch = c.citizenName.toLowerCase().trim() === targetReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === targetReq.houseNumber.toLowerCase().trim();
      const rtMatch = targetReq.rt ? c.rt === targetReq.rt : true;
      const rwMatch = targetReq.rw ? c.rw === targetReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[targetReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [targetReq.year]: {
              ...yearObj,
              [targetReq.month]: 'Lunas' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);

    // 3. Automatically append an income financial transaction into transactions logbook!
    handleAddTransaction({
      description: `Iuran Bulanan ${targetReq.month} 2026 - ${targetReq.citizenName} (${targetReq.houseNumber})`,
      amount: targetReq.amount,
      type: 'masuk',
      date: new Date().toISOString().substring(0, 10),
      category: 'Iuran Bulanan'
    });
  };

  const handleRejectPaymentRequest = (id: string) => {
    if (!requireAdminAccess()) return;

    const targetReq = paymentRequests.find(p => p.id === id);
    if (!targetReq) return;

    // 1. Mark status as rejected
    const updatedRequests = paymentRequests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r);
    setPaymentRequests(updatedRequests);
    saveStateToStorage('rt005_payment_requests', updatedRequests);

    // 2. Set month status inside citizensDues back to 'Belum' from 'Pending'
    const updatedDuesList = citizensDues.map(c => {
      const nameMatch = c.citizenName.toLowerCase().trim() === targetReq.citizenName.toLowerCase().trim();
      const houseMatch = c.houseNumber.toLowerCase().trim() === targetReq.houseNumber.toLowerCase().trim();
      const rtMatch = targetReq.rt ? c.rt === targetReq.rt : true;
      const rwMatch = targetReq.rw ? c.rw === targetReq.rw : true;
      if ((nameMatch || houseMatch) && rtMatch && rwMatch) {
        const yearObj = c.paymentHistory[targetReq.year] || {};
        return {
          ...c,
          paymentHistory: {
            ...c.paymentHistory,
            [targetReq.year]: {
              ...yearObj,
              [targetReq.month]: 'Belum' as const
            }
          }
        };
      }
      return c;
    });
    setCitizensDues(updatedDuesList);
    saveStateToStorage('rt005_citizens_dues', updatedDuesList);
  };

  // ----------------------------------------------------
  // LETTERS (SURAT DOMISILI) DISPATCHERS
  // ----------------------------------------------------
  const handleSubmitLetterRequest = (newLetter: Omit<LetterRequest, 'id' | 'status' | 'dateRequested'>) => {
    const fresh: LetterRequest = {
      ...newLetter,
      id: `req-${Date.now().toString().substring(10)}`, // short layout
      status: 'submitted',
      dateRequested: new Date().toISOString().substring(0, 10)
    };
    const updated = [fresh, ...letterRequests];
    setLetterRequests(updated);
    saveStateToStorage('rt005_letter_requests', updated);
  };

  const handleUpdateLetterStatus = (
    id: string,
    status: LetterRequest['status'],
    updateData?: { referenceNo?: string; rejectedReason?: string }
  ) => {
    if (!requireAdminAccess()) return;

    const updated = letterRequests.map(r => {
      if (r.id === id) {
        return {
          ...r,
          status,
          ...(updateData?.referenceNo ? { referenceNo: updateData.referenceNo } : {}),
          ...(updateData?.rejectedReason ? { rejectedReason: updateData.rejectedReason } : {})
        };
      }
      return r;
    });
    setLetterRequests(updated);
    saveStateToStorage('rt005_letter_requests', updated);
  };

  // ----------------------------------------------------
  // MATHEMATICS CALCULATIONS FOR TREASURY
  // ----------------------------------------------------
  const calculateTotalBalance = () => {
    const sumIn = transactions.filter(t => t.type === 'masuk').reduce((s, t) => s + t.amount, 0);
    const sumOut = transactions.filter(t => t.type === 'keluar').reduce((s, t) => s + t.amount, 0);
    return sumIn - sumOut;
  };

  const totalBalance = calculateTotalBalance();

  const currentDateLabel = (() => {
    const date = new Date();
    const weekdays = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${weekdays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  })();

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 flex flex-col justify-between">

      {/* AUTHENTICATED SESSION BAR */}
      <div className="bg-slate-900 text-white relative py-1.5 px-4 z-40 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isAdmin ? 'bg-amber-400' : 'bg-emerald-400'}`} />
            <span className="text-[11px] sm:text-xs font-mono font-bold text-slate-300">
              PORTAL RT 005 AKTIF • JATIBENING BARU, BEKASI
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <span
              className={`px-3 py-1 rounded-full text-xs font-black tracking-tight inline-flex items-center gap-1.5 ${isAdmin
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
            >
              {isAdmin ? <Shield className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
              {isAdmin ? currentUser?.displayName || 'Pengurus RT 005' : 'Mode Warga'}
            </span>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-xs font-black tracking-tight inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="h-3 w-3" /> Keluar Admin
              </button>
            ) : (
              <button
                onClick={() => setShowAdminLogin(true)}
                className="px-3 py-1 rounded-full text-xs font-black tracking-tight inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Lock className="h-3 w-3" /> Login Admin
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showAdminLogin && !isAdmin && (
          <AdminLoginModal
            onClose={() => setShowAdminLogin(false)}
            onLogin={handleAdminLogin}
          />
        )}
      </AnimatePresence>

      {/* HEADER NAVBAR CONTAINER */}
      <header className="sticky top-0 z-30 bg-white/30 backdrop-blur-md border-b border-white/40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo and Brand */}
            <div
              onClick={() => setActiveTab('beranda')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="h-11 w-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-200/50 group-hover:scale-105 transition-transform">
                <Building2 className="h-5 w-5" />
              </div>
              <div className="leading-tight">
                <span className="text-[10px] text-primary uppercase font-mono tracking-wider font-extrabold">RT 005 / RW 02</span>
                <h1 className="bg-clip-text text-transparent bg-gradient-to-r from-blue-800 to-teal-800 font-extrabold text-base md:text-lg tracking-tight flex items-center gap-1">
                  RT 005 Digital Hub
                </h1>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { id: 'beranda', label: 'Beranda', icon: Home },
                { id: 'surat', label: 'Ajukan Surat', icon: FileText },
                { id: 'keuangan', label: 'Keuangan & Iuran', icon: Wallet },
                { id: 'pengumuman', label: 'Pengumuman', icon: Megaphone }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer inline-flex items-center gap-1.5 ${isSelected
                        ? 'bg-white/60 text-primary shadow-xs border border-white/80'
                        : 'text-slate-600 hover:text-gray-950 hover:bg-white/20'
                      }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* Side Call-to-action */}
            <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-slate-500 font-medium">
              <Calendar className="h-3.5 w-3.5 text-blue-600" />
              <span>{currentDateLabel}</span>
            </div>

            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-white/40 bg-white/20 backdrop-blur-md hover:bg-white/30 text-gray-700"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown Panels */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white/60 backdrop-blur-lg border-t border-white/40 px-4 py-4 space-y-1.5"
            >
              {[
                { id: 'beranda', label: 'Beranda', icon: Home },
                { id: 'surat', label: 'Ajukan Surat Keterangan', icon: FileText },
                { id: 'keuangan', label: 'Laporan kas & Iuran Status', icon: Wallet },
                { id: 'pengumuman', label: 'Pengumuman Resmi', icon: Megaphone }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2.5 cursor-pointer ${isSelected
                        ? 'bg-white/70 text-primary border border-white/80 shadow-xs'
                        : 'text-slate-600 hover:bg-white/20'
                      }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* CORE SCREEN CANVAS CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'beranda' && (
              <Dashboard
                onNavigate={(t) => setActiveTab(t)}
                announcements={announcements}
                totalBalance={totalBalance}
              />
            )}

            {activeTab === 'pengumuman' && (
              <AnnouncementsView
                announcements={announcements}
                isAdmin={isAdmin}
                onAddAnnouncement={handleAddAnnouncement}
                onDeleteAnnouncement={handleDeleteAnnouncement}
              />
            )}

            {activeTab === 'keuangan' && (
              <FinancesView
                transactions={transactions}
                citizensDues={citizensDues}
                paymentRequests={paymentRequests}
                isAdmin={isAdmin}
                onAddTransaction={handleAddTransaction}
                onApprovePaymentRequest={handleApprovePaymentRequest}
                onRejectPaymentRequest={handleRejectPaymentRequest}
                onSubmitPaymentRequest={handleSubmitPaymentRequest}
              />
            )}

            {activeTab === 'surat' && (
              <LetterRequestsView
                requests={letterRequests}
                isAdmin={isAdmin}
                onSubmitRequest={handleSubmitLetterRequest}
                onUpdateStatus={handleUpdateLetterStatus}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* FOOTER METADATA MARKER */}
      <footer className="bg-slate-900 text-slate-400 mt-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pb-6 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 bg-red-600 text-white rounded-xl flex items-center justify-center font-bold text-sm">
                RT
              </div>
              <div className="leading-tight">
                <h4 className="font-bold text-white text-sm">RT 005 Jatibening Baru</h4>
                <p className="text-xs text-slate-500">Kecamatan Pondok Gede, Kota Bekasi</p>
              </div>
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Hubungi Sekretariat RT: <strong>+62 812-3456-7890</strong> (Bp. Tarman)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-slate-600">
            <p>
              Hak Cipta © 2026 Pengurus RT 005 Jatibening Baru. Seluruh Hak Cipta Dilindungi Undang-Undang.
            </p>
            <p className="font-mono">
              Portal Warga Digital v2.1.0 • Built with safety, transparency & React
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
