'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Building2, User as UserIcon } from 'lucide-react';
import { InvestorModal } from './InvestorModal';
import { deleteInvestor } from './actions';
import { DataTable, Column } from '@/components/DataTable';

interface InvestorClientProps {
  investors: any[];
}

export function InvestorClient({ investors: initialInvestors }: InvestorClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleEdit = (investor: any) => {
    setSelectedInvestor(investor);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedInvestor(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this investor?')) {
      setLoading(id);
      await deleteInvestor(id);
      setLoading(null);
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'Identity',
      accessorKey: 'name',
      sortable: true,
      cell: (inv) => (
        <div className="flex items-center">
          <div className={`p-2 rounded-lg mr-3 ${inv.type === 'Perusahaan' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
            {inv.type === 'Perusahaan' ? <Building2 size={20} /> : <UserIcon size={20} />}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{inv.name}</div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">{inv.investorCode || inv.id}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (inv) => (
        <div className="flex flex-col">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border inline-block w-fit ${
            inv.type === 'Perusahaan' 
              ? 'bg-indigo-50 text-indigo-700 border-indigo-100' 
              : 'bg-orange-50 text-orange-700 border-orange-100'
          }`}>
            {inv.type}
          </span>
          {inv.nik && <div className="text-[10px] text-gray-400 mt-1 font-mono">NIK: {inv.nik}</div>}
        </div>
      )
    },
    {
      header: 'Contact',
      accessorKey: 'email',
      cell: (inv) => (
        <div className="flex flex-col space-y-1">
          {inv.email && (
            <div className="flex items-center text-xs text-gray-600">
              <Mail size={12} className="mr-2 text-gray-400" />
              {inv.email}
            </div>
          )}
          {inv.phone && (
            <div className="flex items-center text-xs text-gray-600">
              <Phone size={12} className="mr-2 text-gray-400" />
              {inv.phone}
            </div>
          )}
          {!inv.email && !inv.phone && <span className="text-[10px] italic text-gray-400">No contact info</span>}
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (inv) => (
        <div className="flex justify-end items-center space-x-2">
          <button
            onClick={(e) => { e.stopPropagation(); handleEdit(inv); }}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Investor"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); handleDelete(inv.id); }}
            disabled={loading === inv.id}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
            title="Delete Investor"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const investorFilters = [
    {
      label: 'Type',
      field: 'type',
      options: [
        { label: 'Perusahaan', value: 'Perusahaan' },
        { label: 'Individu', value: 'Individu' }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 uppercase tracking-tight">Investor Management</h1>
          <p className="text-gray-500 mt-1">Manage and assign investors for SPPG units.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span className="font-semibold text-sm">Add Investor</span>
        </button>
      </div>

      <DataTable
        data={initialInvestors}
        columns={columns}
        searchFields={['name', 'id', 'investorCode', 'email', 'phone']}
        searchPlaceholder="Search by name, code, or contact..."
        filters={investorFilters}
      />

      <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investor={selectedInvestor}
      />
    </div>
  );
}

