'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, Mail, Phone, Building2, User as UserIcon, Search } from 'lucide-react';
import { InvestorModal } from './InvestorModal';
import { deleteInvestor } from './actions';

interface InvestorClientProps {
  investors: any[];
}

export function InvestorClient({ investors: initialInvestors }: InvestorClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredInvestors = initialInvestors.filter(inv => 
    inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
          <p className="text-gray-500 mt-1">Manage and assign investors for SPPG units.</p>
        </div>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
        >
          <Plus size={20} />
          <span className="font-semibold">Add Investor</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                    type="text"
                    placeholder="Search by name or code..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
            </div>
            <div className="ml-4 text-sm text-gray-500 font-medium">
                Total: {filteredInvestors.length} Investors
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Identity</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredInvestors.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className={`p-2 rounded-lg mr-3 ${inv.type === 'Perusahaan' ? 'bg-indigo-50 text-indigo-600' : 'bg-orange-50 text-orange-600'}`}>
                            {inv.type === 'Perusahaan' ? <Building2 size={20} /> : <UserIcon size={20} />}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{inv.name}</div>
                            <div className="text-xs text-gray-500 font-mono mt-0.5">{inv.id}</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.type === 'Perusahaan' 
                        ? 'bg-indigo-100 text-indigo-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {inv.type}
                    </span>
                    {inv.nik && <div className="text-[10px] text-gray-400 mt-1 font-mono">NIK: {inv.nik}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                        {inv.email && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Mail size={12} className="mr-2 text-gray-400" />
                                {inv.email}
                            </div>
                        )}
                        {inv.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                                <Phone size={12} className="mr-2 text-gray-400" />
                                {inv.phone}
                            </div>
                        )}
                        {!inv.email && !inv.phone && <span className="text-xs italic text-gray-400">No contact info</span>}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(inv)}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Investor"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(inv.id)}
                        disabled={loading === inv.id}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Investor"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvestors.length === 0 && (
                  <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                          <Building2 size={40} className="mx-auto mb-2 opacity-20" />
                          <p>No investors found.</p>
                      </td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InvestorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        investor={selectedInvestor}
      />
    </div>
  );
}
