'use client';

import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createSPPG, updateSPPG, getLocationChildren } from './actions';
import { SPPG_STATUS_OPTIONS } from '@/lib/constants/sppg-status';

interface SPPGModalProps {
  isOpen: boolean;
  onClose: () => void;
  sppg?: any;
  investors: any[];
  provinces: any[];
}

export function SPPGModal({ isOpen, onClose, sppg, investors, provinces }: SPPGModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cascading states
  const [selectedProvinceId, setSelectedProvinceId] = useState(sppg?.provinceId || '');
  const [selectedRegencyId, setSelectedRegencyId] = useState(sppg?.regencyId || '');
  const [selectedDistrictId, setSelectedDistrictId] = useState(sppg?.districtId || '');
  const [selectedVillageId, setSelectedVillageId] = useState(sppg?.villageId || '');

  const [regencies, setRegencies] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  // Initial load for editing
  useEffect(() => {
    if (isOpen && sppg) {
        setSelectedProvinceId(sppg.provinceId || '');
        setSelectedRegencyId(sppg.regencyId || '');
        setSelectedDistrictId(sppg.districtId || '');
        setSelectedVillageId(sppg.villageId || '');
        
        // Trigger loads
        if (sppg.provinceId) loadRegencies(sppg.provinceId);
        if (sppg.regencyId) loadDistricts(sppg.regencyId);
        if (sppg.districtId) loadVillages(sppg.districtId);
    } else if (isOpen) {
        // Reset for create
        setSelectedProvinceId('');
        setSelectedRegencyId('');
        setSelectedDistrictId('');
        setSelectedVillageId('');
        setRegencies([]);
        setDistricts([]);
        setVillages([]);
    }
  }, [isOpen, sppg]);

  const loadRegencies = async (id: string) => {
    setFetchingLocations(true);
    const data = await getLocationChildren(id, 'regencies');
    setRegencies(data);
    setFetchingLocations(false);
  };

  const loadDistricts = async (id: string) => {
    setFetchingLocations(true);
    const data = await getLocationChildren(id, 'districts');
    setDistricts(data);
    setFetchingLocations(false);
  };

  const loadVillages = async (id: string) => {
    setFetchingLocations(true);
    const data = await getLocationChildren(id, 'villages');
    setVillages(data);
    setFetchingLocations(false);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProvinceId(id);
    setSelectedRegencyId('');
    setSelectedDistrictId('');
    setSelectedVillageId('');
    setDistricts([]);
    setVillages([]);
    if (id) loadRegencies(id);
    else setRegencies([]);
  };

  const handleRegencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedRegencyId(id);
    setSelectedDistrictId('');
    setSelectedVillageId('');
    setVillages([]);
    if (id) loadDistricts(id);
    else setDistricts([]);
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedDistrictId(id);
    setSelectedVillageId('');
    if (id) loadVillages(id);
    else setVillages([]);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = sppg 
      ? await updateSPPG(sppg.id, formData)
      : await createSPPG(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setLoading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {sppg ? 'Edit SPPG' : 'Create New SPPG'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kode SPPG (ID)</label>
              <input
                name="id"
                defaultValue={sppg?.id}
                disabled={!!sppg}
                placeholder="e.g. SPPG-001"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                defaultValue={sppg?.status || 1}
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {SPPG_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investor</label>
            <select
              name="investorId"
              defaultValue={sppg?.investorId || ''}
              className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">Select Investor (Optional)</option>
              {investors.map((i) => (
                <option key={i.id} value={i.id}>{i.name} ({i.id})</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border">
            <h3 className="text-sm font-bold text-gray-900 flex items-center justify-between">
                <span>Location Assignment</span>
                {fetchingLocations && <Loader2 size={16} className="animate-spin text-blue-600" />}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Province</label>
                   <select
                     value={selectedProvinceId}
                     onChange={handleProvinceChange}
                     className="w-full border p-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500"
                   >
                     <option value="">Select Province</option>
                     {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Regency</label>
                   <select
                     value={selectedRegencyId}
                     onChange={handleRegencyChange}
                     disabled={!selectedProvinceId}
                     className="w-full border p-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                   >
                     <option value="">Select Regency</option>
                     {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">District</label>
                   <select
                     value={selectedDistrictId}
                     onChange={handleDistrictChange}
                     disabled={!selectedRegencyId}
                     className="w-full border p-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                   >
                     <option value="">Select District</option>
                     {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Village</label>
                   <select
                     name="villageId"
                     value={selectedVillageId}
                     onChange={(e) => setSelectedVillageId(e.target.value)}
                     disabled={!selectedDistrictId}
                     className="w-full border p-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                     required
                   >
                     <option value="">Select Village</option>
                     {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                   </select>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                name="lat"
                type="number"
                step="any"
                defaultValue={sppg?.lat}
                placeholder="-6.123"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                name="long"
                type="number"
                step="any"
                defaultValue={sppg?.long}
                placeholder="106.123"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                name="postalCode"
                defaultValue={sppg?.postalCode}
                placeholder="12345"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Saving...' : (sppg ? 'Update SPPG' : 'Create SPPG')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
