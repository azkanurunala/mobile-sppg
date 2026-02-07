
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Test DB connection...');
  const count = await prisma.sPPG.count();
  console.log(`SPPG Count: ${count}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
