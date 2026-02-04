import { prisma } from '@/lib/prisma';
import { Filter } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Villages</h1>
          <p className="text-gray-500">Manage administrative data for Villages</p>
        </div>
        <div className="flex gap-4">
            <div className="text-sm text-gray-500 bg-gray-100 flex items-center px-3 py-1 rounded-full">
                <Filter size={14} className="mr-1" />
                {districtId ? `District: ${villages[0]?.district.name}` : 'All Districts'}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {villages.length}
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Postal Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase text-center">SPPGs</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {villages.map((village) => (
              <tr key={village.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{village.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{village.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{village.district.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{village.postalCode || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{village._count.sppgs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
