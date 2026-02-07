import { PrismaClient, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding Admin User...')

  // User 1: Admin Azka (Previous)
  const users = [
    {
      email: 'nurunalaazka@gmail.com',
      name: 'Admin Azka',
      phoneNumber: '085725778315',
      password: '4Dm1nsPp6M136B6N&#'
    },
    {
      email: 'admin@mobilesppg.com',
      name: 'Admin Mobile SPPG',
      phoneNumber: '085725778315',
      password: '4Dm1nsPp6M136B6N&#'
    }
  ]
  
  for (const u of users) {
    const hashedPassword = await bcrypt.hash(u.password, 10)

    const admin = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        name: u.name,
        phoneNumber: u.phoneNumber,
        password: hashedPassword,
        role: Role.ADMIN
      },
      create: {
        email: u.email,
        name: u.name,
        phoneNumber: u.phoneNumber,
        password: hashedPassword,
        role: Role.ADMIN
      }
    })
    console.log(`✅ Admin user created/updated: ${admin.email}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
