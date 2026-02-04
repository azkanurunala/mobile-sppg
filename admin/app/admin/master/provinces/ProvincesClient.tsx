'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';

interface ProvincesClientProps {
  provinces: any[];
}

export function ProvincesClient({ provinces }: ProvincesClientProps) {
  const columns: Column<any>[] = [
    {
      header: 'ID',
      accessorKey: 'id',
      sortable: true,
      className: 'font-mono'
    },
    {
      header: 'Name',
      accessorKey: 'name',
      sortable: true,
      className: 'font-bold'
    },
    {
      header: 'Regencies',
      accessorKey: '_count.regencies',
      sortable: true,
      className: 'text-center'
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (province) => (
        <Link 
          href={`/admin/master/regencies?provinceId=${province.id}`}
          className="text-blue-600 hover:text-blue-900 flex items-center justify-end font-medium text-xs"
        >
          View Regencies <ChevronRight size={14} className="ml-1" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Provinces</h1>
          <p className="text-gray-500">Manage administrative data for Provinces</p>
        </div>
      </div>

      <DataTable
        data={provinces}
        columns={columns}
        searchFields={['id', 'name']}
        searchPlaceholder="Search provinces..."
      />
    </div>
  );
}
