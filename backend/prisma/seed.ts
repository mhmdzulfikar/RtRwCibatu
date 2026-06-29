import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');
  
  const adminUsername = process.env.ADMIN_USERNAME || '4DM1NR7R3';
  const adminPassword = process.env.ADMIN_PASSWORD || 'c1B4T6C1K4R4Ng';
  const wargaUsername = process.env.WARGA_USERNAME || 'warga';
  const wargaPassword = process.env.WARGA_PASSWORD || 'warga123';

  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);
  const hashedWargaPassword = await bcrypt.hash(wargaPassword, 10);

  // Upsert Admin
  const admin = await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashedAdminPassword,
      role: 'admin',
      displayName: 'Pengurus RT 005',
    },
  });

  // Upsert Warga
  const warga = await prisma.user.upsert({
    where: { username: wargaUsername },
    update: {},
    create: {
      username: wargaUsername,
      password: hashedWargaPassword,
      role: 'warga',
      displayName: 'Warga RT 005',
    },
  });

  console.log(`Seeded users: ${admin.username} & ${warga.username}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
