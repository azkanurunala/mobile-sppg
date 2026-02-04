'use client';

import { Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { createChecklistItem, deleteChecklistItem } from './actions';

interface ChecklistClientProps {
  items: any[];
}

export function ChecklistClient({ items }: ChecklistClientProps) {
  const columns: Column<any>[] = [
    {
      header: 'Key / Name',
      accessorKey: 'name',
      sortable: true,
      cell: (item) => (
        <div className="flex flex-col">
          <div className="text-[10px] font-mono text-blue-600 bg-blue-50 px-1 inline-block rounded w-fit uppercase">{item.key}</div>
          <div className="text-sm font-bold text-gray-900 mt-1">{item.name}</div>
        </div>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      sortable: true,
      cell: (item) => (
        <div className="text-sm text-gray-500 max-w-xs truncate" title={item.description || ''}>
          {item.description || '-'}
        </div>
      )
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      sortable: true,
      cell: (item) => (
        <div className="text-sm font-bold text-gray-900">{item.weight}%</div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <form action={async () => {
            if (confirm('Delete this item?')) {
              await deleteChecklistItem(item.id);
            }
          }}>
            <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Item">
              <Trash2 size={18} />
            </button>
          </form>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checklist Master Data</h1>
          <p className="text-gray-500">Define weighted evaluation points for SPPG progress</p>
        </div>
        
        <form 
          action={async (formData) => {
            await createChecklistItem(formData);
          }} 
          className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl shadow-sm border border-gray-100 items-end"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Key code</label>
              <input name="key" placeholder="foundation" className="border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Display Name</label>
              <input name="name" placeholder="Pondasi" className="border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Weight (%)</label>
              <input name="weight" type="number" step="0.1" placeholder="10" className="border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" required />
            </div>
            <div className="flex flex-col gap-1 col-span-2 sm:col-span-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Description</label>
              <textarea name="description" placeholder="Building foundation progress..." className="border border-gray-200 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" rows={1}></textarea>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 text-sm font-bold shadow-sm transition-all h-[38px]">
            Add Item
          </button>
        </form>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchFields={['key', 'name', 'description']}
        searchPlaceholder="Search checklist items..."
      />
    </div>
  );
}

