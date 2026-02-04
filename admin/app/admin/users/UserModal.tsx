'use client';

import { X, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createUser, updateUser, getLocationChildren } from './actions';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: any;
  provinces: any[];
}

export function UserModal({ isOpen, onClose, user, provinces }: UserModalProps) {
  const [loading, setLoading] = useState(false);
  const [fetchingLocations, setFetchingLocations] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState(user?.role || 'USER');

  // Cascading states
  const [selectedProvinceId, setSelectedProvinceId] = useState(user?.provinceId || user?.regency?.provinceId || '');
  const [selectedRegencyId, setSelectedRegencyId] = useState(user?.regencyId || '');
  const [regencies, setRegencies] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setRole(user.role);
        const provId = user.provinceId || user.regency?.provinceId || '';
        setSelectedProvinceId(provId);
        setSelectedRegencyId(user.regencyId || '');
        if (provId) loadRegencies(provId);
      } else {
        setRole('USER');
        setSelectedProvinceId('');
        setSelectedRegencyId('');
        setRegencies([]);
      }
    }
  }, [isOpen, user]);

  const loadRegencies = async (id: string) => {
    setFetchingLocations(true);
    const data = await getLocationChildren(id);
    setRegencies(data);
    setFetchingLocations(false);
  };

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedProvinceId(id);
    setSelectedRegencyId('');
    if (id) loadRegencies(id);
    else setRegencies([]);
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = user 
      ? await updateUser(user.id, formData)
      : await createUser(formData);

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
            {user ? 'Edit User' : 'Create New User'}
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                name="name"
                defaultValue={user?.name}
                placeholder="Full Name"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Degree (Gelar)</label>
              <input
                name="degree"
                defaultValue={user?.degree}
                placeholder="e.g. S.Kom, M.T."
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                name="email"
                type="email"
                defaultValue={user?.email}
                placeholder="email@example.com"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">NIK</label>
              <input
                name="nik"
                defaultValue={user?.nik}
                placeholder="16-digit NIK"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                name="phoneNumber"
                defaultValue={user?.phoneNumber}
                placeholder="e.g. 0812..."
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password {user && '(Leave blank to keep current)'}</label>
              <input
                name="password"
                type="password"
                placeholder="Min 6 characters"
                className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required={!user}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="USER">USER</option>
              <option value="KAREG">KAREG (Kepala Regional)</option>
              <option value="KORWIL">KORWIL (Koordinator Wilayah)</option>
              <option value="ADMIN">ADMIN</option>
              <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            </select>
          </div>

          {role === 'KAREG' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-blue-600 font-bold">Province Scope (Mandatory for KAREG)</label>
              <select
                name="provinceId"
                defaultValue={user?.provinceId || ''}
                className="w-full border-2 border-blue-200 p-2.5 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Province</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          )}

          {role === 'KORWIL' && (
            <div className="animate-in fade-in slide-in-from-top-1 duration-200 bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-3">
              <h3 className="text-sm font-bold text-blue-600 flex items-center justify-between">
                <span>Regency Scope (Mandatory for KORWIL)</span>
                {fetchingLocations && <Loader2 size={16} className="animate-spin" />}
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
                     name="regencyId"
                     value={selectedRegencyId}
                     onChange={(e) => setSelectedRegencyId(e.target.value)}
                     disabled={!selectedProvinceId}
                     className="w-full border p-2 rounded-lg bg-white text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                     required
                   >
                     <option value="">Select Regency</option>
                     {regencies.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                   </select>
                </div>
              </div>
            </div>
          )}

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
              {loading ? 'Saving...' : (user ? 'Update User' : 'Create User')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
