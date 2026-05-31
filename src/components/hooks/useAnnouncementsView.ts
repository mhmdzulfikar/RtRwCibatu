import { useState, FormEvent } from 'react';
import { Announcement } from '../../types';
import { isSafeHttpUrl } from '../../security';

export interface UseAnnouncementsViewProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
}

export function useAnnouncementsView({ announcements, onAddAnnouncement }: UseAnnouncementsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedYear, setSelectedYear] = useState<string>('Semua');
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<Announcement['category']>('Umum');
  const [newIsPinned, setNewIsPinned] = useState(false);
  const [newAuthor, setNewAuthor] = useState('Ketua RT (Bp. Hendra)');
  const [newImageUrl, setNewImageUrl] = useState('');

  // Filter lists
  const categories = ['Semua', 'Kegiatan', 'Iuran', 'Keamanan', 'Umum', 'Darurat'];
  
  const getAnnouncementYear = (date: string) => {
    const parsedYear = new Date(date).getFullYear();
    if (!Number.isNaN(parsedYear)) return String(parsedYear);
    const fallbackYear = date.match(/\d{4}/)?.[0];
    return fallbackYear || '';
  };
  
  const years = Array.from(new Set(announcements.map((a) => getAnnouncementYear(a.date)).filter(Boolean)))
    .sort((a, b) => Number(b) - Number(a));

  const filteredAnnouncements = announcements
    .filter((a) => {
      const matchesSearch =
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getAnnouncementYear(a.date).includes(searchTerm.trim());
      const matchesCategory = selectedCategory === 'Semua' || a.category === selectedCategory;
      const matchesYear = selectedYear === 'Semua' || getAnnouncementYear(a.date) === selectedYear;
      return matchesSearch && matchesCategory && matchesYear;
    })
    // Sort pinned to Top, then sort by date descending
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) {
      alert('Harap isi judul dan konten pengumuman.');
      return;
    }

    const trimmedImageUrl = newImageUrl.trim();
    if (trimmedImageUrl && !isSafeHttpUrl(trimmedImageUrl)) {
      alert('URL foto harus memakai alamat http atau https yang valid.');
      return;
    }

    onAddAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      author: newAuthor,
      isPinned: newIsPinned,
      ...(trimmedImageUrl
        ? {
            imageUrl: trimmedImageUrl,
            imageAlt: `${newTitle} - dokumentasi kegiatan RT 005`,
          }
        : {}),
    });

    // Reset Form
    setNewTitle('');
    setNewContent('');
    setNewCategory('Umum');
    setNewIsPinned(false);
    setNewImageUrl('');
    setShowAddForm(false);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedYear,
    setSelectedYear,
    showAddForm,
    setShowAddForm,
    selectedAnnouncement,
    setSelectedAnnouncement,
    newTitle,
    setNewTitle,
    newContent,
    setNewContent,
    newCategory,
    setNewCategory,
    newIsPinned,
    setNewIsPinned,
    newAuthor,
    setNewAuthor,
    newImageUrl,
    setNewImageUrl,
    categories,
    years,
    filteredAnnouncements,
    handleSubmit,
  };
}
