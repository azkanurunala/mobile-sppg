import { prisma } from '@/lib/prisma';
import { ProvincesClient } from './ProvincesClient';

export default async function ProvincesPage() {
  const provinces = await prisma.province.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { regencies: true }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <ProvincesClient provinces={provinces} />
    </div>
  );
}

