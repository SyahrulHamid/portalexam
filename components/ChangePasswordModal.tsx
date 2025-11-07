import React, { useState } from 'react';

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

interface ChangePasswordModalProps {
  onClose: () => void;
  onChangePassword: (oldPassword: string, newPassword: string) => Promise<{success: boolean, message: string}>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ onClose, onChangePassword }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError('Semua kolom harus diisi.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Kata sandi baru dan konfirmasi tidak cocok.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setIsLoading(true);
    try {
        const result = await onChangePassword(oldPassword, newPassword);
        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                onClose();
            }, 1500);
        } else {
            setError(result.message);
        }
    } catch (err) {
        setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white">Ubah Kata Sandi</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi Lama</label>
            <div className="relative">
              <input type={showOldPassword ? 'text' : 'password'} value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
              <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200">{showOldPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Kata Sandi Baru</label>
            <div className="relative">
              <input type={showNewPassword ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
              <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200">{showNewPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Konfirmasi Kata Sandi Baru</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
               <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400 hover:text-slate-200">{showConfirmPassword ? <EyeSlashIcon /> : <EyeIcon />}</button>
            </div>
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-green-400">{success}</p>}
          
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
            <button type="submit" disabled={isLoading} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed">
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;