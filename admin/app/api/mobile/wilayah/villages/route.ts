
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');

    const where = districtId ? { districtId } : {};

    const villages = await prisma.village.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(villages);
  } catch (error) {
    console.error('Error fetching villages:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
