import React, { useState } from 'react';
import { User, UserRole } from '../types.ts';
import { addUser } from '../services/api.ts';
import LoadingSpinner from './LoadingSpinner.tsx';

interface ImportUserModalProps {
  role: 'murid' | 'guru';
  onClose: () => void;
  onImportSuccess: () => void;
}

const ImportUserModal: React.FC<ImportUserModalProps> = ({ role, onClose, onImportSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ imported: number, skipped: number, errors: string[] } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setError('');
    setResult(null);
  };

  const downloadFormat = () => {
    const headers = role === 'guru' ? 'Nama,NIP,MataPelajaran' : 'Nama,NISN,Kelas';
    const example = role === 'guru' 
      ? 'Budi Guru,198501012010011001,Matematika\nAni Guruwati,199002022015022002,IPA' 
      : 'Siti Murid,0051234567,XII IPA 1\nJoko Muridun,0067654321,XII IPS 2';
    const csvContent = `${headers}\n${example}`;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `format_import_${role}.csv`;
    link.click();
  }

  const handleImport = async () => {
    if (!file) {
      setError('Silakan pilih file CSV untuk diimpor.');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setResult(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split(/\r\n|\n/).filter(line => line.trim() !== '');
      if (lines.length <= 1) {
        setError('File CSV kosong atau hanya berisi header.');
        setIsProcessing(false);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const usersToImport = lines.slice(1);
      
      let importedCount = 0;
      let skippedCount = 0;
      const errorMessages: string[] = [];

      for (let i = 0; i < usersToImport.length; i++) {
        const line = usersToImport[i];
        const data = line.split(',');
        
        try {
          let user: Omit<User, 'id'>;
          if (role === 'guru') {
            // Set password to NIP (data[1])
            user = { name: data[0], nip: data[1], subject: data[2], role: 'guru', password: data[1], username: data[1] };
          } else {
            // Set password to NISN (data[1])
            user = { name: data[0], nisn: data[1], class: data[2], role: 'murid', password: data[1], username: data[1] };
          }
          await addUser(user);
          importedCount++;
        } catch (e: any) {
          skippedCount++;
          errorMessages.push(`Baris ${i + 2}: ${e.message}`);
        }
      }

      setResult({ imported: importedCount, skipped: skippedCount, errors: errorMessages });
      setIsProcessing(false);
      if (importedCount > 0) {
        onImportSuccess();
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-lg border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-white">Impor Pengguna ({role === 'guru' ? 'Guru' : 'Murid'})</h2>
        <p className="text-slate-400 mb-6">
          Unggah file CSV untuk menambah banyak pengguna sekaligus. NIP/NISN yang sudah ada akan dilewati.
        </p>
        
        <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700 space-y-3">
          <label htmlFor="file-upload" className="block text-sm font-medium text-slate-300">Pilih File CSV</label>
          <input id="file-upload" type="file" accept=".csv" onChange={handleFileChange} className="w-full text-sm text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/20 file:text-blue-300 hover:file:bg-blue-500/30" />
          <button onClick={downloadFormat} className="text-xs text-blue-400 hover:underline">Unduh Format CSV</button>
        </div>

        {error && <p className="text-sm text-red-400 mt-4">{error}</p>}
        
        {isProcessing && <div className="mt-6"><LoadingSpinner /></div>}
        
        {result && !isProcessing && (
          <div className="mt-6 p-4 bg-slate-700/50 rounded-lg">
            <h3 className="font-semibold text-white">Hasil Impor:</h3>
            <p className="text-green-400">Berhasil diimpor: {result.imported} pengguna</p>
            <p className="text-yellow-400">Dilewati (duplikat/error): {result.skipped} pengguna</p>
            {result.errors.length > 0 && (
              <div className="mt-2">
                <p className="text-red-400 text-sm">Detail Error:</p>
                <ul className="text-xs text-slate-400 list-disc list-inside max-h-20 overflow-y-auto">
                  {result.errors.map((err, i) => <li key={i}>{err}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}
        
        <div className="flex justify-end space-x-4 pt-6">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors" disabled={isProcessing}>Tutup</button>
          <button type="button" onClick={handleImport} className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed" disabled={!file || isProcessing}>
            {isProcessing ? 'Memproses...' : 'Mulai Impor'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImportUserModal;