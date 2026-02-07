
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('📝 Seeding Master Checklist Items...');

  const items = [
    { key: 'proof_ownership', name: 'Bukti Kepemilikan', weight: 10.0, description: 'Bukti beli / sewa tersedia dan valid' },
    { key: 'foundation', name: 'Pondasi', weight: 10.0, description: 'Pondasi bangunan selesai dan terdokumentasi' },
    { key: 'walls', name: 'Dinding', weight: 10.0, description: 'Dinding bangunan selesai dan terdokumentasi' },
    { key: 'roof', name: 'Atap', weight: 10.0, description: 'Atap bangunan selesai dan terdokumentasi' },
    { key: 'floor_ceiling', name: 'Lantai & Plafon', weight: 10.0, description: 'Lantai & plafon selesai dan terdokumentasi' },
    { key: 'finishing', name: 'Finishing', weight: 10.0, description: 'Finishing bangunan selesai dan terdokumentasi' },
    { key: 'kitchen_tools_proof', name: 'Bukti Alat Dapur', weight: 10.0, description: 'Bukti beli alat dapur / masak / makan tersedia' },
    { key: 'kitchen_tools_complete', name: 'Kelengkapan Alat Dapur', weight: 10.0, description: 'Alat dapur, alat masak, dan alat makan tersedia dan lengkap' },
    { key: 'utilities', name: 'Utilitas', weight: 10.0, description: 'Instalasi listrik, cadangan listrik, air dan gas tersedia dan berfungsi' },
    { key: 'personnel', name: 'Tenaga Ahli', weight: 10.0, description: 'Data tenaga ahli gizi, akuntan, dan tenaga relawan tersedia' },
  ];

  for (const item of items) {
    await prisma.masterChecklistItem.upsert({
      where: { key: item.key },
      update: {
          name: item.name,
          weight: item.weight,
          description: item.description
      },
      create: {
          key: item.key,
          name: item.name,
          weight: item.weight,
          description: item.description
      }
    });
    console.log(`✅ Upserted: ${item.name}`);
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
