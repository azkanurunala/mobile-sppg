const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function check() {
  try {
    const count = await prisma.province.count();
    console.log(`PROVINCE_COUNT:${count}`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
