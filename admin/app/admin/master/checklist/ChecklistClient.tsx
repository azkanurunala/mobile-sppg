'use client';

import { Trash2 } from 'lucide-react';
import { DataTable, Column } from '@/components/DataTable';
import { createChecklistItem, deleteChecklistItem } from './actions';
import { useState, useEffect } from 'react';

interface ChecklistClientProps {
  items: any[];
  nextKey: string;
}

export function ChecklistClient({ items, nextKey }: ChecklistClientProps) {
  const [keyInput, setKeyInput] = useState(nextKey);

  // Sync state if nextKey changes from server revalidation
  useEffect(() => {
    setKeyInput(nextKey);
  }, [nextKey]);

  const columns: Column<any>[] = [
    {
      header: 'Key Code',
      accessorKey: 'key',
      sortable: true,
      cell: (item) => (
        <div className="text-[12px] font-mono text-blue-700 bg-blue-50 px-2 py-1 inline-block rounded uppercase font-bold tracking-wide border border-blue-100">
          {item.key}
        </div>
      )
    },
    {
      header: 'Display Name',
      accessorKey: 'name',
      sortable: true,
      cell: (item) => (
        <div className="text-sm font-bold text-gray-900">{item.name}</div>
      )
    },
    {
      header: 'Description',
      accessorKey: 'description',
      sortable: true,
      className: 'min-w-[300px]',
      cell: (item) => (
        <div className="text-sm text-gray-600 whitespace-pre-wrap">
          {item.description || '-'}
        </div>
      )
    },
    {
      header: 'Weight',
      accessorKey: 'weight',
      sortable: true,
      cell: (item) => (
        <div className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded inline-block">{item.weight}%</div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (item) => (
        <div className="flex justify-end">
          <form action={async () => {
            if (confirm(`Delete item "${item.name}"?`)) {
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
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Checklist Master Data</h1>
          <p className="text-gray-500">Manage standard construction checklist items and weights for SPPG.</p>
        </div>
        
        <form 
          action={async (formData) => {
            await createChecklistItem(formData);
            // We assume successful creation triggers revalidation which updates `nextKey` prop
            // But for instant feedback we can't easily guess next key without server roundtrip
            // The useEffect will handle update when page reloads data
          }} 
          className="flex flex-col bg-white p-5 rounded-xl shadow-sm border border-gray-200 gap-4"
        >
          <div className="flex items-center gap-2 mb-2">
             <div className="text-sm font-bold text-gray-900">Add New Checklist Item</div>
             <div className="h-px bg-gray-100 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Key Field */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Code</label>
              <input 
                name="key" 
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="011_KEY_NAME" 
                className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-mono" 
                required 
              />
              <p className="text-[10px] text-gray-400">Auto-generated prefix based on last item.</p>
            </div>

            {/* Name Field */}
            <div className="col-span-1 md:col-span-3 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Display Name</label>
              <input 
                name="name" 
                placeholder="e.g. Instalasi Air Bersih" 
                className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required 
              />
            </div>

            {/* Weight Field */}
            <div className="col-span-1 md:col-span-2 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Weight (%)</label>
              <input 
                name="weight" 
                type="number" 
                step="0.1" 
                placeholder="e.g. 5.0" 
                className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
                required 
              />
            </div>

             {/* Description Field */}
             <div className="col-span-1 md:col-span-4 flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Description</label>
              <input 
                name="description" 
                placeholder="e.g. Pemasangan pipa air bersih dan kran..." 
                className="border border-gray-300 p-2.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" 
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2">
              <span>+ Add Item To List</span>
            </button>
          </div>
        </form>
      </div>

      <DataTable
        data={items}
        columns={columns}
        searchFields={['key', 'name', 'description']}
        searchPlaceholder="Search key, name, or description..."
      />
    </div>
  );
}

