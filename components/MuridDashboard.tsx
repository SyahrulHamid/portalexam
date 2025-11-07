import React, { useState, useEffect } from 'react';
import { Exam } from '../types';
import { fetchExams } from '../services/api';
import LoadingSpinner from './LoadingSpinner';


interface MuridDashboardProps {
  onStartExam: (exam: Exam) => void;
}

const MuridDashboard: React.FC<MuridDashboardProps> = ({ onStartExam }) => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadExams = async () => {
      try {
        setError(null);
        setIsLoading(true);
        const fetchedExams = await fetchExams();
        setExams(fetchedExams);
      } catch (err) {
        setError('Gagal memuat daftar ujian. Silakan coba lagi nanti.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadExams();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex justify-center items-center h-60"><LoadingSpinner /></div>;
    }

    if (error) {
      return <div className="text-center text-red-400 p-4 bg-red-500/10 rounded-lg">{error}</div>;
    }

    if (exams.length === 0) {
      return <div className="text-center text-slate-400">Tidak ada ujian yang tersedia saat ini.</div>;
    }
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map(exam => (
          <div key={exam.id} className="bg-slate-700/50 p-6 rounded-lg flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">{exam.subject}</span>
              <h3 className="font-bold text-xl text-white mt-3 mb-2">{exam.title}</h3>
              <ul className="text-sm text-slate-400 space-y-1 mb-4">
                <li>{exam.questions.length} Pertanyaan</li>
                <li>{Math.floor(exam.duration / 60)} Menit</li>
              </ul>
            </div>
            <button 
              onClick={() => onStartExam(exam)}
              className="w-full mt-2 px-4 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
            >
              Mulai Ujian
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 text-white pt-24">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Dasbor Murid</h1>
      
      <div className="bg-slate-800/70 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Ujian yang Tersedia</h2>
        {renderContent()}
      </div>
    </div>
  );
};

export default MuridDashboard;