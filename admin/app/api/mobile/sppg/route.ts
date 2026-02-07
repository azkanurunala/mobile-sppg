import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, UserPayload } from '@/lib/jwt';


export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && status !== 'Semua Status') {
        where.status = { name: status };
    }

    if (search) {
        where.OR = [
            { id: { contains: search, mode: 'insensitive' } },
            { investor: { name: { contains: search, mode: 'insensitive' } } }
        ];
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwt(token) as UserPayload | null;
    
    if (!decoded || !decoded.userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = decoded.userId;
    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { korwilProfile: true }
    });

    if (user?.role === 'KORWIL' && user.korwilProfile?.assignedRegencyId) {
        where.regencyId = user.korwilProfile.assignedRegencyId;
    }

    const [sppgs, total] = await Promise.all([
        prisma.sPPG.findMany({
            where,
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
            },
            orderBy: { updatedAt: 'desc' },
            skip,
            take: limit
        }),
        prisma.sPPG.count({ where })
    ]);

    // Transform to mobile friendly format
    const formatted = sppgs.map(item => {
      let villageName = item.village?.name || '';
      
      if (item.village?.district?.regency?.name) {
          const regencyName = item.village.district.regency.name;
          if (regencyName.startsWith('Kabupaten')) {
              villageName = `Desa ${villageName}`;
          } else if (regencyName.startsWith('Kota')) {
              villageName = `Kelurahan ${villageName}`;
          }
      }

      return {
        id: item.id,
        code: item.id, // Using ID as code for now
        investor: item.investor?.name || 'Belum Ada Investor',
        location: item.village 
            ? `${villageName}, Kecamatan ${item.village.district.name}, ${item.village.district.regency.name}, Provinsi ${item.village.district.regency.province.name}`
            : 'Lokasi Belum Set',
        locationDetail: item.village ? {
            village: item.village.name, // Keep original name in detail if needed, or update this too? Usually detail keeps raw data.
            district: item.village.district.name,
            regency: item.village.district.regency.name,
            // province could be fetched if included deeper or from denormalized fields
        } : null,
        status: item.status?.name || 'Assign Investor',
        preparationProgress: item.preparationPercent || 0,
        updatedAt: item.updatedAt
      };
    });

    return NextResponse.json({
        data: formatted,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

