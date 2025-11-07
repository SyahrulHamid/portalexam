// FIX: Provide full implementation for the EditUserModal component.
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';

interface EditUserModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ user, onClose, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    username: user.username,
    role: user.role,
    nip: user.nip || '',
    subject: user.subject || '',
    nisn: user.nisn || '',
    class: user.class || '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: user.name,
      username: user.username,
      role: user.role,
      nip: user.nip || '',
      subject: user.subject || '',
      nisn: user.nisn || '',
      class: user.class || '',
    });
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, role, nip, subject, nisn, class: studentClass } = formData;
    if (!name) {
      setError('Nama Lengkap harus diisi.');
      return;
    }
    
    const updatedUser: User = { ...user, name, role };

    if (role === 'guru') {
      if (!nip || !subject) {
        setError('NIP dan Mata Pelajaran harus diisi untuk Guru.');
        return;
      }
      updatedUser.nip = nip;
      updatedUser.subject = subject;
    } else if (role === 'murid') {
      if (!nisn || !studentClass) {
        setError('NISN dan Kelas harus diisi untuk Murid.');
        return;
      }
      updatedUser.nisn = nisn;
      updatedUser.class = studentClass;
    }

    onUpdateUser(updatedUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Edit Pengguna</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Peran</label>
            <select name="role" value={formData.role} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="murid">Murid</option>
              <option value="guru">Guru</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Nama Lengkap</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          
          {formData.role === 'guru' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">NIP (username)</label>
                <input type="text" name="nip" value={formData.nip} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Mata Pelajaran</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {formData.role === 'murid' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">NISN (username)</label>
                <input type="text" name="nisn" value={formData.nisn} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Kelas</label>
                <input type="text" name="class" value={formData.class} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}
          
          {formData.role === 'admin' && (
             <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nama Pengguna (tidak dapat diubah)</label>
                <input type="text" name="username" value={formData.username} readOnly className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-500" />
             </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">Simpan Perubahan</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;