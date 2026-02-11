
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyJwt, UserPayload } from '@/lib/jwt';

export async function GET(request: Request) {
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        korwilProfile: {
          include: {
            assignedRegency: {
              include: {
                province: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Determine location name for display
    let locationName = '';
    let locationDetail = null;
    if (user.korwilProfile?.assignedRegency) {
        locationName = `${user.korwilProfile.assignedRegency.name}, ${user.korwilProfile.assignedRegency.province.name}`;
        locationDetail = {
            regencyId: user.korwilProfile.assignedRegency.id,
            regencyName: user.korwilProfile.assignedRegency.name,
            provinceId: user.korwilProfile.assignedRegency.province.id,
            provinceName: user.korwilProfile.assignedRegency.province.name
        };
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      location: locationName,
      locationDetail,
      nik: user.korwilProfile?.nik,
      academicTitle: user.korwilProfile?.academicTitle,
      position: user.korwilProfile?.position,
      regencyId: user.korwilProfile?.assignedRegencyId,
      provinceId: user.korwilProfile?.assignedRegency?.provinceId
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
