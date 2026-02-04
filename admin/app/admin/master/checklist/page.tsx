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
        <form action={createChecklistItem} className="flex flex-col gap-2 bg-white p-4 rounded-lg shadow border border-gray-100">
            <div className="flex gap-2">
                <input name="key" placeholder="Key (e.g. foundation)" className="border p-2 rounded flex-1" required />
                <input name="name" placeholder="Name (e.g. Pondasi)" className="border p-2 rounded flex-1" required />
                <input name="weight" type="number" step="0.1" placeholder="Weight (%)" className="border p-2 rounded w-28" required />
            </div>
            <div className="flex gap-2">
                <textarea name="description" placeholder="Description (e.g. Pondasi bangunan selesai...)" className="border p-2 rounded flex-1" rows={1}></textarea>
                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 h-fit self-end">Add Item</button>
            </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key / Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Weight</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-mono text-blue-600 bg-blue-50 px-1 inline-block rounded">{item.key}</div>
                    <div className="text-sm font-medium text-gray-900 mt-1">{item.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description || '-'}</td>
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
