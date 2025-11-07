import React, { useState } from 'react';
import { User } from '../types.ts';

interface ChangeProfilePictureModalProps {
  currentUser: User;
  onClose: () => void;
  onSave: (imageDataUrl: string) => void;
}

const ChangeProfilePictureModal: React.FC<ChangeProfilePictureModalProps> = ({ currentUser, onClose, onSave }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(currentUser.profilePicture || null);
  const [error, setError] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError('Ukuran file tidak boleh melebihi 2MB.');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (imagePreview) {
      onSave(imagePreview);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/95 flex justify-center items-center z-50 p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-slate-700">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Ubah Foto Profil</h2>
        <div className="flex flex-col items-center space-y-4">
          <img 
            src={imagePreview || 'https://i.pravatar.cc/150'} 
            alt="Pratinjau Foto Profil" 
            className="w-32 h-32 rounded-full object-cover border-4 border-slate-600"
          />
          <input 
            type="file" 
            accept="image/png, image/jpeg, image/gif" 
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors text-sm font-semibold"
          >
            Pilih Gambar
          </button>
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>
        <div className="flex justify-end space-x-4 pt-8">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Batal</button>
          <button 
            type="button" 
            onClick={handleSave} 
            disabled={!imagePreview || imagePreview === currentUser.profilePicture}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-md hover:from-blue-600 hover:to-purple-700 transition-colors disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeProfilePictureModal;