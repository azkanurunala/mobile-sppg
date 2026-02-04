const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  try {
    const regencies = await prisma.regency.findMany({ take: 10 });
    console.log('REGENCIES:', JSON.stringify(regencies, null, 2));
    const provinces = await prisma.province.findMany({ take: 5 });
    console.log('PROVINCES:', JSON.stringify(provinces, null, 2));
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
