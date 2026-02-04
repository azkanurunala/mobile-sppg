import { prisma } from '@/lib/prisma';
import { deleteInvestor, createInvestor } from './actions';

export default async function InvestorsPage() {
  const investors = await prisma.investor.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Investor Management</h1>
        <form action={createInvestor} className="flex gap-2">
            <input name="id" placeholder="Kode (e.g. INV001)" className="border p-2 rounded w-32" required />
            <input name="name" placeholder="Name" className="border p-2 rounded" required />
            <select name="type" className="border p-2 rounded">
                <option value="Perusahaan">Perusahaan</option>
                <option value="Individu">Individu</option>
            </select>
            <input name="email" type="email" placeholder="Email" className="border p-2 rounded" />
            <input name="phone" placeholder="Phone" className="border p-2 rounded" />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {investors.map((item) => (
              <tr key={item.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.type}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{item.email}</div>
                    <div className="text-xs">{item.phone}</div>
                </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteInvestor.bind(null, item.id)} className="inline">
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
