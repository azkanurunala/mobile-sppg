'use client';

import { DataTable, Column } from '@/components/DataTable';

interface VillagesClientProps {
  villages: any[];
}

export function VillagesClient({ villages }: VillagesClientProps) {
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
      header: 'District',
      accessorKey: 'district.name',
      sortable: true
    },
    {
      header: 'Postal Code',
      accessorKey: 'postalCode',
      sortable: true
    },
    {
      header: 'SPPGs',
      accessorKey: '_count.sppgs',
      sortable: true,
      className: 'text-center'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Villages</h1>
          <p className="text-gray-500">Manage administrative data for Villages</p>
        </div>
      </div>

      <DataTable
        data={villages}
        columns={columns}
        searchFields={['id', 'name', 'district.name', 'postalCode']}
        searchPlaceholder="Search villages..."
      />
    </div>
  );
}
