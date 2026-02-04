import Link from 'next/link';
import { Home, Users, FileText, Settings, Database } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white p-4">
      <div className="text-xl font-bold mb-8 px-2">SPPG Admin</div>
      <nav className="space-y-2">
        <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-800">
          <Home size={20} />
          <span>Dashboard</span>
        </Link>
        <Link href="/admin/sppg" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-800">
          <FileText size={20} />
          <span>SPPG</span>
        </Link>
        <Link href="/admin/users" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-800">
          <Users size={20} />
          <span>Users</span>
        </Link>
        <Link href="/admin/investors" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-800">
          <Database size={20} />
          <span>Investors</span>
        </Link>
        <Link href="/admin/master" className="flex items-center space-x-3 px-3 py-2 rounded hover:bg-gray-800">
          <Settings size={20} />
          <span>Master Data</span>
        </Link>
      </nav>
    </div>
  );
}
