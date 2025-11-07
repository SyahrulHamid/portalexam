// FIX: Provide full implementation for the LoginScreen component.
import React, { useState } from 'react';
import { User } from '../types.ts';
import { login } from '../services/api.ts';

interface LoginScreenProps {
  onLoginSuccess: (user: User) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
      <div className="w-full max-w-md bg-slate-800/70 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">Selamat Datang</h1>
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
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Contoh: murid1, guru1, admin1"
            />
          </div>
          <div>
            <label htmlFor="password"className="block text-sm font-medium text-slate-300 mb-2">
              Kata Sandi
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Kata sandi apapun"
            />
          </div>
          {error && <p className="text-sm text-red-400 text-center">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-cyan-500 text-slate-900 font-bold rounded-lg hover:bg-cyan-400 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Memuat...' : 'Masuk'}
          </button>
        </form>
         <div className="mt-4 text-center text-xs text-slate-400">
            <p>Hint: Coba gunakan `murid1`, `guru1`, atau `admin1` sebagai nama pengguna.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
