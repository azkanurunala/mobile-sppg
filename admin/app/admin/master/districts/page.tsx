import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight, Filter } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Districts</h1>
          <p className="text-gray-500">Manage administrative data for Districts</p>
        </div>
        <div className="flex gap-4">
            <div className="text-sm text-gray-500 bg-gray-100 flex items-center px-3 py-1 rounded-full">
                <Filter size={14} className="mr-1" />
                {regencyId ? `Regency: ${districts[0]?.regency.name}` : 'All Regencies'}
            </div>
            <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Total: {districts.length}
            </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regency</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Villages Count</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {districts.map((district) => (
              <tr key={district.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{district.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{district.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{district.regency.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{district._count.villages}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    href={`/admin/master/villages?districtId=${district.id}`}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                  >
                    View Villages <ChevronRight size={16} />
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
