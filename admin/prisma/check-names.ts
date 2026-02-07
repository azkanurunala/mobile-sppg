
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const regency = await prisma.regency.findFirst({
    where: { name: { contains: 'NGADA' } }
  });
  console.log('Sample Regency match for "NGADA":', regency);

  const village = await prisma.village.findFirst({
    where: { name: { contains: 'BOBA' } },
    include: { district: { include: { regency: true } } }
  });
  console.log('Sample Village match for "BOBA":', JSON.stringify(village, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
