import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.user.count({ 
    where: { role: 'KORWIL' } 
  });
  console.log(`KORWIL_COUNT: ${count}`);
  
  if (count > 0) {
    const sample = await prisma.user.findFirst({
        where: { role: 'KORWIL' },
        include: { regency: true, province: true }
    });
    console.log('Sample Korwil:', JSON.stringify(sample, null, 2));
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
