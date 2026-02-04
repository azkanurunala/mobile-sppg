import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Provinces</h1>
          <p className="text-gray-500">Manage administrative data for Provinces</p>
        </div>
        <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Total: {provinces.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Regencies Count</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {provinces.map((province) => (
              <tr key={province.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{province.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{province.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">{province._count.regencies}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link 
                    href={`/admin/master/regencies?provinceId=${province.id}`}
                    className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                  >
                    View Regencies <ChevronRight size={16} />
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
