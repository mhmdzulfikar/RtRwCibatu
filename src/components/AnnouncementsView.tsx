import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Search, Plus, Trash2, Edit3, Pin, Calendar, User, ChevronRight, X, AlertCircle } from 'lucide-react';
import { Announcement } from '../types';
import { useAnnouncementsView } from '../hooks/useAnnouncementsView';

interface AnnouncementsViewProps {
  announcements: Announcement[];
  isAdmin: boolean;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>, file?: File) => void;
  onEditAnnouncement?: (id: string, announcement: Partial<Announcement>, file?: File | null) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export default function AnnouncementsView({
  announcements,
  isAdmin,
  onAddAnnouncement,
  onEditAnnouncement,
  onDeleteAnnouncement,
}: AnnouncementsViewProps) {
  const {
    filters,
    updateFilter,
    form,
    updateForm,
    showAddForm,
    setShowAddForm,
    selectedAnnouncement,
    setSelectedAnnouncement,
    categories,
    years,
    filteredAnnouncements,
    handleSubmit,
    editingId,
    handleEditClick,
    closeForm,
  } = useAnnouncementsView({ announcements, onAddAnnouncement, onEditAnnouncement });

  const [enlargedImage, setEnlargedImage] = React.useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-teal-800">Pengumuman Warga</h1>
          <p className="text-slate-500 mt-1">
            Informasi resmi, agenda kegiatan, serta imbauan bagi warga RT 002 / RW 16.
          </p>
        </div>

        {isAdmin && !showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/10 text-sm cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Tambah Pengumuman
          </button>
        )}
      </div>

      {/* Admin Add Announcement Form Overlay */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-6 rounded-[2rem] space-y-4 shadow-xl border border-white/60"
        >
          <div className="flex justify-between items-center border-b border-white/40 pb-3">
            <h3 className="font-extrabold text-slate-800 text-lg flex items-center gap-2">
              {editingId ? (
                <><Edit3 className="h-5 w-5 text-blue-600" /> Edit Pengumuman (Admin)</>
              ) : (
                <><Megaphone className="h-5 w-5 text-blue-600" /> Buat Pengumuman Baru (Admin)</>
              )}
            </h3>
            <button
              onClick={closeForm}
              className="p-1.5 rounded-full hover:bg-white/40 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => updateForm('title', e.target.value)}
                  placeholder="Contoh: Kerja Bakti Bulanan RT..."
                  className="w-full px-4 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => updateForm('category', e.target.value as Announcement['category'])}
                  className="w-full px-4 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="Umum">Umum</option>
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Iuran">Iuran</option>
                  <option value="Keamanan">Keamanan</option>
                  <option value="Darurat">Darurat</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600">Penulis / Pembuat</label>
                <input
                  type="text"
                  required
                  value={form.author}
                  onChange={(e) => updateForm('author', e.target.value)}
                  className="w-full px-4 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
                />
              </div>

              <div className="flex items-center h-full pt-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isPinned}
                    onChange={(e) => updateForm('isPinned', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/60 rounded-xs"
                  />
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-500" /> Sematkan di Paling Atas (Pinned)
                  </span>
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Foto Kegiatan (Opsional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    updateForm('imageFile', e.target.files[0]);
                  } else {
                    updateForm('imageFile', null);
                  }
                }}
                className="w-full px-4 py-2 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-600">Isi Pengumuman</label>
              <textarea
                required
                rows={4}
                value={form.content}
                onChange={(e) => updateForm('content', e.target.value)}
                placeholder="Tuliskan detail pengumuman secara lengkap di sini (jadwal, tempat, instruksi, kontak penanggung jawab, dll)..."
                className="w-full px-4 py-2.5 bg-white/40 border border-white/60 focus:bg-white/65 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-white/60 bg-white/20 hover:bg-white/40 rounded-xl font-bold text-sm text-slate-600 cursor-pointer transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm cursor-pointer shadow-md shadow-blue-500/10 transition-all"
              >
                Terbitkan Pengumuman
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Filtering and Search Controls */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
            placeholder="Cari pengumuman..."
            className="w-full pl-11 pr-4 py-2.5 bg-white/40 border border-white/60 backdrop-blur-md rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition-all font-sans"
          />
        </div>

        {/* Year Filter */}
        <div className="relative lg:w-44">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <select
            value={filters.year}
            onChange={(e) => updateFilter('year', e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/40 border border-white/60 backdrop-blur-md rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs transition-all"
          >
            <option value="Semua">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-1.5 items-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => updateFilter('category', cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filters.category === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white/40 text-slate-600 border border-white/60 hover:bg-white/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Announcements */}
      {filteredAnnouncements.length === 0 ? (
        <div className="glass-panel rounded-[2rem] p-12 text-center space-y-3">
          <AlertCircle className="h-10 w-10 text-slate-400 mx-auto" />
          <h4 className="font-bold text-slate-800">Tidak ada pengumuman ditemukan</h4>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Coba ubah kata kunci pencarian Anda atau pilih kategori pengumuman yang berbeda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredAnnouncements.map((ann) => (
              <motion.div
                key={ann.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`glass-panel glass-panel-hover p-6 rounded-[2rem] flex flex-col justify-between relative group ${
                  ann.isPinned ? 'border-amber-300 bg-amber-50/15' : ''
                }`}
              >
                {/* Pinned visual flag */}
                {ann.isPinned && (
                  <div className="absolute top-4 right-4 text-amber-600 bg-amber-100/60 border border-white/30 p-1.5 rounded-lg flex items-center justify-center" title="Pengumuman Penting">
                    <Pin className="h-4 w-4 fill-amber-500 text-amber-500" />
                  </div>
                )}

                <div className="space-y-4">
                  {ann.imageUrl && (
                    <div className="-mx-1 -mt-1 overflow-hidden rounded-[1.35rem] aspect-[16/9] bg-slate-100 border border-white/60">
                      <img
                        src={ann.imageUrl.startsWith('/') ? `http://localhost:3001${ann.imageUrl}` : ann.imageUrl}
                        alt={ann.imageAlt || ann.title}
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 cursor-zoom-in"
                        onClick={() => setEnlargedImage(ann.imageUrl!)}
                      />
                    </div>
                  )}

                  {/* Category and date row */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] uppercase font-mono font-extrabold px-2.5 py-0.5 rounded-md border border-white/30 ${
                        ann.category === 'Darurat'
                          ? 'bg-red-100/50 text-red-800'
                          : ann.category === 'Kegiatan'
                          ? 'bg-blue-100/50 text-blue-800'
                          : ann.category === 'Keamanan'
                          ? 'bg-emerald-100/50 text-emerald-800'
                          : 'bg-slate-100/50 text-slate-800'
                      }`}
                    >
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono font-medium flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" /> {ann.date}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 leading-snug group-hover:text-blue-600 transition-colors pr-6 font-sans">
                      {ann.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-4 whitespace-pre-wrap leading-relaxed font-sans">
                      {ann.content}
                    </p>
                  </div>
                </div>

                {/* Footer block */}
                <div className="flex items-center justify-between border-t border-white/30 mt-6 pt-4">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Oleh: <strong className="text-slate-700">{ann.author}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedAnnouncement(ann)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center cursor-pointer transition-colors"
                    >
                      Baca Selengkapnya <ChevronRight className="h-4 w-4" />
                    </button>

                    {isAdmin && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleEditClick(ann)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 transition-colors cursor-pointer"
                          title="Edit Pengumuman"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onDeleteAnnouncement(ann.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50/50 transition-colors cursor-pointer"
                          title="Hapus Pengumuman"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Full Details Modal for Selected Announcement */}
      {selectedAnnouncement && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel max-w-2xl w-full p-6 space-y-4 relative max-h-[90vh] overflow-y-auto rounded-[2rem] shadow-2xl"
          >
            <button
              onClick={() => setSelectedAnnouncement(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-white/45 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs uppercase font-mono font-extrabold px-3 py-0.5 rounded-md border border-white/30 ${
                    selectedAnnouncement.category === 'Darurat'
                      ? 'bg-red-100/50 text-red-800'
                      : selectedAnnouncement.category === 'Kegiatan'
                      ? 'bg-blue-100/50 text-blue-800'
                      : selectedAnnouncement.category === 'Keamanan'
                      ? 'bg-emerald-100/50 text-emerald-800'
                      : 'bg-slate-100/50 text-slate-800'
                  }`}
                >
                  {selectedAnnouncement.category}
                </span>
                <span className="text-xs text-slate-400 font-mono font-medium">
                  {selectedAnnouncement.date}
                </span>
                {selectedAnnouncement.isPinned && (
                  <span className="text-xs text-amber-800 bg-amber-100/60 border border-white/30 px-2.5 py-0.5 rounded-md font-bold flex items-center gap-1">
                    <Pin className="h-3 w-3 fill-amber-500 text-amber-500" /> Disematkan
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 leading-tight">
                {selectedAnnouncement.title}
              </h2>

              {selectedAnnouncement.imageUrl && (
                <div className="overflow-hidden rounded-[1.35rem] aspect-[16/9] bg-slate-100 border border-white/60">
                  <img
                    src={selectedAnnouncement.imageUrl.startsWith('/') ? `http://localhost:3001${selectedAnnouncement.imageUrl}` : selectedAnnouncement.imageUrl}
                    alt={selectedAnnouncement.imageAlt || selectedAnnouncement.title}
                    className="w-full h-full object-cover cursor-zoom-in hover:scale-[1.02] transition-transform"
                    loading="lazy"
                    onClick={() => setEnlargedImage(selectedAnnouncement.imageUrl!)}
                  />
                </div>
              )}

              <div className="border-t border-b border-white/40 py-4">
                <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedAnnouncement.content}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-505 font-medium pt-2">
                <div className="flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Diterbitkan oleh: <strong className="text-gray-755 text-slate-700">{selectedAnnouncement.author}</strong></span>
                </div>
                <button
                  onClick={() => setSelectedAnnouncement(null)}
                  className="px-4 py-2 bg-white/40 border border-white/60 hover:bg-white/60 text-slate-800 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Lightbox Modal */}
      {enlargedImage && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out transition-all"
          onClick={() => setEnlargedImage(null)}
        >
          <button 
            className="absolute top-6 right-6 p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors cursor-pointer border border-white/10"
            onClick={(e) => { e.stopPropagation(); setEnlargedImage(null); }}
          >
            <X className="h-6 w-6" />
          </button>
          <motion.img 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            src={enlargedImage.startsWith('/') ? `http://localhost:3001${enlargedImage}` : enlargedImage}
            className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
            alt="Perbesar Gambar"
          />
        </div>
      )}
    </div>
  );
}
