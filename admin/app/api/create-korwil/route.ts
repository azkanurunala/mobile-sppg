
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Find all regencies starting with 'Kota'
    const kotaRegencies = await prisma.regency.findMany({
        where: {
            name: { startsWith: 'Kota', mode: 'insensitive' }
        },
        select: { id: true }
    });
    const kotaIds = kotaRegencies.map(r => r.id);

    const groupByRegency = await prisma.sPPG.groupBy({
      by: ['regencyId'],
      _count: {
        id: true
      },
      where: {
          regencyId: { in: kotaIds }
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      },
      take: 1
    });
  
    if (groupByRegency.length === 0) {
      return NextResponse.json({ success: false, error: 'No SPPGs found in any KOTA.' });
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
  
    // Create User 2
    const email = 'azkaidgw@gmail.com';
    const password = 'sPp6M136B6N&#';
    const name = 'Korwil Azka Idegewe';
    const phone = '082298422231';
    const nik = 'KORWIL_AZKA_IDEGEWE_NIK';
    
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
          nik: nik, 
          assignedRegencyId: regency.id,
          position: 'Koordinator Wilayah Kota',
      },
      create: {
          userId: user.id,
          nik: nik,
          assignedRegencyId: regency.id,
          position: 'Koordinator Wilayah Kota'
      }
    });

    return NextResponse.json({
      success: true,
      message: `Created KORWIL ${name} for ${regency.name} (${count} SPPGs).`,
      details: {
          email,
          regency: regency.name,
          provinsi: regency.province.name,
          sppgCount: count
      }
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
