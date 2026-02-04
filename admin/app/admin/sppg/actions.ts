'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteSPPG(id: string) {
  try {
    await prisma.sPPG.delete({ where: { id } })
    revalidatePath('/admin/sppg')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}

export async function createSPPG(formData: FormData) {
  const id = formData.get('id') as string // Manual ID based on schema
  const status = 'Assign Investor'

  try {
    await prisma.sPPG.create({
      data: { id, status },
    })
    revalidatePath('/admin/sppg')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}
