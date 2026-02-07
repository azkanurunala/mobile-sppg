'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Home, Users, FileText, Settings, Database, LogOut } from 'lucide-react';

export function Sidebar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="w-64 bg-gray-900 min-h-screen text-white p-4 flex flex-col">
      <div className="flex flex-col items-center mb-10 px-2 mt-4">
        <Image 
          src="/logo-bgn.png" 
          alt="SPPG Logo" 
          width={120} 
          height={120} 
          className="mb-4 rounded-xl"
        />
        <div className="text-xl font-bold text-center">SPPG Admin</div>
        <div className="text-[10px] text-gray-400 text-center mt-1 uppercase tracking-widest">
          Satuan Pelayanan Pemenuhan Gizi
        </div>
      </div>
      <nav className="space-y-2 flex-1">
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

      <div className="mt-auto pt-4 border-t border-gray-800">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded text-red-400 hover:bg-red-400/10 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
