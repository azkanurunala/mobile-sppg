
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const sppgs = await prisma.sPPG.findMany({
      where: {
        OR: [
          { villageId: null },
          { provinceId: null }
        ]
      }
    });

    let updatedCount = 0;
    let failedCount = 0;
    const errors: string[] = [];

    for (const sppg of sppgs) {
      if (!sppg.villageName || !sppg.districtName || !sppg.regencyName || !sppg.provinceName) {
        failedCount++;
        continue;
      }

      const village = await prisma.village.findFirst({
        where: {
          name: { equals: sppg.villageName, mode: 'insensitive' },
          district: {
            name: { equals: sppg.districtName, mode: 'insensitive' },
            regency: {
              name: { 
                  contains: sppg.regencyName?.replace('KAB. ', '').replace('KOTA ', ''),
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
            districtId: village.district.id,
            regencyId: village.district.regency.id,
            provinceId: village.district.regency.province.id,
          }
        });
        updatedCount++;
      } else {
        if (failedCount < 10) {
            errors.push(`No match for: ${sppg.id} - ${sppg.villageName}, ${sppg.districtName}, ${sppg.regencyName}`);
        }
        failedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${updatedCount} SPPGs. Failed/Skipped: ${failedCount}`,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
