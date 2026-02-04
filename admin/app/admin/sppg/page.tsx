import { prisma } from '@/lib/prisma';
import { deleteSPPG, createSPPG } from './actions';

export default async function SPPGPage() {
  const list = await prisma.sPPG.findMany({
    include: { investor: true },
    orderBy: { updatedAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">SPPG Management</h1>
        <form action={createSPPG} className="flex gap-2">
            <input name="id" placeholder="Kode SPPG (e.g. SPPG-2024-001)" className="border p-2 rounded w-64" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add SPPG</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode SPPG</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.status}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.investor?.name || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {item.preparationPercent ? `${item.preparationPercent}%` : '0%'}
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteSPPG.bind(null, item.id)} className="inline">
                        <button className="text-red-600 hover:text-red-900 ml-4">Delete</button>
                    </form>
                 </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
