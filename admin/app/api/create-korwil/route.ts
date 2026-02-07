
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const groupByRegency = await prisma.sPPG.groupBy({
      by: ['regencyId'],
      _count: {
        id: true
      },
      where: {
          regencyId: { not: null }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 1
    });
  
    if (groupByRegency.length === 0) {
      return NextResponse.json({ success: false, error: 'No SPPGs found with valid Regency ID.' });
    }
  
    const topRegencyId = groupByRegency[0].regencyId!;
    const count = groupByRegency[0]._count.id;
    
    const regency = await prisma.regency.findUnique({
      where: { id: topRegencyId },
      include: { province: true }
    });
  
    if (!regency) {
        return NextResponse.json({ success: false, error: `Regency ID ${topRegencyId} not found.` });
    }
  
    // Create User
    const email = 'nurunalaazka@gmail.com';
    const password = 'sPp6M136B6N&#';
    const name = 'Korwil Azka';
    const phone = '085725778315';
    
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const user = await prisma.user.upsert({
      where: { email },
      update: {
          password: hashedPassword,
          name,
          phoneNumber: phone,
          role: 'KORWIL'
      },
      create: {
          email,
          password: hashedPassword,
          name,
          phoneNumber: phone,
          role: 'KORWIL'
      }
    });
  
    // Create Profile
    
    await prisma.korwilProfile.upsert({
      where: { userId: user.id },
      update: {
          nik: 'KORWIL_AZKA_NIK', 
          assignedRegencyId: regency.id,
          position: 'Koordinator Wilayah',
      },
      create: {
          userId: user.id,
          nik: 'KORWIL_AZKA_NIK',
          assignedRegencyId: regency.id,
          position: 'Koordinator Wilayah'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Created KORWIL ${name} for ${regency.name} (${count} SPPGs).`,
      details: {
          email,
          regency: regency.name,
          sppgCount: count
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
