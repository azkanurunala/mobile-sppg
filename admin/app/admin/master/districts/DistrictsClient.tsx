'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';

interface DistrictsClientProps {
  districts: any[];
}

export function DistrictsClient({ districts }: DistrictsClientProps) {
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
      header: 'Regency',
      accessorKey: 'regency.name',
      sortable: true
    },
    {
      header: 'Villages',
      accessorKey: '_count.villages',
      sortable: true,
      className: 'text-center'
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (district) => (
        <Link 
          href={`/admin/master/villages?districtId=${district.id}`}
          className="text-blue-600 hover:text-blue-900 flex items-center justify-end font-medium text-xs"
        >
          View Villages <ChevronRight size={14} className="ml-1" />
        </Link>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Districts</h1>
          <p className="text-gray-500">Manage administrative data for Districts</p>
        </div>
      </div>

      <DataTable
        data={districts}
        columns={columns}
        searchFields={['id', 'name', 'regency.name']}
        searchPlaceholder="Search districts..."
      />
    </div>
  );
}
