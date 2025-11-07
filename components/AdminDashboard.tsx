import React, { useState, useEffect } from 'react';
import { User } from '../types.ts';
import { fetchUsers } from '../services/api.ts';
import LoadingSpinner from './LoadingSpinner';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Gagal memuat daftar pengguna.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, []);

  const handleEditUser = (userId: string) => {
    console.log(`Edit user: ${userId}`);
    // Logika untuk edit akan ditambahkan di sini
  };

  const handleDeleteUser = (userId: string) => {
    console.log(`Delete user: ${userId}`);
    // Logika untuk hapus akan ditambahkan di sini
  };

  const renderRoleBadge = (role: 'guru' | 'murid') => {
    const baseClasses = 'px-2 py-1 text-xs font-semibold rounded-full';
    if (role === 'guru') {
      return <span className={`${baseClasses} bg-green-500/20 text-green-400`}>Guru</span>;
    }
    return <span className={`${baseClasses} bg-sky-500/20 text-sky-400`}>Siswa</span>;
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-60"><LoadingSpinner /></div>;
    }
    if (error) {
      return <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-700/50">
            <tr>
              <th scope="col" className="px-6 py-3">Nama</th>
              <th scope="col" className="px-6 py-3">ID Pengguna</th>
              <th scope="col" className="px-6 py-3">Peran</th>
              <th scope="col" className="px-6 py-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="bg-slate-800/60 border-b border-slate-700 hover:bg-slate-700/60">
                <td className="px-6 py-4 font-medium text-white">{user.name}</td>
                <td className="px-6 py-4">{user.id}</td>
                <td className="px-6 py-4">{renderRoleBadge(user.role as 'guru' | 'murid')}</td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button onClick={() => handleEditUser(user.id)} className="font-medium text-cyan-400 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteUser(user.id)} className="font-medium text-red-500 hover:underline">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Manajemen Pengguna</h1>
        <button className="px-5 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors">
          Tambah Pengguna Baru
        </button>
      </div>
      <div className="bg-slate-800/70 p-1 rounded-lg border border-slate-700 shadow-md">
        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;