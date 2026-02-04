import { prisma } from '@/lib/prisma';
import { RegenciesClient } from './RegenciesClient';

export default async function RegenciesPage(props: {
  searchParams: Promise<{ provinceId?: string }>;
}) {
  const searchParams = await props.searchParams;
  const provinceId = searchParams.provinceId;

  const regencies = await prisma.regency.findMany({
    where: provinceId ? { provinceId } : undefined,
    orderBy: { name: 'asc' },
    include: {
      province: true,
      _count: {
        select: { districts: true }
      }
    }
  });

  const provinces = await prisma.province.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-6xl mx-auto">
      <RegenciesClient 
        regencies={regencies} 
        provinces={provinces} 
        initialProvinceId={provinceId} 
      />
    </div>
  );
}

