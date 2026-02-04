import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

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

async function main() {
  console.log('🌱 Starting seeding...')

  // 1. Seed Master Data Wilayah (Simplified)
  const getProvinceId = (name: string) => name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2).padEnd(2, '0')
  const getRegencyId = (name: string, provId: string) => provId + name.toUpperCase().replace(/[^A-Z]/g, '').substring(0, 2).padEnd(2, '0')

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
      nik: '7172042011860000'
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
    
    // Ensure regions exist
    const provId = getProvinceId(user.prov)
    await prisma.province.upsert({
       where: { id: provId }, update: {}, create: { id: provId, name: user.prov.toUpperCase() }
    })

    let regencyId = null
    if (user.role === Role.KORWIL) {
        const cleanRegName = user.jabatan.replace('Koordinator Wilayah', '').replace('Kabupaten', '').replace('Kota', '').trim()
        regencyId = getRegencyId(cleanRegName, provId)
        
        await prisma.regency.upsert({
            where: { id: regencyId }, update: {}, 
            create: { id: regencyId, provinceId: provId, name: cleanRegName.toUpperCase() }
        })
    }

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        name: user.name,
        email: user.email,
        password: hashedPassword,
        phoneNumber: normalizePhone(user.phone),
        nik: user.nik,
        degree: user.degree,
        role: user.role,
        provinceId: user.role === Role.KAREG ? provId : provId, 
        regencyId: regencyId,
      }
    })
  }

  // 5. Seed SPPG Data and Link to Checklist
  const sppgCode = "02.T.8624"
  
  const sppg = await prisma.sPPG.upsert({
      where: { id: sppgCode },
      update: {},
      create: {
          id: sppgCode,
          status: "Assign Investor",
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
