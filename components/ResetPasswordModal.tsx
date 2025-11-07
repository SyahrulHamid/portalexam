import React, { useState } from 'react';
import { User } from '../types.ts';

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

interface ResetPasswordModalProps {
  user: User;
  onClose: () => void;
  onResetPassword: (userId: number, newPassword: string) => void;
}

const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({ user, onClose, onResetPassword }) => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-2 text-white">Reset Kata Sandi</h2>
        <p className="text-slate-400 mb-6">Anda akan mereset kata sandi untuk: <span className="font-bold text-slate-200">{user.name}</span></p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="new-password"className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi Baru</label>
            <div className="relative">
                <input 
                    type={showPassword ? 'text' : 'password'} 
                    id="new-password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" 
                />
                 <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                    {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirm-password"className="block text-sm font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
                <input 
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirm-password" 
                    value={confirmPassword} 
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" 
                />
                <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200"
                    aria-label={showConfirmPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                >
                    {showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}
                </button>
            </div>
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