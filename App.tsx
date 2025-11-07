// FIX: Provide full implementation for the main App component.
import React, { useState, useEffect, useCallback } from 'react';
import { User, Exam } from './types.ts';
import { updateUser, changePassword } from './services/api.ts';
import LoginScreen from './components/LoginScreen.tsx';
import AdminDashboard from './components/AdminDashboard.tsx';
import GuruDashboard from './components/GuruDashboard.tsx';
import MuridDashboard from './components/MuridDashboard.tsx';
import WelcomeScreen from './components/WelcomeScreen.tsx';
import QuestionCard from './components/QuestionCard.tsx';
import ResultsScreen from './components/ResultsScreen.tsx';
import Timer from './components/Timer.tsx';
import ChangeProfilePictureModal from './components/ChangeProfilePictureModal.tsx';
import ChangePasswordModal from './components/ChangePasswordModal.tsx';

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

  // Modal State
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangePictureModalOpen, setIsChangePictureModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  
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
    setIsDropdownOpen(false);
  }
  
  const handleUpdateProfilePicture = async (imageDataUrl: string) => {
    if (!user) return;
    try {
      const updatedUser = await updateUser({ id: user.id, profilePicture: imageDataUrl });
      setUser(updatedUser);
      setIsChangePictureModalOpen(false);
    } catch (error) {
      console.error("Gagal memperbarui foto profil:", error);
      // Optionally, show an error message to the user
    }
  };

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    if (!user) return Promise.reject("Pengguna tidak ditemukan");
    return await changePassword(user.id, oldPassword, newPassword);
  };


  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
      
      case 'dashboard':
        if (!user) return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
        switch (user.role) {
          case 'admin':
            return <AdminDashboard currentUser={user}/>;
          case 'guru':
            return <GuruDashboard currentUser={user}/>;
          case 'murid':
            return <MuridDashboard currentUser={user} onStartExam={handleStartExam} />;
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
                  className="px-10 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:from-slate-500 disabled:to-slate-600 disabled:cursor-not-allowed disabled:scale-100"
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
    <main className="min-h-screen text-slate-100 font-sans relative">
      <div className="relative z-10">
        {user && appState !== 'login' && (
          <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-indigo-950/30 backdrop-blur-sm z-20">
            <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ujian Online SMAN 14</div>
            <div className="relative">
              <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                 <span className="text-slate-300 hidden sm:block">Selamat datang, {user.name}!</span>
                 <img src={user.profilePicture} alt="Foto Profil" className="w-10 h-10 rounded-full border-2 border-slate-500 hover:border-blue-400 transition-colors" />
              </div>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-800/95 backdrop-blur-sm rounded-md shadow-2xl shadow-black/50 z-50 border border-slate-700">
                    <div className="p-2">
                        <div className="px-2 py-2 text-sm text-slate-400 border-b border-slate-700 mb-2">
                            Masuk sebagai <span className="font-semibold text-white">{user.username}</span>
                        </div>
                        <button 
                            onClick={() => { setIsChangePictureModalOpen(true); setIsDropdownOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
                            Ubah Foto Profil
                        </button>
                        <button 
                            onClick={() => { setIsChangePasswordModalOpen(true); setIsDropdownOpen(false); }}
                            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-md transition-colors">
                            Ubah Kata Sandi
                        </button>
                        <div className="h-px bg-slate-700 my-2"></div>
                        <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 rounded-md transition-colors">
                            Keluar
                        </button>
                    </div>
                </div>
              )}
            </div>
          </header>
        )}
        {renderContent()}
      </div>

      {isChangePictureModalOpen && user && (
        <ChangeProfilePictureModal 
          currentUser={user}
          onClose={() => setIsChangePictureModalOpen(false)}
          onSave={handleUpdateProfilePicture}
        />
      )}
       {isChangePasswordModalOpen && user && (
        <ChangePasswordModal 
          onClose={() => setIsChangePasswordModalOpen(false)}
          onChangePassword={handleChangePassword}
        />
      )}
    </main>
  );
}

export default App;