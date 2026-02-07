
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    const sppg = await prisma.sPPG.findUnique({
      where: { id },
      include: {
        investor: true,
        status: true,
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

    if (!sppg) {
      return NextResponse.json({ error: 'SPPG not found' }, { status: 404 });
    }

    // Format details
    const data = {
        id: sppg.id,
        code: sppg.id,
        status: sppg.status?.name,
        preparationPercent: sppg.preparationPercent,
        lat: sppg.lat,
        long: sppg.long,
        postalCode: sppg.postalCode,
        
        investor: sppg.investor ? {
            id: sppg.investor.id,
            name: sppg.investor.name,
            code: sppg.investor.investorCode,
            type: sppg.investor.type,
            email: sppg.investor.email,
            phone: sppg.investor.phone,
        } : null,

        location: sppg.village ? {
            village: sppg.village.name,
            district: sppg.village.district.name,
            regency: sppg.village.district.regency.name,
            province: sppg.village.district.regency.province.name,
            postalCode: sppg.village.postalCode
        } : null,
        
        // Include raw location names if relation broken but snapshot exists
        snapshot: {
            province: sppg.provinceName,
            regency: sppg.regencyName,
            district: sppg.districtName,
            village: sppg.villageName
        }
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching SPPG details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
