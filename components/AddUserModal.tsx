// FIX: Provide full implementation for the AddUserModal component.
import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<UserRole>('murid');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !username || !password) {
      setError('Semua kolom harus diisi.');
      return;
    }
    onAddUser({ name, username, role, password });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Tambah Pengguna Baru</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-1">Nama Pengguna</label>
            <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi</label>
            <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Peran</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500">
              <option value="murid">Murid</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-md hover:bg-cyan-400 transition-colors">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
