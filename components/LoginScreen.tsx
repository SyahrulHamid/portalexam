// FIX: Provide full implementation for the LoginScreen component.
import React, { useState } from 'react';
import { User } from '../types.ts';
import { login } from '../services/api.ts';

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


interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Nama pengguna dan kata sandi harus diisi.');
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(username, password);
      if (user) {
        onLoginSuccess(user);
      } else {
        setError('Nama pengguna atau kata sandi salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Selamat Datang di Portal Ujian</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
              Nama Pengguna
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Contoh: murid1, guru1, admin"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors pr-10"
                placeholder="Kata sandi"
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
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed transition-all transform hover:scale-105"
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
         <div className="mt-4 text-center text-xs text-slate-400">
            <p>Hint: Gunakan `murid1` / `guru1` / `admin`.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;