import { useState } from 'react';
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

import Dashboard from './components/Dashboard';
import AnnouncementsView from './components/AnnouncementsView';
import FinancesView from './components/FinancesView';
import LetterRequestsView from './components/LetterRequestsView';
import LoginModal from './components/LoginModal';

import { useAuth } from './hooks/useAuth';
import { useAppData } from './hooks/useAppData';

export default function App() {
  // Navigation State
  const [appState, setAppState] = useState({
    activeTab: 'beranda',
    mobileMenuOpen: false,
  });
  
  const updateAppState = (updates: Partial<typeof appState>) => setAppState((p) => ({ ...p, ...updates }));
  const { activeTab, mobileMenuOpen } = appState;

  const setActiveTab = (tab: string) => updateAppState({ activeTab: tab });
  const setMobileMenuOpen = (open: boolean) => updateAppState({ mobileMenuOpen: open });

  // Custom Hooks for Logic
  const {
    authState,
    updateAuthState,
    isAdmin,
    isWarga,
    handleLogin,
    handleLogout,
    requireAdminAccess,
    requireWargaAccess,
  } = useAuth(setActiveTab);
  const { currentUser, showLoginModal } = authState;
  const setShowLoginModal = (v: boolean) => updateAuthState({ showLoginModal: v });

  const {
    announcements,
    transactions,
    citizensDues,
    letterRequests,
    paymentRequests,
    totalBalance,
    handleAddAnnouncement,
    handleDeleteAnnouncement,
    handleAddTransaction,
    handleSubmitPaymentRequest,
    handleApprovePaymentRequest,
    handleRejectPaymentRequest,
    handleSubmitLetterRequest,
    handleUpdateLetterStatus,
  } = useAppData(requireAdminAccess);

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
                  : isWarga 
                    ? 'bg-blue-200 text-blue-900 border border-blue-300'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}
            >
              {isAdmin ? <Shield className="h-3 w-3" /> : <UserRound className="h-3 w-3" />}
              {isAdmin ? currentUser?.displayName || 'Pengurus RT 005' : (isWarga ? currentUser?.displayName || 'Warga RT 005' : 'Mode Pengunjung')}
            </span>
            {isAdmin || isWarga ? (
              <button
                onClick={handleLogout}
                className="px-3 py-1 rounded-full text-xs font-black tracking-tight inline-flex items-center gap-1.5 bg-slate-800 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-700 transition-all cursor-pointer"
              >
                <LogOut className="h-3 w-3" /> Keluar
              </button>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-3 py-1 rounded-full text-xs font-black tracking-tight inline-flex items-center gap-1.5 bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer"
              >
                <Lock className="h-3 w-3" /> Login Portal
              </button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showLoginModal && !isAdmin && !isWarga && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onLogin={handleLogin}
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
                isAdmin={isAdmin}
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
                isWarga={isWarga}
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
                isWarga={isWarga}
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
