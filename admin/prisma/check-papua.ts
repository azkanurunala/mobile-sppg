import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_aRVCIYtq5O7f@ep-falling-dawn-a17abuc3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
    }
  }
});

async function main() {
  try {
      const count = await prisma.village.count({
        where: {
          id: { startsWith: '91' }
        }
      });
      console.log(`Papua (91) Villages Count: ${count}`);
  } catch(e) { console.error(e); }
  finally { await prisma.$disconnect(); }
}

main();
