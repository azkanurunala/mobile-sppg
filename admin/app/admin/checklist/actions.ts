'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createChecklistItem(formData: FormData) {
  const key = formData.get('key') as string
  const name = formData.get('name') as string
  const weight = parseFloat(formData.get('weight') as string)

  try {
    await prisma.masterChecklistItem.create({
      data: { key, name, weight },
    })
    revalidatePath('/admin/checklist')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}

export async function deleteChecklistItem(id: string) {
  try {
    await prisma.masterChecklistItem.delete({ where: { id } })
    revalidatePath('/admin/checklist')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}
