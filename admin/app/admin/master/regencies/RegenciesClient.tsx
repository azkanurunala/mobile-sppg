'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';

interface RegenciesClientProps {
  regencies: any[];
  provinces: any[];
  initialProvinceId?: string;
}

export function RegenciesClient({ regencies, provinces, initialProvinceId }: RegenciesClientProps) {
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
      header: 'Province',
      accessorKey: 'province.name',
      sortable: true
    },
    {
      header: 'Districts',
      accessorKey: '_count.districts',
      sortable: true,
      className: 'text-center'
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (regency) => (
        <Link 
          href={`/admin/master/districts?regencyId=${regency.id}`}
          className="text-blue-600 hover:text-blue-900 flex items-center justify-end font-medium text-xs"
        >
          View Districts <ChevronRight size={14} className="ml-1" />
        </Link>
      )
    }
  ];

  const regencyFilters = [
    {
      label: 'Province',
      field: 'provinceId',
      options: provinces.map(p => ({ label: p.name, value: p.id }))
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Regencies</h1>
          <p className="text-gray-500">Manage administrative data for Regencies</p>
        </div>
      </div>

      <DataTable
        data={regencies}
        columns={columns}
        searchFields={['id', 'name', 'province.name']}
        searchPlaceholder="Search regencies..."
        filters={regencyFilters}
      />
    </div>
  );
}
