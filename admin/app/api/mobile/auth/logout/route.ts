
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (refreshToken) {
      // Revoke the refresh token
      await prisma.refreshToken.updateMany({
        where: { token: refreshToken },
        data: { revoked: true }
      });
      
      // Optional: Delete instead of revoke to save space
      // await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
    }

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
