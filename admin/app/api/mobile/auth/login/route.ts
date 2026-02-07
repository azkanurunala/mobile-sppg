
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signJwt } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, password } = body; 

    if (!phoneNumber || !password) {
        return NextResponse.json({ error: 'Phone number and password required' }, { status: 400 });
    }

    // Find user by phone number
    // Schema has phoneNumber field, and unique email. 
    // We should search by phoneNumber.
    const user = await prisma.user.findFirst({
      where: { phoneNumber },
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

    if (!user || !user.password) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Generate JWT
    const token = signJwt({ userId: user.id, role: user.role });

    // Determine location name for display
    let locationName = '';
    if (user.korwilProfile?.assignedRegency) {
        locationName = `${user.korwilProfile.assignedRegency.name}, ${user.korwilProfile.assignedRegency.province.name}`;
    }

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        location: locationName,
        nik: user.korwilProfile?.nik
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
