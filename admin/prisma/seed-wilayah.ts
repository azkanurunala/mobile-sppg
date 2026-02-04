import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const BASE_URL = 'https://wilayah.id/api';

async function fetchJson(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    if (response.status === 429) {
        console.log("⚠️ Rate limited, waiting 5s...");
        await new Promise(r => setTimeout(r, 5000));
        return fetchJson(url);
    }
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function seedWilayah() {
  console.log('🌏 Starting Wilayah Seeding...');

  try {
    // 1. Fetch Provinces
    console.log('📍 Fetching Provinces...');
    const provincesRes = await fetchJson(`${BASE_URL}/provinces.json`);
    const provinces = provincesRes.data;

    for (const province of provinces) {
      console.log(`  🔹 Province: ${province.name} (${province.code})`);
      await prisma.province.upsert({
        where: { id: province.code },
        update: { name: province.name },
        create: { id: province.code, name: province.name },
      });

      // 2. Fetch Regencies
      const regenciesRes = await fetchJson(`${BASE_URL}/regencies/${province.code}.json`);
      const regencies = regenciesRes.data;

      for (const regency of regencies) {
        // console.log(`    🔸 Regency: ${regency.name} (${regency.code})`);
        await prisma.regency.upsert({
          where: { id: regency.code },
          update: { name: regency.name, provinceId: province.code },
          create: { id: regency.code, name: regency.name, provinceId: province.code },
        });

        // 3. Fetch Districts
        const districtsRes = await fetchJson(`${BASE_URL}/districts/${regency.code}.json`);
        const districts = districtsRes.data;

        for (const district of districts) {
          await prisma.district.upsert({
            where: { id: district.code },
            update: { name: district.name, regencyId: regency.code },
            create: { id: district.code, name: district.name, regencyId: regency.code },
          });

          // 4. Fetch Villages (Careful: This is the largest data set)
          // To speed up, we could use Promise.all for villages within a district
          const villagesRes = await fetchJson(`${BASE_URL}/villages/${district.code}.json`);
          const villages = villagesRes.data;

          // Process villages in batches to avoid overwhelming the DB
          const villageOps = villages.map((village: any) => 
            prisma.village.upsert({
              where: { id: village.code },
              update: { name: village.name, districtId: district.code },
              create: { id: village.code, name: village.name, districtId: district.code },
            })
          );
          await Promise.all(villageOps);
        }
      }
    }

    console.log('✅ Wilayah Seeding Completed!');
  } catch (error) {
    console.error('❌ Error seeding wilayah:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedWilayah();
