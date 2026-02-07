import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function check() {
  try {
    const investorCount = await prisma.investor.count();
    const sppgCount = await prisma.sPPG.count();
    console.log(`STATS: Investor Count: ${investorCount}, SPPG Count: ${sppgCount}`);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}
check();
