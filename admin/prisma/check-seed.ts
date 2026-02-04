import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  const count = await prisma.province.count();
  console.log(`Current Province Count: ${count}`);
  await prisma.$disconnect();
}
check();
