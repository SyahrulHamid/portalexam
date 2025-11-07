// FIX: Provide full implementation for the AdminDashboard component.
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types.ts';
import { fetchUsers, addUser, updateUser, deleteUser } from '../services/api.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import AddUserModal from './AddUserModal.tsx';
import EditUserModal from './EditUserModal.tsx';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'murid' | 'guru' | 'admin'>('murid');

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Gagal memuat daftar pengguna. Silakan coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      await addUser(newUser);
      loadUsers(); // Refresh the list
    } catch (err) {
      setError('Gagal menambah pengguna.');
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser);
      loadUsers(); // Refresh the list
    } catch (err) {
      setError('Gagal memperbarui pengguna.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(userId);
        loadUsers(); // Refresh the list
      } catch (err) {
        setError('Gagal menghapus pengguna.');
      }
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const displayedUsers = users.filter(user => user.role === activeTab);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-40"><LoadingSpinner /></div>;
    }

    if (error) {
      return <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;
    }

    if (displayedUsers.length === 0) {
      return <div className="text-center text-slate-400 py-8">Belum ada {activeTab} terdaftar.</div>;
    }

    return (
       <div className="overflow-x-auto">
         <table className="w-full text-left">
           <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
             <tr>
               <th scope="col" className="px-6 py-3">Nama Lengkap</th>
               <th scope="col" className="px-6 py-3">Nama Pengguna</th>
               <th scope="col" className="px-6 py-3 text-right">Aksi</th>
             </tr>
           </thead>
           <tbody>
             {displayedUsers.map(user => (
               <tr key={user.id} className="bg-slate-800/60 border-b border-slate-700 hover:bg-slate-700/60">
                 <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                 <td className="px-6 py-4 text-slate-300">{user.username}</td>
                 <td className="px-6 py-4 text-right space-x-2">
                   <button onClick={() => openEditModal(user)} className="text-sm font-medium text-cyan-400 hover:underline">Edit</button>
                   <button onClick={() => handleDeleteUser(user.id)} className="text-sm font-medium text-red-400 hover:underline">Hapus</button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white pt-24">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">Dasbor Admin</h1>
          <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
            Tambah Pengguna
          </button>
        </div>
        
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Manajemen Pengguna</h2>
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('murid')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'murid' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Murid
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'guru' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Guru
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'admin' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>
          <div className="mt-4">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onAddUser={handleAddUser} />}
      {isEditModalOpen && selectedUser && <EditUserModal user={selectedUser} onClose={() => setIsEditModalOpen(false)} onUpdateUser={handleUpdateUser} />}
    </>
  );
};

export default AdminDashboard;