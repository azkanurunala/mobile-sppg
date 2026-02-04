import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_aRVCIYtq5O7f@ep-falling-dawn-a17abuc3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

// Helper to normalize phone numbers
const normalizePhone = (phone: string) => {
  if (!phone) return null
  const clean = phone.replace(/[^0-9]/g, '')
  if (clean.startsWith('62')) return `0${clean.substring(2)}`
  return clean
}

// Master Data Definitions
const masterChecklistData = [
  { key: 'ownership_proof', name: 'Bukti beli / sewa', description: 'Bukti beli / sewa tersedia dan valid', weight: 10.0 },
  { key: 'foundation', name: 'Pondasi', description: 'Pondasi bangunan selesai dan terdokumentasi', weight: 12.0 },
  { key: 'walls', name: 'Dinding', description: 'Dinding bangunan selesai dan terdokumentasi', weight: 12.0 },
  { key: 'roof', name: 'Atap', description: 'Atap bangunan selesai dan terdokumentasi', weight: 12.0 },
  { key: 'floor_ceiling', name: 'Lantai & Plafon', description: 'Lantai & plafon selesai dan terdokumentasi', weight: 12.0 },
  { key: 'finishing', name: 'Finishing', description: 'Finishing bangunan selesai dan terdokumentasi', weight: 12.0 },
  { key: 'kitchen_proof', name: 'Bukti Beli Alat Dapur', description: 'Bukti beli alat dapur / masak / makan tersedia', weight: 10.0 },
  { key: 'kitchen_equip', name: 'Alat Dapur Lengkap', description: 'Alat dapur, alat masak, dan alat makan lengkap', weight: 10.0 },
  { key: 'utilities', name: 'Instalasi Utilitas', description: 'Instalasi listrik, air dan gas berfungsi', weight: 10.0 },
]

const WILAYAH_BASE_URL = 'https://wilayah.id/api';

async function fetchJson(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return { data: [] };
  }
}

async function seedWilayah() {
  console.log('🌏 Seeding Indonesian Administrative Regions...');
  
  // Check if we already have provinces (to avoid re-fetching everything)
  const provinceCount = await prisma.province.count();
  if (provinceCount > 0) {
    console.log(`⏩ Skipping Wilayah seeding: ${provinceCount} provinces already exist.`);
    return;
  }

  // 1. Provinces
  const provincesRes = await fetchJson(`${WILAYAH_BASE_URL}/provinces.json`);
  const provinces = provincesRes.data;

  for (const province of provinces) {
    console.log(`  🔹 ${province.name}`);
    await prisma.province.upsert({
      where: { id: province.code },
      update: { name: province.name },
      create: { id: province.code, name: province.name },
    });

    // 2. Regencies
    const regenciesRes = await fetchJson(`${WILAYAH_BASE_URL}/regencies/${province.code}.json`);
    for (const regency of regenciesRes.data) {
      await prisma.regency.upsert({
        where: { id: regency.code },
        update: { name: regency.name, provinceId: province.code },
        create: { id: regency.code, name: regency.name, provinceId: province.code },
      });

      // 3. Districts
      const districtsRes = await fetchJson(`${WILAYAH_BASE_URL}/districts/${regency.code}.json`);
      for (const district of districtsRes.data) {
        await prisma.district.upsert({
          where: { id: district.code },
          update: { name: district.name, regencyId: regency.code },
          create: { id: district.code, name: district.name, regencyId: regency.code },
        });

        // 4. Villages
        const villagesRes = await fetchJson(`${WILAYAH_BASE_URL}/villages/${district.code}.json`);
        const villageOps = villagesRes.data.map((village: any) =>
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
}

async function main() {
  console.log('🌱 Starting seeding...')

  // 1. Seed Master Data Wilayah (Comprehensive)
  await seedWilayah();

  // 2. Seed Master Checklist Items
  console.log('📝 Seeding Master Checklist Items...')
  for (const item of masterChecklistData) {
    await prisma.masterChecklistItem.upsert({
        where: { key: item.key },
        update: { name: item.name, description: item.description, weight: item.weight },
        create: { key: item.key, name: item.name, description: item.description, weight: item.weight }
    })
  }
  
  // 3. Seed Investor
  await prisma.investor.upsert({
    where: { id: 'INVSMDPAIB' },
    update: {},
    create: {
      id: 'INVSMDPAIB',
      name: 'Randy Estrada Hartono',
      type: 'Individu',
      email: 'mbg.pinangunian@gmail.com',
      phone: normalizePhone('6281241932263'),
      nik: '7172042011860000',
      investorCode: 'INV-001' 
    }
  })

  // 4. Seed Users (Kareg & Korwil)
  const users = [
    { no: 1, nik: '1607164509950001', name: 'Diana Putri', degree: 'S1 - Ilmu Gizi', domilisi_kec: 'Sukarami', domisili_kab: 'Palembang', prov: 'Sumatera Selatan', jabatan: 'Kepala Regional Provinsi Sumatera Selatan', phone: '081226494420', email: 'putridiana5995@gmail.com', role: Role.KAREG },
    { no: 3, nik: '1607030703990001', name: 'Willy Al Kusari', degree: 'DIV - Teknik Energi', domilisi_kec: 'Banyuasin III', domisili_kab: 'Banyuasin', prov: 'Sumatera Selatan', jabatan: 'Koordinator Wilayah Kabupaten Banyuasin', phone: '085824796775', email: 'willyalkusari7@gmail.com', role: Role.KORWIL },
    { no: 17, nik: '1671070602980011', name: 'Muhammad Alief Rizky', degree: 'S1 - Psikologi', domilisi_kec: 'Seberang Ulu 2', domisili_kab: 'Palembang', prov: 'Sumatera Selatan', jabatan: 'Koordinator Wilayah Kota Palembang', phone: '085266366626', email: 'muhammadaliefrizky@gmail.com', role: Role.KORWIL },
  ]

  for (const user of users) {
    const hashedPassword = await bcrypt.hash('password123', 10)
    
    // We expect regions to be seeded by seedWilayah now
    // But we need to find the IDs based on name for these specific users
    // For simplicity in this seed, we'll try to find them or fallback to old ID generation if not found
    // Actually, seedWilayah uses the official codes.
    
    // Find Province
    const province = await prisma.province.findFirst({ where: { name: { contains: user.prov, mode: 'insensitive' } } });
    const provId = province?.id || "SS"; // Fallback

    // Logic for Korwil vs Kareg
    if (user.role === Role.KORWIL) {
        // Find Regency for Korwil
        const cleanRegName = user.jabatan.replace('Koordinator Wilayah', '').replace('Kabupaten', '').replace('Kota', '').trim()
        const regency = await prisma.regency.findFirst({ where: { name: { contains: cleanRegName, mode: 'insensitive' } } });
        const regencyId = regency?.id || (provId + "01"); // Fallback

        // Transactional create for User + Profile
        await prisma.$transaction(async (tx) => {
            // 1. Create User
            const createdUser = await tx.user.upsert({
                where: { email: user.email },
                update: {}, // Don't update basic user info if exists to avoid overwriting unrelated changes
                create: {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    phoneNumber: normalizePhone(user.phone),
                    role: user.role,
                    // Note: provinceId/regencyId are removed from User for Korwil in new schema logic? 
                    // Wait, provinceId is still there for Kareg. Korwil doesn't use it on User table anymore based on plan.
                }
            })

            // 2. Create/Update Profile
            await tx.korwilProfile.upsert({
                where: { userId: createdUser.id },
                update: {
                    assignedRegencyId: regencyId,
                    academicTitle: user.degree,
                    position: user.jabatan
                },
                create: {
                    userId: createdUser.id,
                    nik: user.nik,
                    academicTitle: user.degree,
                    position: user.jabatan,
                    assignedRegencyId: regencyId
                }
            })
        })

    } else {
        // KAREG or others
        await prisma.user.upsert({
            where: { email: user.email },
            update: {
                provinceId: provId,
            },
            create: {
                name: user.name,
                email: user.email,
                password: hashedPassword,
                phoneNumber: normalizePhone(user.phone),
                // nik: user.nik, // Removed from User schema
                // degree: user.degree, // Removed from User schema
                role: user.role,
                provinceId: provId, 
            }
        })
    }
  }

  // 5. Seed Master Status
  console.log('📊 Seeding Master Status...')
  const masterStatuses = [
    { id: 1, name: 'Assign Investor' },
    { id: 2, name: 'Dokumen Pendaftaran' },
    { id: 3, name: 'Proses Persiapan' },
    { id: 4, name: 'Validasi Data Persiapan' },
    { id: 5, name: 'Appraisal Biaya Sewa' },
    { id: 6, name: 'Validasi Data Pendaftaran' },
    { id: 7, name: 'Perjanjian Sewa' },
  ]

  for (const status of masterStatuses) {
    await prisma.masterStatus.upsert({
      where: { id: status.id },
      update: { name: status.name },
      create: { id: status.id, name: status.name }
    })
  }

  // 6. Seed SPPG Data and Link to Checklist
  const sppgCode = "02.T.8624"
  
  const sppg = await prisma.sPPG.upsert({
      where: { id: sppgCode },
      update: {},
      create: {
          id: sppgCode,
          statusId: 1, // Assign Investor
          preparationPercent: 0,
          lat: 0, long: 0,
          investorId: 'INVSMDPAIB', 
          provinceName: "NUSA TENGGARA TIMUR",
          regencyName: "KAB. NGADA",
          districtName: "GOLEWA SELATAN",
          villageName: "BOBA"
      }
  })

  // Start Checklist Generation Logic
  console.log('🔄 Linking SPPG to Checklists...')
  const masterItems = await prisma.masterChecklistItem.findMany()
  
  for (const master of masterItems) {
      await prisma.sPPGChecklistProgress.upsert({
          where: {
              sppgId_masterItemId: {
                  sppgId: sppg.id,
                  masterItemId: master.id
              }
          },
          update: {}, // Don't reset if exists
          create: {
              sppgId: sppg.id,
              masterItemId: master.id,
              isCompleted: false
          }
      })
  }

  console.log(`✅ Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
