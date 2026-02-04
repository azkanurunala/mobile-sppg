'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, MapPin, ExternalLink, Info } from 'lucide-react';
import { SPPGModal } from './SPPGModal';
import { deleteSPPG } from './actions';
import { getSppgStatusLabel } from '@/lib/constants/sppg-status';

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">SPPG Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Investor</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status & Progress</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialSppgs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                        <Info size={48} className="text-gray-300 mb-2" />
                        <p>No SPPG records found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                initialSppgs.map((sppg) => (
                  <tr key={sppg.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900 uppercase">{sppg.id}</span>
                        <span className="text-xs text-gray-500 mt-0.5 whitespace-nowrap">Updated: {new Date(sppg.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center text-sm text-gray-900 font-medium">
                          <MapPin size={14} className="mr-1 text-red-500" />
                          {sppg.villageName || 'Unknown Village'}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 pl-5">
                          {sppg.districtName}, {sppg.regencyName}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{sppg.investor?.name || <span className="text-gray-400 italic">Not Assigned</span>}</div>
                      <div className="text-xs text-gray-500">{sppg.investorId || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                       <div className="flex flex-col items-start">
                         <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusColor(sppg.status)}`}>
                            {getSppgStatusLabel(sppg.status)}
                          </span>
                          <div className="w-full mt-2 bg-gray-100 rounded-full h-1.5 max-w-[100px]">
                            <div 
                                className="bg-blue-600 h-1.5 rounded-full" 
                                style={{ width: `${sppg.preparationPercent || 0}%` }}
                            ></div>
                          </div>
                          <span className="text-[10px] text-gray-500 mt-0.5">{sppg.preparationPercent || 0}% Complete</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <Link 
                          href={`/admin/sppg/${sppg.id}`}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <ExternalLink size={18} />
                        </Link>
                        <button 
                          onClick={() => handleOpenEdit(sppg)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit SPPG"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(sppg.id)}
                          disabled={loading === sppg.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete SPPG"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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
