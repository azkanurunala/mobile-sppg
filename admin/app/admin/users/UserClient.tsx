'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2, User as UserIcon, Shield, Mail, Phone, Fingerprint, GraduationCap, MapPin } from 'lucide-react';
import { UserModal } from './UserModal';
import { deleteUser } from './actions';

interface UserClientProps {
  users: any[];
  provinces: any[];
  teams: any[];
}

export function UserClient({ users: initialUsers, provinces, teams }: UserClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setLoading(id);
      await deleteUser(id);
      setLoading(null);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-red-100 text-red-800 border-red-200';
      case 'ADMIN': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'KORWIL': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500">Manage administrator and field coordinator accounts</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 shadow-sm"
        >
          <Plus size={20} />
          <span>Add New User</span>
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User Identity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Personal Info</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role & Scope</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {initialUsers.length === 0 ? (
                <tr>
                   <td colSpan={4} className="px-6 py-12 text-center text-gray-500 font-medium">
                    No users found.
                  </td>
                </tr>
              ) : (
                initialUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                          <UserIcon size={20} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-gray-900">
                            {user.name} 
                            {user.korwilProfile?.academicTitle && (
                              <span className="text-gray-500 font-normal">, {user.korwilProfile.academicTitle}</span>
                            )}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center mt-0.5">
                            <Mail size={12} className="mr-1" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <div className="space-y-1">
                          <div className="text-xs text-gray-700 flex items-center">
                            <Fingerprint size={12} className="mr-1.5 text-gray-400" />
                            NIK: <span className="font-mono ml-1">{user.korwilProfile?.nik || '-'}</span>
                          </div>
                          <div className="text-xs text-gray-700 flex items-center">
                            <Phone size={12} className="mr-1.5 text-gray-400" />
                            {user.phoneNumber || '-'}
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start space-y-1.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleBadge(user.role)}`}>
                          {user.role}
                        </span>
                        {user.role === 'KORWIL' && (
                          <div className="flex flex-col space-y-1">
                            {user.korwilProfile?.assignedRegency && (
                              <div className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded flex items-center border border-blue-100 italic">
                                <MapPin size={10} className="mr-1" />
                                {user.korwilProfile.assignedRegency.name}
                              </div>
                            )}
                            {user.korwilProfile?.team && (
                              <div className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded flex items-center border border-purple-100 font-bold">
                                <Shield size={10} className="mr-1" />
                                {user.korwilProfile.team.name}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-2">
                        <button 
                          onClick={() => handleOpenEdit(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          disabled={loading === user.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Delete User"
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

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        provinces={provinces}
        teams={teams}
      />
    </div>
  );
}
