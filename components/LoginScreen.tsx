import React from 'react';
import { UserRole } from '../types';

interface LoginScreenProps {
  onLogin: (role: UserRole) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-white p-4">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">Selamat Datang di Portal Ujian</h1>
      <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-12">
        Silakan masuk sesuai dengan peran Anda untuk melanjutkan.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        {/* Admin Card */}
        <div 
          onClick={() => onLogin(UserRole.ADMIN)}
          className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg border border-slate-700 shadow-lg hover:bg-slate-700/70 hover:border-cyan-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
        >
          <h2 className="text-2xl font-semibold mb-2 text-white">Admin</h2>
          <p className="text-slate-400">Masuk untuk mengelola pengguna dan data master.</p>
        </div>

        {/* Guru Card */}
        <div 
          onClick={() => onLogin(UserRole.GURU)}
          className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg border border-slate-700 shadow-lg hover:bg-slate-700/70 hover:border-cyan-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
        >
          <h2 className="text-2xl font-semibold mb-2 text-white">Guru</h2>
          <p className="text-slate-400">Masuk untuk membuat dan mengelola ujian.</p>
        </div>

        {/* Murid Card */}
        <div 
          onClick={() => onLogin(UserRole.MURID)}
          className="bg-slate-800/50 backdrop-blur-sm p-8 rounded-lg border border-slate-700 shadow-lg hover:bg-slate-700/70 hover:border-cyan-500 transition-all duration-300 cursor-pointer transform hover:-translate-y-2"
        >
          <h2 className="text-2xl font-semibold mb-2 text-white">Murid</h2>
          <p className="text-slate-400">Masuk untuk mengerjakan ujian dan melihat hasil.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
