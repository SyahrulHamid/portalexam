import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';

const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.243 4.243L6.228 6.228" />
    </svg>
);

interface AddUserModalProps {
  onClose: () => void;
  onAddUser: (user: Omit<User, 'id'>) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onClose, onAddUser }) => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    role: 'murid' as UserRole,
    password: '',
    nip: '',
    subject: '',
    nisn: '',
    class: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const { name, role, password, nip, subject, nisn, class: studentClass } = formData;
    
    if (!name) {
      setError('Nama Lengkap harus diisi.');
      return;
    }
    
    let userPayload: Omit<User, 'id'>;

    if (role === 'guru') {
      if (!nip || !subject) {
        setError('NIP dan Mata Pelajaran harus diisi untuk Guru.');
        return;
      }
      userPayload = { name, role, nip, subject, username: nip }; // Password will be set to NIP in API
    } else if (role === 'murid') {
      if (!nisn || !studentClass) {
        setError('NISN dan Kelas harus diisi untuk Murid.');
        return;
      }
      userPayload = { name, role, nisn, class: studentClass, username: nisn }; // Password will be set to NISN in API
    } else { // admin
      if (!formData.username) {
        setError('Nama Pengguna harus diisi untuk Admin.');
        return;
      }
      if (!password) {
        setError('Kata Sandi harus diisi untuk Admin.');
        return;
      }
      userPayload = { name, role, password, username: formData.username };
    }
    
    onAddUser(userPayload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Tambah Pengguna Baru</h2>
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
                <label className="block text-sm font-medium text-slate-300 mb-1">NIP (akan menjadi username & password default)</label>
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
                <label className="block text-sm font-medium text-slate-300 mb-1">NISN (akan menjadi username & password default)</label>
                <input type="text" name="nisn" value={formData.nisn} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Kelas</label>
                <input type="text" name="class" value={formData.class} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </>
          )}

          {formData.role === 'admin' && (
             <>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Nama Pengguna</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi</label>
                    <div className="relative">
                        <input 
                            type={showPassword ? 'text' : 'password'}
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200" aria-label={showPassword ? "Sembunyikan" : "Tampilkan"}>
                            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                        </button>
                    </div>
                </div>
             </>
          )}
          
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">Tambah</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;