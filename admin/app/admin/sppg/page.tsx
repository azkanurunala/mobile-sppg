import { prisma } from '@/lib/prisma';
import { SPPGClient } from './SPPGClient';

export default async function SPPGPage() {
  const sppgs = await prisma.sPPG.findMany({
    include: { 
      investor: true,
      village: {
        include: {
          district: {
            include: {
              regency: true
            }
          }
        }
      }
    },
    orderBy: { updatedAt: 'desc' },
  });

  const investors = await prisma.investor.findMany({
    orderBy: { name: 'asc' }
  });

  const provinces = await prisma.province.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <SPPGClient 
      sppgs={sppgs} 
      investors={investors} 
      provinces={provinces} 
    />
  );
}
