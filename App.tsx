// FIX: Provide full implementation for the main App component.
import React, { useState, useEffect, useCallback } from 'react';
import { User, Exam } from './types.ts';
import LoginScreen from './components/LoginScreen.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import GuruDashboard from './components/GuruDashboard.tsx';
import MuridDashboard from './components/MuridDashboard.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import QuestionCard from './components/QuestionCard.tsx';
import ResultsScreen from './components/ResultsScreen.tsx';
import Timer from './components/Timer.tsx';

type AppState = 'login' | 'dashboard' | 'exam-welcome' | 'exam-active' | 'exam-results';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appState, setAppState] = useState<AppState>('login');
  
  // Exam state
  const [currentExam, setCurrentExam] = useState<Exam | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  
  // FIX: Changed NodeJS.Timeout to ReturnType<typeof setTimeout> to use the correct browser-compatible type for the timer ID.
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateScore = useCallback(() => {
    if (!currentExam) return 0;
    return userAnswers.reduce((totalScore, answer, index) => {
      if (answer !== null && answer === currentExam.questions[index].correctAnswerIndex) {
        return totalScore + 1;
      }
      return totalScore;
    }, 0);
  }, [currentExam, userAnswers]);

  const finishExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalScore = calculateScore();
    setScore(finalScore);
    setAppState('exam-results');
  }, [calculateScore]);

  useEffect(() => {
    if (appState === 'exam-active' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (appState === 'exam-active' && timeRemaining === 0) {
      finishExam();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [appState, timeRemaining, finishExam]);


  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    setAppState('dashboard');
  };

  const handleStartExam = (exam: Exam) => {
    setCurrentExam(exam);
    setUserAnswers(new Array(exam.questions.length).fill(null));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeRemaining(exam.duration);
    setAppState('exam-welcome');
  };

  const handleConfirmStartExam = () => {
    setAppState('exam-active');
  };
  
  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setUserAnswers(newAnswers);
  };
  
  const handleNextQuestion = () => {
    if (currentExam && currentQuestionIndex < currentExam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishExam();
    }
  };
  
  const handleBackToDashboard = () => {
    setCurrentExam(null);
    setAppState('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('login');
  }

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      
      case 'dashboard':
        if (!user) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
        switch (user.role) {
          case 'admin':
            return <AdminDashboard />;
          case 'guru':
            return <GuruDashboard />;
          case 'murid':
            return <MuridDashboard onStartExam={handleStartExam} />;
          default:
            return <div>Peran pengguna tidak diketahui</div>;
        }
      
      case 'exam-welcome':
        if (!currentExam) return <div>Error: Ujian tidak ditemukan.</div>;
        return <div className="min-h-screen flex items-center justify-center"><WelcomeScreen exam={currentExam} onStart={handleConfirmStartExam} /></div>;

      case 'exam-active':
        if (!currentExam) return <div>Error: Ujian tidak ditemukan.</div>;
        const currentQuestion = currentExam.questions[currentQuestionIndex];
        return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4">
             <div className="absolute top-4 right-4 z-10">
                <Timer timeRemaining={timeRemaining} />
             </div>
             <QuestionCard 
                question={currentQuestion}
                userAnswer={userAnswers[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={currentExam.questions.length}
             />
             <div className="mt-8">
                <button 
                  onClick={handleNextQuestion}
                  className="px-10 py-3 bg-cyan-500 text-slate-900 font-bold text-lg rounded-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                  disabled={userAnswers[currentQuestionIndex] === null}
                >
                  {currentQuestionIndex < currentExam.questions.length - 1 ? 'Berikutnya' : 'Selesaikan Ujian'}
                </button>
             </div>
          </div>
        );
        
      case 'exam-results':
        if (!currentExam) return <div>Error: Ujian tidak ditemukan.</div>;
        return <ResultsScreen 
                  score={score}
                  totalQuestions={currentExam.questions.length}
                  userAnswers={userAnswers}
                  questions={currentExam.questions}
                  onBackToDashboard={handleBackToDashboard}
                />;
      
      default:
        return <div>Halaman tidak ditemukan</div>;
    }
  }

  return (
    <main className="bg-slate-900 min-h-screen text-slate-100 font-sans relative">
      <div className="absolute inset-0 bg-[url('/background.svg')] bg-cover bg-center opacity-10"></div>
      <div className="relative z-10">
        {user && appState !== 'login' && (
          <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm z-20">
            <div className="font-bold text-xl text-cyan-400">Ujian Online</div>
            <div>
              <span className="mr-4 text-slate-300">Selamat datang, {user.name}!</span>
              <button onClick={handleLogout} className="px-4 py-2 text-sm bg-red-600 rounded hover:bg-red-500 transition-colors">
                Keluar
              </button>
            </div>
          </header>
        )}
        {renderContent()}
      </div>
    </main>
  );
}

export default App;