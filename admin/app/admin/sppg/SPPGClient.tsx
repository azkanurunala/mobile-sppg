'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { SPPGModal } from './SPPGModal';
import { deleteSPPG } from './actions';
import { getSppgStatusLabel } from '@/lib/constants/sppg-status';
import { DataTable, Column } from '@/components/DataTable';

interface SPPGClientProps {
  sppgs: any[];
  investors: any[];
  provinces: any[];
}

export function SPPGClient({ sppgs: initialSppgs, investors, provinces }: SPPGClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSppg, setSelectedSppg] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setSelectedSppg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sppg: any) => {
    setSelectedSppg(sppg);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this SPPG?')) {
      setLoading(id);
      await deleteSPPG(id);
      setLoading(null);
    }
  };

  const getStatusColor = (status: number | null | undefined) => {
    switch (status) {
      case 1: return 'bg-yellow-100 text-yellow-800 border-yellow-200'; // Assign Investor
      case 2: return 'bg-orange-100 text-orange-800 border-orange-200'; // Dokumen Pendaftaran
      case 3: return 'bg-blue-100 text-blue-800 border-blue-200';     // Proses Persiapan
      case 4: return 'bg-purple-100 text-purple-800 border-purple-200'; // Validasi Data Persiapan
      case 5: return 'bg-teal-100 text-teal-800 border-teal-200';     // Appraisal Biaya Sewa
      case 6: return 'bg-indigo-100 text-indigo-800 border-indigo-200'; // Validasi Data Pendaftaran
      case 7: return 'bg-green-100 text-green-800 border-green-200';   // Perjanjian Sewa
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const columns: Column<any>[] = [
    {
      header: 'SPPG Info',
      accessorKey: 'id',
      sortable: true,
      cell: (sppg) => (
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-900 uppercase">{sppg.id}</span>
          <span className="text-[10px] text-gray-500 mt-0.5">Updated: {new Date(sppg.updatedAt).toLocaleDateString()}</span>
        </div>
      )
    },
    {
      header: 'Location',
      accessorKey: 'villageName',
      sortable: true,
      cell: (sppg) => (
        <div className="flex flex-col">
          <div className="flex items-center text-sm text-gray-900 font-medium">
            <MapPin size={14} className="mr-1 text-red-500" />
            {sppg.villageName || 'Unknown Village'}
          </div>
          <div className="text-[11px] text-gray-500 mt-0.5 pl-5">
            {sppg.districtName}, {sppg.regencyName}
          </div>
        </div>
      )
    },
    {
      header: 'Investor',
      accessorKey: 'investor.name',
      sortable: true,
      cell: (sppg) => (
        <div className="flex flex-col">
          <div className="text-sm text-gray-900 font-medium">{sppg.investor?.name || <span className="text-gray-400 italic">Not Assigned</span>}</div>
          <span className="text-[10px] text-gray-400 font-mono">{sppg.investor?.investorCode || ''}</span>
        </div>
      )
    },
    {
      header: 'Status & Progress',
      accessorKey: 'status',
      sortable: true,
      cell: (sppg) => (
        <div className="flex flex-col items-start min-w-[150px]">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(sppg.status)}`}>
            {getSppgStatusLabel(sppg.status)}
          </span>
          <div className="w-full mt-2 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${sppg.preparationPercent || 0}%` }}
            ></div>
          </div>
          <span className="text-[10px] text-gray-500 mt-0.5 font-medium">{sppg.preparationPercent || 0}% Complete</span>
        </div>
      )
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (sppg) => (
        <div className="flex justify-end items-center space-x-2">
          <Link 
            href={`/admin/sppg/${sppg.id}`}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="View Details"
          >
            <ExternalLink size={18} />
          </Link>
          <button 
            onClick={(e) => { e.stopPropagation(); handleOpenEdit(sppg); }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit SPPG"
          >
            <Edit size={18} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleDelete(sppg.id); }}
            disabled={loading === sppg.id}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete SPPG"
          >
            <Trash2 size={18} />
          </button>
        </div>
      )
    }
  ];

  const sppgFilters = [
    {
      label: 'Status',
      field: 'status',
      options: [
        { label: 'Assign Investor', value: '1' },
        { label: 'Pendaftaran', value: '2' },
        { label: 'Persiapan', value: '3' },
        { label: 'Validasi Persiapan', value: '4' },
        { label: 'Appraisal', value: '5' },
        { label: 'Validasi Pendaftaran', value: '6' },
        { label: 'Sewa', value: '7' }
      ]
    },
    {
      label: 'Investor',
      field: 'investorId',
      options: investors.map(i => ({ label: i.name, value: i.id }))
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SPPG Management</h1>
          <p className="text-gray-500">Manage nutritional food processing units</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={20} />
          <span>Add New SPPG</span>
        </button>
      </div>

      <DataTable
        data={initialSppgs}
        columns={columns}
        searchFields={['id', 'villageName', 'districtName', 'regencyName', 'investor.name']}
        searchPlaceholder="Search by ID, Village, or Investor..."
        filters={sppgFilters}
      />

      <SPPGModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sppg={selectedSppg}
        investors={investors}
        provinces={provinces}
      />
    </div>
  );
}

