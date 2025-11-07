import React, { useState } from 'react';
import { User } from '../types.ts';

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
  onResetPassword: (userId: number, newPassword: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onResetPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!password || !confirmPassword) {
      setError('Kata sandi baru dan konfirmasi harus diisi.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Kata sandi dan konfirmasi tidak cocok.');
      return;
    }

    onResetPassword(user.id, password);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-2 text-white">Reset Kata Sandi</h2>
        <p className="text-slate-400 mb-6">Anda akan mereset kata sandi untuk: <span className="font-bold text-slate-200">{user.name}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password"className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi Baru</label>
            <input 
              type="password" 
              id="new-password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>
          <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
            <input 
              type="password" 
              id="confirm-password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
            <button type="submit" className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors">Simpan Kata Sandi</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordModal;