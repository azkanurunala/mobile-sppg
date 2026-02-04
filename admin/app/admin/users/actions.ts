'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import * as bcrypt from 'bcryptjs';

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete user' };
  }
}

export async function getLocationChildren(provinceId: string) {
    return prisma.regency.findMany({
        where: { provinceId },
        orderBy: { name: 'asc' }
    });
}

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const role = formData.get('role') as any;
  
  // Korwil Profile fields
  const nik = formData.get('nik') as string;
  const academicTitle = formData.get('academicTitle') as string;
  const position = formData.get('position') as string;
  const regencyId = formData.get('regencyId') as string;
  const teamId = formData.get('teamId') as string;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        role: role || 'USER',
        korwilProfile: role === 'KORWIL' ? {
          create: {
            nik,
            academicTitle: academicTitle || null,
            position: position || null,
            assignedRegencyId: regencyId || null,
            teamId: teamId || null,
          }
        } : undefined
      },
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Create User Error:', error);
    return { error: error.message || 'Failed to create user' };
  }
}

export async function updateUser(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phoneNumber = formData.get('phoneNumber') as string;
  const role = formData.get('role') as any;

  // Korwil Profile fields
  const nik = formData.get('nik') as string;
  const academicTitle = formData.get('academicTitle') as string;
  const position = formData.get('position') as string;
  const regencyId = formData.get('regencyId') as string;
  const teamId = formData.get('teamId') as string;

  try {
    const data: any = {
      name,
      email,
      phoneNumber: phoneNumber || null,
      role: role || 'USER',
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
    }
    
    // Handle Profile Update/Delete based on role
    if (role === 'KORWIL') {
      data.korwilProfile = {
        upsert: {
          create: {
            nik,
            academicTitle: academicTitle || null,
            position: position || null,
            assignedRegencyId: regencyId || null,
            teamId: teamId || null,
          },
          update: {
            nik,
            academicTitle: academicTitle || null,
            position: position || null,
            assignedRegencyId: regencyId || null,
            teamId: teamId || null,
          }
        }
      };
    } else {
      // If role changed from KORWIL to something else, we might want to delete the profile
      // But for simplicity, we'll just not update it. 
      // If the schema has onDelete: Cascade from User, it stays unless we explicitly remove.
      // However, usually it's better to keep it or delete it.
      data.korwilProfile = {
        delete: await prisma.korwilProfile.findUnique({ where: { userId: id } }) ? true : false
      };
      if (!data.korwilProfile.delete) delete data.korwilProfile;
    }
    
    await prisma.user.update({
      where: { id },
      data,
    });
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error: any) {
    console.error('Update User Error:', error);
    return { error: error.message || 'Failed to update user' };
  }
}
