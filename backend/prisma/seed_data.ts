import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const INITIAL_CITIZENS_DUES = [
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
  }
];

const INITIAL_TRANSACTIONS = [
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
  }
];

import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load .env variables
dotenv.config();

async function main() {
  console.log('Seeding dummy data...');

  // 0. Clean up mistakenly hardcoded admin if it exists
  try {
    await prisma.user.delete({ where: { username: 'admin' } });
  } catch (e) {
    // Ignore if not found
  }

  // 1. Create Admin account from .env
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const adminPasswordHash = await bcrypt.hash(adminPass, 10);

  await prisma.user.upsert({
    where: { username: adminUser },
    update: { password: adminPasswordHash },
    create: {
      username: adminUser,
      password: adminPasswordHash,
      role: 'admin',
      displayName: 'Administrator RT',
    },
  });

  // 2. Create CitizenDues & Individual User accounts
  for (const c of INITIAL_CITIZENS_DUES) {
    // Generate username like Taman Cibiru_A01 from "Blok A/01"
    const parsedHouse = c.houseNumber.replace('Blok ', '').replace('/', ''); // e.g. "A01"
    const username = `Taman Cibiru_${parsedHouse}`; // "Taman Cibiru_A01"
    const rawPassword = `warga${parsedHouse}`; // "wargaA01"
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    // Create User first
    await prisma.user.upsert({
      where: { username },
      update: {},
      create: {
        username: username,
        password: hashedPassword,
        role: 'warga',
        displayName: `Warga ${c.houseNumber} (${c.citizenName})`,
      },
    });

    // Create CitizenDues
    await prisma.citizenDues.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        citizenName: c.citizenName,
        houseNumber: c.houseNumber,
        rt: c.rt,
        rw: c.rw,
        paymentHistory: JSON.stringify(c.paymentHistory)
      }
    });
  }

  // 3. Transactions
  for (const t of INITIAL_TRANSACTIONS) {
    await prisma.financialTransaction.upsert({
      where: { id: t.id },
      update: {},
      create: t
    });
  }

  console.log('Done seeding dummy data!');
}

main().finally(() => prisma.$disconnect());
