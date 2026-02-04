import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where = status && status !== 'Semua Status' 
      ? { status } 
      : {};

    const sppgs = await prisma.sPPG.findMany({
      where,
      include: {
        investor: true,
        village: {
          include: {
            district: {
              include: {
                regency: true
              }
            }
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // Transform to mobile friendly format
    const formatted = sppgs.map(item => ({
      id: item.id,
      code: item.id, // Using ID as code for now
      investor: item.investor?.name || 'Belum Ada Investor',
      location: item.village 
        ? `Kec. ${item.village.district.name}, ${item.village.name}`
        : 'Lokasi Belum Set',
      status: item.status || 'Assign Investor',
      preparationProgress: item.preparationPercent || 0,
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
