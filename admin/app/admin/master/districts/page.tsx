import { prisma } from '@/lib/prisma';
import { DistrictsClient } from './DistrictsClient';

export default async function DistrictsPage(props: {
  searchParams: Promise<{ regencyId?: string }>;
}) {
  const params = await props.searchParams;
  const regencyId = params.regencyId;

  const districts = await prisma.district.findMany({
    where: regencyId ? { regencyId } : undefined,
    orderBy: { name: 'asc' },
    include: {
      regency: true,
      _count: {
        select: { villages: true }
      }
    }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <DistrictsClient districts={districts} />
    </div>
  );
}

