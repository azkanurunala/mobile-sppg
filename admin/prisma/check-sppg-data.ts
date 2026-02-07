
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Checking SPPG Data...');
  
  const totalSPPG = await prisma.sPPG.count();
  console.log(`Total SPPGs: ${totalSPPG}`);

  const sppgsWithVillage = await prisma.sPPG.count({
    where: {
      villageId: { not: null }
    }
  });
  console.log(`SPPGs with VillageId: ${sppgsWithVillage}`);

  const sppgsWithProvinceSnapshot = await prisma.sPPG.count({
    where: {
        provinceId: { not: null }
    }
  });
  console.log(`SPPGs with ProvinceId (snapshot): ${sppgsWithProvinceSnapshot}`);

  // Fetch a sample of SPPGs with their relations
  const samples = await prisma.sPPG.findMany({
    take: 5,
    include: {
      village: {
        include: {
          district: {
            include: {
              regency: {
                include: {
                  province: true
                }
              }
            }
          }
        }
      }
    }
  });

  console.log('\n--- Sample Data ---');
  samples.forEach(sppg => {
    console.log(`ID: ${sppg.id}`);
    console.log(`  VillageId: ${sppg.villageId}`);
    console.log(`  ProvinceId (snapshot): ${sppg.provinceId}`);
    
    if (sppg.village) {
        console.log(`  [RELATION] Village: ${sppg.village.name}`);
        console.log(`  [RELATION] District: ${sppg.village.district.name}`);
        console.log(`  [RELATION] Regency: ${sppg.village.district.regency.name}`);
        console.log(`  [RELATION] Province: ${sppg.village.district.regency.province.name} (ID: ${sppg.village.district.regency.province.id})`);
    } else {
        console.log(`  [RELATION] No Village linked.`);
    }
    console.log('---');
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
