import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight, Filter } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Regencies</h1>
          <p className="text-gray-500">Manage administrative data for Regencies</p>
        </div>
        <div className="flex gap-4">
            <div className="text-sm text-gray-500 bg-gray-100 flex items-center px-3 py-1 rounded-full">
                <Filter size={14} className="mr-1" />
                {provinceId ? `Province: ${regencies[0]?.province.name}` : 'All Provinces'}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {regencies.length}
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Districts Count</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {regencies.map((regency) => (
              <tr key={regency.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{regency.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{regency.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{regency.province.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{regency._count.districts}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    href={`/admin/master/districts?regencyId=${regency.id}`}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                  >
                    View Districts <ChevronRight size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
