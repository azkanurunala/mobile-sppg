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
  const nik = formData.get('nik') as string;
  const degree = formData.get('degree') as string;
  const role = formData.get('role') as any;
  const provinceId = formData.get('provinceId') as string;
  const regencyId = formData.get('regencyId') as string;

  try {
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber: phoneNumber || null,
        nik: nik || null,
        degree: degree || null,
        role: role || 'USER',
        provinceId: role === 'KAREG' ? provinceId : null,
        regencyId: role === 'KORWIL' ? regencyId : null,
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
  const nik = formData.get('nik') as string;
  const degree = formData.get('degree') as string;
  const role = formData.get('role') as any;
  const provinceId = formData.get('provinceId') as string;
  const regencyId = formData.get('regencyId') as string;

  try {
    const data: any = {
      name,
      email,
      phoneNumber: phoneNumber || null,
      nik: nik || null,
      degree: degree || null,
      role: role || 'USER',
      provinceId: role === 'KAREG' ? provinceId : null,
      regencyId: role === 'KORWIL' ? regencyId : null,
    };

    if (password) {
      data.password = await bcrypt.hash(password, 10);
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
