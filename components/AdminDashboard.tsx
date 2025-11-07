import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white pt-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">Dasbor Admin</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Kelola Guru</h2>
          <p className="text-slate-400">Tambah, edit, atau hapus data guru.</p>
        </div>
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Kelola Siswa</h2>
          <p className="text-slate-400">Tambah, edit, atau hapus data siswa.</p>
        </div>
        <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
          <h2 className="text-xl font-semibold text-cyan-400 mb-2">Kelola Mata Pelajaran</h2>
          <p className="text-slate-400">Atur mata pelajaran yang tersedia.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
