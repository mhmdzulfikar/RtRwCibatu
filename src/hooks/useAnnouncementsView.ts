import { useState, FormEvent } from 'react';
import { Announcement } from '../types';
import { isSafeHttpUrl } from '../security';

export interface UseAnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>, file?: File) => void;
  onEditAnnouncement?: (id: string, announcement: Partial<Announcement>, file?: File | null) => void;
}

export function useAnnouncementsView({ announcements, onAddAnnouncement, onEditAnnouncement }: UseAnnouncementsViewProps) {
  // 1. Grouped State for Filters
  const [filters, setFilters] = useState({
    search: '',
    category: 'Semua',
    year: 'Semua',
  });

  const updateFilter = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 2. Grouped State for Forms
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: 'Umum' as Announcement['category'],
    isPinned: false,
    author: 'Ketua RT (Bp. Hendra)',
    imageFile: null as File | null,
  });

  const updateForm = <K extends keyof typeof form>(key: K, value: typeof form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 3. UI View State
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter lists constants
  const categories = ['Semua', 'Kegiatan', 'Iuran', 'Keamanan', 'Umum', 'Darurat'];
  
  const getAnnouncementYear = (date: string) => {
    const parsedYear = new Date(date).getFullYear();
    if (!Number.isNaN(parsedYear)) return String(parsedYear);
    return date.match(/\d{4}/)?.[0] || '';
  };
  
  const years = Array.from(new Set(announcements.map((a) => getAnnouncementYear(a.date)).filter(Boolean)))
    .sort((a, b) => Number(b) - Number(a));

  const filteredAnnouncements = announcements
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        a.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        getAnnouncementYear(a.date).includes(filters.search.trim());
      const matchesCategory = filters.category === 'Semua' || a.category === filters.category;
      const matchesYear = filters.year === 'Semua' || getAnnouncementYear(a.date) === filters.year;
      return matchesSearch && matchesCategory && matchesYear;
    })
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleEditClick = (announcement: Announcement) => {
    setEditingId(announcement.id);
    setForm({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      isPinned: announcement.isPinned,
      author: announcement.author,
      imageFile: null, // File baru
    });
    setShowAddForm(true);
  };

  const closeForm = () => {
    setForm({
      title: '',
      content: '',
      category: 'Umum',
      isPinned: false,
      author: 'Ketua RT (Bp. Hendra)',
      imageFile: null,
    });
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert('Harap isi judul dan konten pengumuman.');
      return;
    }

    try {
      if (editingId && onEditAnnouncement) {
        await onEditAnnouncement(editingId, {
          title: form.title,
          content: form.content,
          category: form.category,
          author: form.author,
          isPinned: form.isPinned,
          ...(form.imageFile ? { imageAlt: `${form.title} - dokumentasi kegiatan RT 002` } : {}),
        }, form.imageFile);
      } else {
        await onAddAnnouncement({
          title: form.title,
          content: form.content,
          category: form.category,
          author: form.author,
          isPinned: form.isPinned,
          ...(form.imageFile ? { imageAlt: `${form.title} - dokumentasi kegiatan RT 002` } : {}),
        }, form.imageFile || undefined);
      }
      
      // Reset form on success
      setForm({
        title: '',
        content: '',
        category: 'Umum',
        isPinned: false,
        author: 'Ketua RT (Bp. Hendra)',
        imageFile: null,
      });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Failed to submit form', error);
      alert('Terjadi kesalahan saat menyimpan pengumuman. Pastikan backend berjalan dan periksa koneksi.');
    }
  };

  return {
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
  };
}
