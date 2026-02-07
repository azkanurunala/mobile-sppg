
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const provinceId = searchParams.get('provinceId');

    const where = provinceId ? { provinceId } : {};

    const regencies = await prisma.regency.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(regencies);
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
