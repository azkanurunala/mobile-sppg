import { PrismaClient, Role } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import * as bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  const csvPath = path.join(__dirname, 'data-korwil.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf8');
  const lines = fileContent.split('\n');

  console.log(`🚀 Starting Korwil Seeding: ${lines.length} lines found...`);
  console.log(`🔍 Sample line 0: "${lines[0]}"`);

  const passwordHash = await bcrypt.hash('sppg123', 10);
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // Cache provinces and regencies for faster lookup
  const provinces = await prisma.province.findMany();
  const regencies = await prisma.regency.findMany();

  for (const line of lines) {
    if (!line.trim()) continue;

    const parts = line.split('\t');
    if (parts.length < 3) {
      // Try space or multiple spaces if tab split fails
      // However, CSV read showed tabs.
      continue;
    }

    const [provinceName, regencyName, fullName, phoneRaw] = parts.map(p => p.trim());
    
    if (!fullName || fullName === '.') continue;

    // Normalize phone
    let phone = phoneRaw || '';
    if (phone.includes('E+')) {
      // Handle scientific notation e.g. 8.12634E+11
      phone = Number(phone).toString();
    }
    // Ensure phone starts with 0 or 62 if needed? 
    // Usually admin adds 08...
    if (phone && !phone.startsWith('0') && !phone.startsWith('62') && !phone.startsWith('+')) {
      phone = '0' + phone;
    }

    // Normalize Regency and Province names for lookup
    const normalizeNameForSearch = (name: string | undefined) => {
      if (!name) return '';
      return name.toUpperCase()
        .replace(/^KAB\. /i, '')
        .replace(/^KOTA /i, '')
        .replace(/^KABUPATEN /i, '')
        .trim();
    };

    const searchProvince = normalizeNameForSearch(provinceName);
    const province = provinces.find(p => 
      normalizeNameForSearch(p.name) === searchProvince ||
      normalizeNameForSearch(p.name).includes(searchProvince) ||
      searchProvince.includes(normalizeNameForSearch(p.name))
    );

    if (!province) {
      console.warn(`[ROW ${successCount + skipCount + errorCount + 1}] ⚠️ Province not found: "${provinceName}"`);
      errorCount++;
      continue;
    }

    const searchRegency = normalizeNameForSearch(regencyName);
    const regency = regencies.find(r => 
      r.provinceId === province.id && 
      (normalizeNameForSearch(r.name) === searchRegency ||
       normalizeNameForSearch(r.name).includes(searchRegency) ||
       searchRegency.includes(normalizeNameForSearch(r.name)))
    );

    if (!regency) {
      console.warn(`[ROW ${successCount + skipCount + errorCount + 1}] ⚠️ Regency not found: "${regencyName}" in ${province.name}`);
      errorCount++;
      continue;
    }

    // Generate deterministic Email
    const namePart = fullName.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `korwil.${namePart}.${regency.id}@sppg.id`;

    try {
      await prisma.$transaction(async (tx: any) => {
        // 1. Upsert User
        const user = await tx.user.upsert({
          where: { email },
          update: {
            name: fullName,
            phoneNumber: phone,
            role: Role.KORWIL,
          },
          create: {
            email,
            name: fullName,
            phoneNumber: phone,
            password: passwordHash,
            role: Role.KORWIL,
          }
        });

        // 2. Upsert KorwilProfile
        // Generate a deterministic but unique NIK suffix since data source lacks NIK
        const dummyNik = `KORWIL-${regency.id}-${Date.now().toString().slice(-4)}-${Math.floor(Math.random() * 1000)}`;

        await tx.korwilProfile.upsert({
          where: { userId: user.id },
          update: {
            assignedRegencyId: regency.id,
          },
          create: {
            userId: user.id,
            nik: dummyNik,
            assignedRegencyId: regency.id,
          }
        });
      });

      successCount++;
      if (successCount % 50 === 0) console.log(`  Processed ${successCount} users...`);
    } catch (err) {
      console.error(`❌ Error upserting user ${fullName}:`, err);
      errorCount++;
    }
  }

  console.log(`\n✨ Seeding Summary:`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`⏭️ Skipped: ${skipCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
