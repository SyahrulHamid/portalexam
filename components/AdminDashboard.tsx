import React, { useState, useEffect, useCallback } from 'react';
import { User } from '../types.ts';
import { fetchUsers, addUser, updateUser, deleteUser, resetAllPasswords } from '../services/api.ts';
import LoadingSpinner from './LoadingSpinner.tsx';
import AddUserModal from './AddUserModal.tsx';
import EditUserModal from './EditUserModal.tsx';
import ResetPasswordModal from './ResetPasswordModal.tsx';
import ImportUserModal from './ImportUserModal.tsx';

interface AdminDashboardProps {
  currentUser: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'murid' | 'guru' | 'admin'>('murid');

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      setIsLoading(true);
      const fetchedUsers = await fetchUsers();
      setUsers(fetchedUsers);
    } catch (err) {
      setError('Gagal memuat daftar pengguna. Silakan coba lagi nanti.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  const handleAddUser = async (newUser: Omit<User, 'id'>) => {
    try {
      await addUser(newUser);
      loadUsers(); // Refresh the list
    } catch (err: any) {
      setError(`Gagal menambah pengguna: ${err.message}`);
    }
  };

  const handleUpdateUser = async (updatedUser: User) => {
    try {
      await updateUser(updatedUser);
      loadUsers(); // Refresh the list
    } catch (err: any) {
      setError(`Gagal memperbarui pengguna: ${err.message}`);
    }
  };
  
  const handleResetPassword = async (userId: number, newPassword: string) => {
    try {
      await updateUser({ id: userId, password: newPassword } as User);
      setIsResetPasswordModalOpen(false);
      setSelectedUser(null);
    } catch (err) {
      setError('Gagal mereset kata sandi.');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (userId === currentUser.id) {
      alert("Anda tidak dapat menghapus akun Anda sendiri.");
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      try {
        await deleteUser(userId);
        loadUsers(); // Refresh the list
      } catch (err) {
        setError('Gagal menghapus pengguna.');
      }
    }
  };

  const handleExportUsers = () => {
    const dataToExport = users.filter(user => user.role === activeTab);
    if (dataToExport.length === 0) {
        alert(`Tidak ada data ${activeTab} untuk diekspor.`);
        return;
    }

    let csvContent = "";
    let headers: string[] = [];
    let rows: string[] = [];

    if (activeTab === 'guru') {
        headers = ["Nama", "NIP", "MataPelajaran"];
        rows = dataToExport.map(user => [user.name, user.nip || '', user.subject || ''].join(','));
    } else if (activeTab === 'murid') {
        headers = ["Nama", "NISN", "Kelas"];
        rows = dataToExport.map(user => [user.name, user.nisn || '', user.class || ''].join(','));
    } else {
        return; // Do not export admins
    }
    
    csvContent += headers.join(',') + '\r\n';
    csvContent += rows.join('\r\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `export_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  };

  const handleResetAllPasswords = async () => {
      if (activeTab === 'admin') return;

      const roleName = activeTab === 'guru' ? 'Guru' : 'Murid';
      const defaultIdentifier = activeTab === 'guru' ? 'NIP' : 'NISN';
      
      const confirmMessage = `PERHATIAN!\n\nAnda akan mereset SEMUA kata sandi ${roleName}.\n\nSetelah direset, Username & Password akan menjadi ${defaultIdentifier} masing-masing pengguna.\n\nAksi ini tidak dapat dibatalkan. Lanjutkan?`;

      if (window.confirm(confirmMessage)) {
        try {
          const result = await resetAllPasswords(activeTab);
          if (result.success) {
            loadUsers(); // Refresh the user list to reflect changes
            alert(`${result.message}\n\nNotifikasi: User dan Pass default sekarang adalah NIP untuk Guru dan NISN untuk Siswa.`);
          } else {
            setError(result.message);
          }
        } catch (err: any) {
          setError(`Gagal mereset kata sandi massal: ${err.message}`);
        }
      }
    };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  
  const openResetPasswordModal = (user: User) => {
    setSelectedUser(user);
    setIsResetPasswordModalOpen(true);
  }
  
  const displayedUsers = users.filter(user => user.role === activeTab);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-40"><LoadingSpinner /></div>;
    }

    if (error) {
      return <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;
    }

    if (displayedUsers.length === 0) {
      return <div className="text-center text-slate-400 py-8">Belum ada {activeTab} terdaftar.</div>;
    }

    const tableHeaders = {
      murid: ['Nama Lengkap', 'NISN', 'Kelas', 'Aksi'],
      guru: ['Nama Lengkap', 'NIP', 'Mata Pelajaran', 'Aksi'],
      admin: ['Nama Lengkap', 'Nama Pengguna', 'Aksi'],
    };

    return (
       <div className="overflow-x-auto">
         <table className="w-full text-left">
           <thead className="text-xs text-slate-400 uppercase bg-slate-900/50">
             <tr>
               {tableHeaders[activeTab].map(header => (
                  <th key={header} scope="col" className={`px-6 py-3 ${header === 'Aksi' ? 'text-right' : ''}`}>{header}</th>
               ))}
             </tr>
           </thead>
           <tbody>
             {displayedUsers.map(user => (
               <tr key={user.id} className="bg-slate-800/60 border-b border-slate-700 hover:bg-slate-700/60 transition-colors">
                 <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                    <img src={user.profilePicture} alt={user.name} className="w-10 h-10 rounded-full"/>
                    <span>{user.name}</span>
                 </td>
                 
                 {activeTab === 'murid' && <>
                    <td className="px-6 py-4 text-slate-300">{user.nisn}</td>
                    <td className="px-6 py-4 text-slate-300">{user.class}</td>
                 </>}
                 {activeTab === 'guru' && <>
                    <td className="px-6 py-4 text-slate-300">{user.nip}</td>
                    <td className="px-6 py-4 text-slate-300">{user.subject}</td>
                 </>}
                 {activeTab === 'admin' && <>
                    <td className="px-6 py-4 text-slate-300">{user.username}</td>
                 </>}

                 <td className="px-6 py-4 text-right space-x-2 sm:space-x-4">
                   <button onClick={() => openEditModal(user)} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">Edit</button>
                   {user.role !== 'admin' && (
                     <button onClick={() => openResetPasswordModal(user)} className="text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors">Reset</button>
                   )}
                   <button 
                    onClick={() => handleDeleteUser(user.id)} 
                    className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors disabled:text-slate-500 disabled:cursor-not-allowed"
                    disabled={user.id === currentUser.id}
                    >
                      Hapus
                    </button>
                 </td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-7xl mx-auto p-4 md:p-6 text-white pt-24">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)] mb-8">Dasbor Admin</h1>
        
        <div className="bg-slate-800/60 backdrop-blur-sm p-6 rounded-lg border border-slate-700 shadow-md">
          <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
            <h2 className="text-2xl font-semibold">Manajemen Pengguna</h2>
            <div className="flex items-center flex-wrap gap-2 sm:gap-4">
              <button onClick={() => setIsImportModalOpen(true)} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-all text-sm sm:text-base">
                Impor
              </button>
              <button onClick={handleExportUsers} className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-500 transition-all text-sm sm:text-base">
                Ekspor
              </button>
               {activeTab !== 'admin' && (
                <button onClick={handleResetAllPasswords} className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-lg hover:bg-yellow-500 transition-all text-sm sm:text-base">
                  Reset Semua Password
                </button>
              )}
              <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 text-sm sm:text-base">
                Tambah Pengguna
              </button>
            </div>
          </div>
          <div className="flex border-b border-slate-700">
            <button
              onClick={() => setActiveTab('murid')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'murid' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Murid
            </button>
            <button
              onClick={() => setActiveTab('guru')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'guru' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Guru
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`px-4 py-2 font-medium transition-colors ${activeTab === 'admin' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-slate-400 hover:text-white'}`}
            >
              Admin
            </button>
          </div>
          <div className="mt-4">
            {renderContent()}
          </div>
        </div>
      </div>
      
      {isAddModalOpen && <AddUserModal onClose={() => setIsAddModalOpen(false)} onAddUser={handleAddUser} />}
      {isEditModalOpen && selectedUser && <EditUserModal user={selectedUser} onClose={() => setIsEditModalOpen(false)} onUpdateUser={handleUpdateUser} />}
      {isResetPasswordModalOpen && selectedUser && <ResetPasswordModal user={selectedUser} onClose={() => setIsResetPasswordModalOpen(false)} onResetPassword={handleResetPassword} />}
      {isImportModalOpen && <ImportUserModal role={activeTab as 'murid' | 'guru'} onClose={() => setIsImportModalOpen(false)} onImportSuccess={loadUsers} />}
    </>
  );
};

export default AdminDashboard;