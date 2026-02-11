import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_aRVCIYtq5O7f@ep-falling-dawn-a17abuc3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
})

async function main() {
    const phone = '082298422231';
    const newPassword = 'password123';
    
    console.log(`Resetting password for user phone: ${phone}...`);
    
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { phoneNumber: phone },
                { email: phone }
            ]
        }
    });
    
    if (!user) {
        console.error('User not found!');
        return;
    }
    
    console.log(`User found: ${user.name} (${user.id})`);
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword }
    });
    
    console.log(`Password reset successfully to: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
