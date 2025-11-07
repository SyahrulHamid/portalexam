import React from 'react';
// FIX: Add .ts extension to ensure module is resolved correctly.
import { Question } from '../types.ts';

interface ResultsScreenProps {
  score: number;
  totalQuestions: number;
  userAnswers: (number | null)[];
  questions: Question[];
  onBackToDashboard: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({
  score,
  totalQuestions,
  userAnswers,
  questions,
  onBackToDashboard,
}) => {
  const scorePercentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getAnswerClass = (question: Question, answerIndex: number, userAnswer: number | null) => {
    const isCorrect = answerIndex === question.correctAnswerIndex;
    const isSelected = answerIndex === userAnswer;

    if (isCorrect) {
      return 'bg-green-500/20 border-green-500';
    }
    if (isSelected && !isCorrect) {
      return 'bg-red-500/20 border-red-500';
    }
    return 'bg-slate-700/50 border-slate-600';
  };
  
  const optionsLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 md:p-6 text-white pt-20">
      <div className="bg-slate-800/60 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-slate-700 text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Hasil Ujian</h1>
        <p className="text-lg text-slate-300 mb-6">Berikut adalah ringkasan hasil ujian Anda.</p>
        <div className="flex justify-center items-center space-x-8">
          <div>
            <p className={`text-5xl md:text-6xl font-bold ${getScoreColor(scorePercentage)}`}>{scorePercentage}%</p>
            <p className="text-slate-400 mt-1">Skor Akhir</p>
          </div>
          <div className="h-20 w-px bg-slate-600"></div>
          <div>
            <p className="text-5xl md:text-6xl font-bold text-blue-400">{score}<span className="text-2xl text-slate-400">/{totalQuestions}</span></p>
            <p className="text-slate-400 mt-1">Jawaban Benar</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Tinjauan Jawaban</h2>
        {questions.map((q, index) => (
          <div key={q.id} className="bg-slate-800/50 p-6 rounded-lg border border-slate-700">
            <p className="font-semibold text-lg text-slate-100 mb-4">{index + 1}. {q.questionText}</p>
            <div className="space-y-3">
              {q.options.map((option, optIndex) => (
                <div key={optIndex} className={`flex items-center p-3 rounded-md border ${getAnswerClass(q, optIndex, userAnswers[index])}`}>
                   <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold mr-3 text-sm border-2
                    ${optIndex === q.correctAnswerIndex ? 'bg-green-500 border-green-400 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-200'}`}>
                    {optionsLetters[optIndex]}
                  </div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
            {userAnswers[index] !== q.correctAnswerIndex && userAnswers[index] !== null && (
              <p className="mt-3 text-sm text-green-400">Jawaban yang benar: {q.options[q.correctAnswerIndex]}</p>
            )}
             {userAnswers[index] === null && (
              <p className="mt-3 text-sm text-yellow-400">Tidak dijawab. Jawaban yang benar: {q.options[q.correctAnswerIndex]}</p>
            )}
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={onBackToDashboard}
          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Kembali ke Dasbor
        </button>
      </div>
    </div>
  );
};

export default ResultsScreen;