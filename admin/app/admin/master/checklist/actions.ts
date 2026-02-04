'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createChecklistItem(formData: FormData) {
  const key = formData.get('key') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const weight = parseFloat(formData.get('weight') as string);

  await prisma.masterChecklistItem.create({
    data: { key, name, description, weight },
  });

  revalidatePath('/admin/master/checklist');
}

export async function deleteChecklistItem(id: string) {
  await prisma.masterChecklistItem.delete({
    where: { id },
  });

  revalidatePath('/admin/master/checklist');
}
