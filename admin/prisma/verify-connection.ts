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
    console.log('Testing connection...');
    await prisma.$connect();
    console.log('✅ Connected successfully!');
    const count = await prisma.province.count();
    console.log(`Current Province count: ${count}`);
  } catch (e) {
    console.error('❌ Connection failed:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
