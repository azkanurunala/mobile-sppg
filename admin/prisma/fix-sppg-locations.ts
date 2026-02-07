
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Starting SPPG Location Fix...');

  const sppgs = await prisma.sPPG.findMany({
    where: {
      OR: [
        { villageId: null },
        { provinceId: null }
      ]
    }
  });

  console.log(`ℹ️ Found ${sppgs.length} SPPGs with missing location IDs.`);

  let updatedCount = 0;
  let failedCount = 0;

  for (const sppg of sppgs) {
    if (!sppg.villageName || !sppg.districtName || !sppg.regencyName || !sppg.provinceName) {
      // console.warn(`⚠️ SPPG ${sppg.id} has missing location NAMES. Skipping.`);
      failedCount++;
      continue;
    }

    // Normaize names for matching (remove "KAB. ", "KOTA ")
    // Actually, let's try to match Village Name + District Name + Regency Name
    // The safest way is to find the Village that matches all parents.
    
    // Clean up Regency Name: "KAB. NGADA" -> "KABUPATEN NGADA" if needed, or just partial match
    // Strategy: Search for Village by name, then filter in memory or via include queries.
    // Better: Search for Village where valid.
    
    // Normalize: 
    // "KAB. X" -> "KABUPATEN X" might be needed.
    // Let's try flexible query.
    
    const cleanRegencyName = sppg.regencyName.replace('KAB. ', 'KABUPATEN ').replace('KOTA ', 'KOTA '); 
    // Note: KOTA usually doesn't change, but KAB. -> KABUPATEN is common in wilayah.id data.

    const village = await prisma.village.findFirst({
      where: {
        name: { equals: sppg.villageName, mode: 'insensitive' },
        district: {
          name: { equals: sppg.districtName, mode: 'insensitive' },
          regency: {
            name: { 
                // Try contain or exact match with transformation
                contains: sppg.regencyName.replace('KAB. ', '').replace('KOTA ', ''),
                mode: 'insensitive' 
            },
            province: {
                name: { equals: sppg.provinceName, mode: 'insensitive' }
            }
          }
        }
      },
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
    });

    if (village) {
      await prisma.sPPG.update({
        where: { id: sppg.id },
        data: {
          villageId: village.id,
          // Update snapshots with IDs as well
          districtId: village.district.id,
          regencyId: village.district.regency.id,
          provinceId: village.district.regency.province.id,
          
          // Allow updating names to match official master data if desired?
          // For now, let's look keep original names but IDs are crucial for filtering.
        }
      });
      process.stdout.write('.');
      updatedCount++;
    } else {
      // console.warn(`❌ No match for: ${sppg.villageName}, ${sppg.districtName}, ${sppg.regencyName}, ${sppg.provinceName}`);
      failedCount++;
    }
    
    if (updatedCount % 100 === 0) console.log(`\nUpdated ${updatedCount}...`);
  }

  console.log(`\n✅ Finished.`);
  console.log(`Updated: ${updatedCount}`);
  console.log(`Failed/Skipped: ${failedCount} (Likely names don't match or are empty)`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
