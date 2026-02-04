import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.user.count({ where: { role: 'KORWIL' } });
  console.log('KORWIL_COUNT:', count);
}
main().finally(() => prisma.$disconnect());
