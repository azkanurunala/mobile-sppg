
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, UserPayload } from '@/lib/jwt';

export async function GET(request: Request) {
  try {
    // 1. Auth Check (Optional but recommended to filter by assigned area if Korwil)
    // For now, return generic stats or mock stats based on user context if needed.
    // The mobile dashboard shows "Total SPPG", "Status Breakdown", "Progress Rata-rata".
    
    // Check user role/context
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
    
    let assignedRegencyId = user?.korwilProfile?.assignedRegencyId;

    // Define filter based on assigned Regency (if strict scoping is needed)
    // Mobile requirement says "1:1 with admin", implying Korwil sees their area.
    const whereClause: any = {};
    if (assignedRegencyId) {
        // Filter SPPG where village -> district -> regencyId matches
        whereClause.village = {
            district: {
                regencyId: assignedRegencyId
            }
        };
    }

    // 2. Aggregate Data
    const totalSPPG = await prisma.sPPG.count({ where: whereClause });
    
    // Status Breakdown
    const statusCounts = await prisma.sPPG.groupBy({
        by: ['statusId'],
        where: whereClause,
        _count: {
            id: true
        }
    });

    // Map statusId to names (Need to fetch MasterStatus manually or hardcode map if static)
    // Better to fetch master statuses to label them.
    const masterStatuses = await prisma.masterStatus.findMany();
    const statusMap = new Map(masterStatuses.map(s => [s.id, s.name]));

    const breakdown = statusCounts.map(item => ({
        statusId: item.statusId,
        statusName: statusMap.get(item.statusId || 0) || 'Unknown', // Handle null statusId
        count: item._count.id,
        // Calculate percentage later if needed by UI
    }));

    // Average Progress
    const progressAgg = await prisma.sPPG.aggregate({
        where: whereClause,
        _avg: {
            preparationPercent: true
        }
    });
    
    // Specific status counts for UI cards (Assign Investor, etc.)
    // Helper to find count by status name match or ID
    const getCountByStatus = (nameFragment: string) => {
        const status = masterStatuses.find(s => s.name.toLowerCase().includes(nameFragment.toLowerCase()));
        if (!status) return 0;
        const found = breakdown.find(b => b.statusId === status.id);
        return found ? found.count : 0;
    };

    return NextResponse.json({
        totalSPPG,
        averageProgress: Math.round(progressAgg._avg.preparationPercent || 0),
        breakdown,
        summary: {
            assignInvestor: getCountByStatus('Assign'),
            dokumenPendaftaran: getCountByStatus('Dokumen'),
            prosesPersiapan: getCountByStatus('Persiapan'), // Might match multiple, be careful
            validasiData: getCountByStatus('Validasi Data Persiapan'),
            appraisal: getCountByStatus('Appraisal'),
            perjanjianSewa: getCountByStatus('Perjanjian'),
        }
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
