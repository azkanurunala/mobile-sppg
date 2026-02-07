
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Finding Regency with most SPPGs...');

  const groupByRegency = await prisma.sPPG.groupBy({
    by: ['regencyId'],
    _count: {
      id: true
    },
    where: {
        regencyId: { not: null }
    },
    orderBy: {
      _count: {
        id: 'desc'
      }
    },
    take: 1
  });

  if (groupByRegency.length === 0) {
    console.error('❌ No SPPGs found with valid Regency ID.');
    return;
  }

  const topRegencyId = groupByRegency[0].regencyId!;
  const count = groupByRegency[0]._count.id;
  
  const regency = await prisma.regency.findUnique({
    where: { id: topRegencyId },
    include: { province: true }
  });

  if (!regency) {
    console.error(`❌ Regency ID ${topRegencyId} not found in master data.`);
    return;
  }

  console.log(`✅ Top Regency: ${regency.name} (${regency.province.name}) with ${count} SPPGs.`);

  // Create User
  const email = 'nurunalaazka@gmail.com';
  const password = 'sPp6M136B6N&#';
  const name = 'Korwil Azka';
  const phone = '085725778315';
  
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`👤 Creating User: ${name} (${email})...`);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
        password: hashedPassword,
        name,
        phoneNumber: phone,
        role: 'KORWIL'
    },
    create: {
        email,
        password: hashedPassword,
        name,
        phoneNumber: phone,
        role: 'KORWIL'
    }
  });

  // Create Profile
  console.log(`📋 Creating Korwil Profile assigned to ${regency.name}...`);
  
  await prisma.korwilProfile.upsert({
    where: { userId: user.id },
    update: {
        nik: 'KORWIL_AZKA_NIK', // Dummy NIK as it's required and unique
        assignedRegencyId: regency.id,
        position: 'Koordinator Wilayah',
    },
    create: {
        userId: user.id,
        nik: 'KORWIL_AZKA_NIK',
        assignedRegencyId: regency.id,
        position: 'Koordinator Wilayah'
    }
  });

  console.log(`🎉 Successfully created KORWIL user for ${regency.name}.`);
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
