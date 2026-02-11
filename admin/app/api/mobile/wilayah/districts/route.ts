
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const regencyId = searchParams.get('regencyId');

    const where = regencyId ? { regencyId } : {};

    const districts = await prisma.district.findMany({
      where,
      orderBy: { name: 'asc' }
    });
    return NextResponse.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
