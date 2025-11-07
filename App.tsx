import React, { useState, useEffect, useCallback } from 'react';
import { UserRole, View, Exam } from './types';
import LoginScreen from './components/LoginScreen';
import AdminDashboard from './components/AdminDashboard';
import GuruDashboard from './components/GuruDashboard';
import MuridDashboard from './components/MuridDashboard';
import QuestionCard from './components/QuestionCard';
import ResultsScreen from './components/ResultsScreen';
import Timer from './components/Timer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LOGIN);
  const [currentUserRole, setCurrentUserRole] = useState<UserRole | null>(null);
  
  // Exam State
  const [activeExam, setActiveExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  const handleSubmitExam = useCallback(() => {
    if (!activeExam) return;
    setIsTimerRunning(false);
    let finalScore = 0;
    const finalAnswers = [...userAnswers];
    for (let i = 0; i < activeExam.questions.length; i++) {
      if (finalAnswers[i] === activeExam.questions[i].correctAnswerIndex) {
        finalScore++;
      }
    }
    setScore(finalScore);
    setCurrentView(View.RESULTS);
  }, [userAnswers, activeExam]);

  useEffect(() => {
    let timer: number | undefined;
    if (isTimerRunning && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isTimerRunning && timeRemaining === 0) {
      handleSubmitExam();
    }
    return () => window.clearInterval(timer);
  }, [isTimerRunning, timeRemaining, handleSubmitExam]);

  const handleLogin = (role: UserRole) => {
    setCurrentUserRole(role);
    switch (role) {
      case UserRole.ADMIN:
        setCurrentView(View.ADMIN_DASHBOARD);
        break;
      case UserRole.GURU:
        setCurrentView(View.GURU_DASHBOARD);
        break;
      case UserRole.MURID:
        setCurrentView(View.MURID_DASHBOARD);
        break;
    }
  };

  const handleLogout = () => {
    setCurrentUserRole(null);
    setCurrentView(View.LOGIN);
    setActiveExam(null);
    setIsTimerRunning(false);
  };
  
  const handleStartExam = (exam: Exam) => {
    setActiveExam(exam);
    setUserAnswers(Array(exam.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setTimeRemaining(exam.duration);
    setScore(0);
    setCurrentView(View.EXAM);
    setIsTimerRunning(true);
  };

  const handleBackToDashboard = () => {
    setActiveExam(null);
    if (currentUserRole === UserRole.MURID) {
      setCurrentView(View.MURID_DASHBOARD);
    } else {
      handleLogout(); // Fallback to login
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (activeExam && currentQuestionIndex < activeExam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const renderHeader = () => {
    if(currentView === View.LOGIN) return null;
    
    return (
        <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm z-20 border-b border-slate-800">
            <div className="text-lg font-bold text-cyan-400">Portal Ujian SMAN 14</div>
            <div className="flex items-center space-x-4">
                <span className="text-slate-300">Selamat datang, <span className="font-semibold text-white">{currentUserRole}</span></span>
                <button onClick={handleLogout} className="px-4 py-2 text-sm bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors">
                    Logout
                </button>
            </div>
        </header>
    );
  }

  const renderContent = () => {
    switch (currentView) {
      case View.ADMIN_DASHBOARD:
        return <AdminDashboard />;
      case View.GURU_DASHBOARD:
        return <GuruDashboard />;
      case View.MURID_DASHBOARD:
        return <MuridDashboard onStartExam={handleStartExam} />;
      case View.EXAM:
        if (!activeExam) return null;
        const currentQuestion = activeExam.questions[currentQuestionIndex];
        const totalQuestions = activeExam.questions.length;
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 pt-20">
            <div className="absolute top-20 right-4 flex items-center space-x-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
               <Timer timeRemaining={timeRemaining} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{activeExam.title}</h2>
            <QuestionCard
              question={currentQuestion}
              userAnswer={userAnswers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerSelect}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalQuestions}
            />
            <div className="flex justify-between w-full max-w-3xl mt-8">
              <button
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-slate-700 text-white font-semibold rounded-lg hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={handleNextQuestion}
                  className="px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-lg hover:bg-cyan-400 transition-colors"
                >
                  Selanjutnya
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-400 transition-colors"
                >
                  Kumpulkan
                </button>
              )}
            </div>
          </div>
        );
      case View.RESULTS:
        if (!activeExam) return null;
        return (
          <ResultsScreen
            score={score}
            totalQuestions={activeExam.questions.length}
            userAnswers={userAnswers}
            questions={activeExam.questions}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case View.LOGIN:
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <main className="bg-slate-900 min-h-screen w-full flex items-center justify-center font-sans relative overflow-y-auto text-white">
       <div className="absolute inset-0 bg-grid-slate-800 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)]"></div>
       <div className="relative z-10 w-full min-h-screen flex flex-col items-center justify-center">
        {renderHeader()}
        {renderContent()}
      </div>
    </main>
  );
};

export default App;