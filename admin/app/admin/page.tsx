import { prisma } from '@/lib/prisma';

export default async function AdminDashboard() {
  const sppgCount = await prisma.sPPG.count();
  const investorCount = await prisma.investor.count();
  const userCount = await prisma.user.count();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total SPPG</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{sppgCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Investor</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{investorCount}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm font-medium uppercase">Total Users</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{userCount}</p>
        </div>
     </div>
    </div>
  );
}
