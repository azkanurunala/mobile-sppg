import { prisma } from '@/lib/prisma';
import { createChecklistItem, deleteChecklistItem } from './actions';

export default async function ChecklistPage() {
  const items = await prisma.masterChecklistItem.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Checklist Master Data</h1>
        <form action={createChecklistItem} className="flex gap-2">
            <input name="key" placeholder="Key (e.g. foundation)" className="border p-2 rounded" required />
            <input name="name" placeholder="Name (e.g. Pondasi)" className="border p-2 rounded" required />
            <input name="weight" type="number" step="0.1" placeholder="Weight (e.g. 10.0)" className="border p-2 rounded w-24" required />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{item.key}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.weight}%</td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteChecklistItem.bind(null, item.id)} className="inline">
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
