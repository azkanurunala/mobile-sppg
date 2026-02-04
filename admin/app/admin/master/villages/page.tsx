import { prisma } from '@/lib/prisma';
import { VillagesClient } from './VillagesClient';

export default async function VillagesPage(props: {
  searchParams: Promise<{ districtId?: string }>;
}) {
  const params = await props.searchParams;
  const districtId = params.districtId;

  const villages = await prisma.village.findMany({
    where: districtId ? { districtId } : undefined,
    orderBy: { name: 'asc' },
    include: {
      district: true,
      _count: {
        select: { sppgs: true }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <VillagesClient villages={villages} />
    </div>
  );
}

