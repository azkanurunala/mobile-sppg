'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, ExternalLink } from 'lucide-react';
import { SPPGModal } from './SPPGModal';
import { deleteSPPG, getLocationChildren } from './actions';
import { getSppgStatusLabel } from '@/lib/constants/sppg-status';
import { DataTable, Column } from '@/components/DataTable';
import { SearchableSelect } from '@/components/SearchableSelect';

interface SPPGClientProps {
  sppgs: any[];
  investors: any[];
  provinces: any[];
}

export function SPPGClient({ sppgs: initialSppgs, investors, provinces }: SPPGClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSppg, setSelectedSppg] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Region Filters State
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [selectedRegency, setSelectedRegency] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedVillage, setSelectedVillage] = useState<string>('');

  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  // Fetch Regencies when Province changes
  useEffect(() => {
    if (selectedProvince) {
      getLocationChildren(selectedProvince, 'regencies').then(setRegencies);
    } else {
      setRegencies([]);
    }
    setSelectedRegency('');
    setSelectedDistrict('');
    setSelectedVillage('');
    setDistricts([]);
    setVillages([]);
  }, [selectedProvince]);

  // Fetch Districts when Regency changes
  useEffect(() => {
    if (selectedRegency) {
      getLocationChildren(selectedRegency, 'districts').then(setDistricts);
    } else {
      setDistricts([]);
    }
    setSelectedDistrict('');
    setSelectedVillage('');
    setVillages([]);
  }, [selectedRegency]);

  // Fetch Villages when District changes
  useEffect(() => {
    if (selectedDistrict) {
      getLocationChildren(selectedDistrict, 'villages').then(setVillages);
    } else {
      setVillages([]);
    }
    setSelectedVillage('');
  }, [selectedDistrict]);

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
          <span className="text-[10px] text-gray-500 mt-0.5">Updated: {new Date(sppg.updatedAt).toLocaleDateString('en-GB')}</span>
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
      accessorKey: 'statusId',
      sortable: true,
      cell: (sppg) => (
        <div className="flex flex-col items-start min-w-[150px]">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusColor(sppg.statusId)}`}>
            {getSppgStatusLabel(sppg.statusId)}
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
      field: 'statusId',
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

  const filteredData = useMemo(() => {
    const data = initialSppgs.filter(sppg => {
      // Helper to get location IDs, falling back to nested relations if snapshot is missing
      const pId = sppg.provinceId || sppg.village?.district?.regency?.provinceId;
      const rId = sppg.regencyId || sppg.village?.district?.regencyId;
      const dId = sppg.districtId || sppg.village?.districtId;
      const vId = sppg.villageId;

      if (selectedProvince && pId !== selectedProvince) return false;
      if (selectedRegency && rId !== selectedRegency) return false;
      if (selectedDistrict && dId !== selectedDistrict) return false;
      if (selectedVillage && vId !== selectedVillage) return false;
      
      return true;
    });
    
    // Debug: Log filter statistics
    if (selectedProvince || selectedRegency || selectedDistrict || selectedVillage) {
        console.log(`[Filter Debug] Total: ${initialSppgs.length}, Matches: ${data.length}`);
        if (data.length === 0 && initialSppgs.length > 0) {
            console.log(`[Filter Debug] First item check:`, {
                id: initialSppgs[0].id,
                pId: initialSppgs[0].provinceId || initialSppgs[0].village?.district?.regency?.provinceId,
                selectedProvince
            });
        }
    }
    
    return data;
  }, [initialSppgs, selectedProvince, selectedRegency, selectedDistrict, selectedVillage]);

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

      {/* Region Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <SearchableSelect
          placeholder="Filter Province"
          options={[{ label: 'All Provinces', value: '' }, ...provinces.map(p => ({ label: p.name, value: p.id }))]}
          value={selectedProvince}
          onChange={(val) => setSelectedProvince(String(val))}
        />
        <SearchableSelect
          placeholder="Filter Regency"
          options={[{ label: 'All Regencies', value: '' }, ...regencies.map(r => ({ label: r.name, value: r.id }))]}
          value={selectedRegency}
          onChange={(val) => setSelectedRegency(String(val))}
          disabled={!selectedProvince}
        />
        <SearchableSelect
          placeholder="Filter District"
          options={[{ label: 'All Districts', value: '' }, ...districts.map(d => ({ label: d.name, value: d.id }))]}
          value={selectedDistrict}
          onChange={(val) => setSelectedDistrict(String(val))}
          disabled={!selectedRegency}
        />
        <SearchableSelect
          placeholder="Filter Village"
          options={[{ label: 'All Villages', value: '' }, ...villages.map(v => ({ label: v.name, value: v.id }))]}
          value={selectedVillage}
          onChange={(val) => setSelectedVillage(String(val))}
          disabled={!selectedDistrict}
        />
      </div>

      <DataTable
        data={filteredData}
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

