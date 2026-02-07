
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, UserPayload } from '@/lib/jwt';

export async function PUT(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyJwt(token) as UserPayload | null;

    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phoneNumber, email, regencyId } = body;

    // Transactional update for User and Profile
    await prisma.$transaction(async (tx) => {
        // 1. Update basic user info
        await tx.user.update({
            where: { id: decoded.userId },
            data: {
                name, 
                phoneNumber,
                // Only update email if provided and valid. 
                // Note: Changing email might require re-verification or check uniqueness logic.
            }
        });

        // 2. Update Korwil Profile location if regencyId provided
        if (regencyId) {
            await tx.korwilProfile.update({
                where: { userId: decoded.userId },
                data: {
                    assignedRegencyId: regencyId
                }
            });
        }
    });

    return NextResponse.json({ message: 'Profile updated successfully' });

  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
