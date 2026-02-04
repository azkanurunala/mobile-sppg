'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteInvestor(id: string) {
  try {
    await prisma.investor.delete({ where: { id } })
    revalidatePath('/admin/investors')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}

export async function createInvestor(formData: FormData) {
  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string

  try {
    await prisma.investor.create({
      data: { id, name, type, email, phone },
    })
    revalidatePath('/admin/investors')
    return { success: true }
  } catch (error) {
    return { error: 'Failed' }
  }
}
