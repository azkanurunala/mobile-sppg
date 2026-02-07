
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { Role } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phoneNumber, password, provinceId, regencyId, role } = body;

    if (!name || !phoneNumber || !password) {
      return NextResponse.json(
        { error: 'Missing required fields: name, phoneNumber, password' },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
        where: {
            OR: [
                { email: phoneNumber + "@placeholder.com" }, // Temporary email convention for phone-only users if needed, or check phone
                { phoneNumber: phoneNumber }
            ]
        }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this phone number already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Default to USER if not specified, but mobile app implies Korwil context often. 
    // However, allowing registration usually implies starting as USER or requiring approval.
    // For now, let's allow creating a standard USER. 
    // If specific logic for Korwil is needed (linking to KorwilProfile), it should be handled here.
    
    // Construct dummy email from phone if email not provided (since schema requires email)
    const email = body.email || `${phoneNumber}@mobile-app.com`;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        phoneNumber,
        password: hashedPassword,
        role: role || Role.USER, // Default to USER
      },
    });

    // If role is KORWIL and region provided, creating profile?
    // This part is ambiguous without specific requirements, but I'll add a placeholder.
    if (role === Role.KORWIL && (regencyId || provinceId)) {
        // Create Korwil Profile logic here if needed
        // For now, keeping it simple as per "register.tsx" which just takes basic info.
    }

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        phoneNumber: newUser.phoneNumber,
        role: newUser.role,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
