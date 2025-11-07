import React from 'react';
// FIX: Add .ts extension to ensure module is resolved correctly.
import { Question } from '../types.ts';

interface QuestionCardProps {
  question: Question;
  userAnswer: number | null;
  onAnswerSelect: (answerIndex: number) => void;
  questionNumber: number;
  totalQuestions: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userAnswer,
  onAnswerSelect,
  questionNumber,
  totalQuestions,
}) => {
  const optionsLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl bg-slate-800/70 backdrop-blur-sm p-6 md:p-8 rounded-2xl shadow-2xl border border-slate-700">
      <div className="mb-6">
        <p className="text-sm font-semibold text-cyan-400 mb-2">
          Pertanyaan {questionNumber} dari {totalQuestions}
        </p>
        <p className="text-xl md:text-2xl font-medium text-slate-100 leading-relaxed">
          {question.questionText}
        </p>
      </div>
      <div className="space-y-4">
        {question.options.map((option, index) => {
          const isSelected = userAnswer === index;
          return (
            <div
              key={index}
              onClick={() => onAnswerSelect(index)}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 
                ${isSelected 
                  ? 'bg-cyan-500/20 border-cyan-500 text-white' 
                  : 'bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-slate-500'}`
              }
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-4 border-2
                ${isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-900' : 'bg-slate-600 border-slate-500 text-slate-200'}`}
              >
                {optionsLetters[index]}
              </div>
              <span className="flex-1 text-base md:text-lg">{option}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionCard;