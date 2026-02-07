
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const { refreshToken } = await request.json();

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
    }

    // Verify token structure
    const decoded = verifyRefreshToken(refreshToken) as any;
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    // Check DB for token
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true }
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
        if (storedToken && !storedToken.revoked) {
            // Cleanup expired token
            await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        }
        return NextResponse.json({ error: 'Refresh token invalid or revoked' }, { status: 401 });
    }

    // Rotate: Revoke old, issue new
    await prisma.refreshToken.update({
        where: { id: storedToken.id },
        data: { revoked: true }
    });

    // Generate new Access and Refresh tokens
    const newAccessToken = signAccessToken({ userId: storedToken.userId, role: storedToken.user.role });
    const newRefreshToken = signRefreshToken({ userId: storedToken.userId, role: storedToken.user.role });

    // Save New Refresh Token
    await prisma.refreshToken.create({
        data: {
            token: newRefreshToken,
            userId: storedToken.userId,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
    });

    return NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    });

  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
