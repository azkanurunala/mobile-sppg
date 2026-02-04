import { prisma } from '@/lib/prisma';
import { deleteUser, createUser } from './actions';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        {/* Simple Add Form using Server Actions directly */}
        <form action={createUser} className="flex gap-2">
            <input name="name" placeholder="Name" className="border p-2 rounded" required />
            <input name="email" type="email" placeholder="Email" className="border p-2 rounded" required />
             <select name="role" className="border p-2 rounded">
                <option value="USER">User</option>
                <option value="ADMIN">Admin</option>
                <option value="KAREG">Kareg</option>
                <option value="KORWIL">Korwil</option>
            </select>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add User</button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                 <td className="px-6 py-4 whitespace-nowrap">
                   <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                     {user.role}
                   </span>
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <form action={deleteUser.bind(null, user.id)} className="inline">
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
