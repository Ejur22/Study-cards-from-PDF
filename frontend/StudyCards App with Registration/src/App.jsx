import React, { useState } from 'react'
import Header from './components/Header'
import MainScreen from './components/MainScreen'
import RegistrationScreen from './components/RegistrationScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import { sampleQuestions } from './data/sampleQuestions'
import LoginScreen from './components/LoginScreen'
import HistoryPage from './components/HistoryPage'
import './App.css'


function App() {
  const [currentScreen, setCurrentScreen] = useState('main')
  const [uploadedFile, setUploadedFile] = useState(null)
  const [quizResults, setQuizResults] = useState(null)

  const handleAvatarClick = () => {
    setCurrentScreen(currentScreen === 'main' ? 'registration' : 'main')
  }

    // когда загрузили PDF
  const handleFileUploaded = (file) => {
    setUploadedFile(file)
    setCurrentScreen('quiz')      // ← переход сразу на Quiz после загрузки
  }

  // когда квиз закончен
  const handleQuizComplete = (results) => {
    setQuizResults(results)
    setCurrentScreen('results')
  }

  // повторить процесс
  const handleRestart = () => {
    setUploadedFile(null)
    setQuizResults(null)
    setCurrentScreen('main')
  }

  return (
    <div className="app">
      <Header 
      onAvatarClick={handleAvatarClick}  
      onHistoryClick={() => setCurrentScreen('history')}/>

      <main className="main-content">

        {currentScreen === 'main' && (
          <MainScreen onFileUpload={handleFileUploaded} />
        )}

        {currentScreen === 'registration' && (
          <RegistrationScreen 
          onBack={() => setCurrentScreen('main')}
          onGoToLogin={() => setCurrentScreen('login')} />
        )}

        {currentScreen === 'quiz' && (
          <QuizScreen
            questions={sampleQuestions}
            onComplete={handleQuizComplete}
            onBack={() => setCurrentScreen('main')}
            uploadedFile={uploadedFile}
          />
        )}

        {currentScreen === 'results' && (
          <ResultsScreen
            results={quizResults}
            onRestart={handleRestart}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onBack={() => setCurrentScreen('registration')}
            onGoToRegister={() => setCurrentScreen('registration')}
          />
        )}
        
        {currentScreen === 'history' && (
          <HistoryPage 
            onBack={() => setCurrentScreen('main')} 
          />
        )}

      </main>
    </div>
  )
}
export default App
