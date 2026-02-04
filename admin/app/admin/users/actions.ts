'use server'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to delete user' }
  }
}

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const role = formData.get('role') as any

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        role: role || 'USER',
      },
    })
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { error: 'Failed to create user' }
  }
}
