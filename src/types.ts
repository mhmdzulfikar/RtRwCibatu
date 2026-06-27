/**
 * Types & Interfaces for RT 005 Community Hub
 */

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  category: 'Kegiatan' | 'Iuran' | 'Keamanan' | 'Umum' | 'Darurat';
  author: string;
  isPinned?: boolean;
  imageUrl?: string;
  imageAlt?: string;
}

export interface LetterRequest {
  id: string;
  applicantName: string;
  nik: string;
  kk: string;
  birthPlace: string;
  birthDate: string;
  gender: 'Laki-laki' | 'Perempuan';
  phone: string;
  religion: string;
  profession: string;
  address: string;
  purpose: string; // Keperluan pengajuan
  status: 'submitted' | 'processing' | 'ready' | 'rejected';
  dateRequested: string;
  referenceNo?: string; // Nomor Surat, e.g., "005/SRT-DOM/V/2026"
  rejectedReason?: string;
}

export interface FinancialTransaction {
  id: string;
  description: string;
  amount: number;
  type: 'masuk' | 'keluar';
  date: string;
  category: 'Iuran Bulanan' | 'Donasi' | 'Keamanan & Kebersihan' | 'Pembangunan' | 'Sosial' | 'Operasional RT' | 'Lainnya';
  recordedBy: string;
  rt?: string;
  rw?: string;
}

export interface CitizenDues {
  id: string;
  citizenName: string;
  houseNumber: string;
  rt?: string;
  rw?: string;
  paymentHistory: {
    [year: number]: {
      [month: string]: 'Lunas' | 'Belum' | 'Pending'; // 'Lunas' = Paid, 'Belum' = Unpaid, 'Pending' = Waiting Admin Approval
    };
  };
}

export interface DuesPaymentRequest {
  id: string;
  citizenName: string;
  houseNumber: string;
  month: string;
  year: number;
  amount: number;
  paymentMethod: string;
  transferProofUrl?: string;
  dateSubmitted: string;
  status: 'pending' | 'approved' | 'rejected';
  rt?: string;
  rw?: string;
}

export interface AuthenticatedUser {
  username: string;
  displayName: string;
  role: 'admin' | 'warga';
  loginTime: string;
  sessionToken: string;
}

