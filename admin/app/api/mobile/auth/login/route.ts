
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { identifier, phoneNumber, password } = body; 
    
    // Support both old 'phoneNumber' and new 'identifier' fields
    const loginId = identifier || phoneNumber;

    if (!loginId || !password) {
        return NextResponse.json({ error: 'Identifier (email or phone) and password required' }, { status: 400 });
    }

    // Find user by phone number or email
    const { getPhoneNumberVariations } = require('@/lib/utils');
    
    // Check if it's likely a phone number (mostly digits or starts with +)
    const isLikelyPhone = /^\+?[\d]+$/.test(loginId);
    let searchCriteria: any[] = [{ email: loginId }];
    
    if (isLikelyPhone) {
        const variations = getPhoneNumberVariations(loginId);
        searchCriteria = [
            ...searchCriteria,
            ...variations.map((v: string) => ({ phoneNumber: v }))
        ];
    } else {
        searchCriteria.push({ phoneNumber: loginId });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: searchCriteria
      },
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

    // Generate Tokens
    const accessToken = signAccessToken({ userId: user.id, role: user.role });
    const refreshToken = signRefreshToken({ userId: user.id, role: user.role });

    // Save Refresh Token to DB
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }
    });

    // Determine location name for display
    let locationName = '';
    if (user.korwilProfile?.assignedRegency) {
        locationName = `${user.korwilProfile.assignedRegency.name}, ${user.korwilProfile.assignedRegency.province.name}`;
    }

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        location: locationName,
        nik: user.korwilProfile?.nik,
        regencyId: user.korwilProfile?.assignedRegencyId,
        provinceId: user.korwilProfile?.assignedRegency?.provinceId
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
