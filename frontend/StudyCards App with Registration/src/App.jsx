import React, { useState } from 'react'
import Header from './components/Header'
import MainScreen from './components/MainScreen'
import RegistrationScreen from './components/RegistrationScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import LoginScreen from './components/LoginScreen'
import HistoryPage from './components/HistoryPage'
import './App.css'
import api from './api'
import { useAuth } from './AuthContext'

function App() {
  const { isAuth } = useAuth()
  const [currentScreen, setCurrentScreen] = useState('main')
  const [questions, setQuestions] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [loading, setLoading] = useState(false)

  // ----------------------------
  // Загрузка PDF → генерация теста
  // ----------------------------
  const handleFileUploaded = async (file) => {
    if (!isAuth) {
      setCurrentScreen('login')
      return
    }

    try {
      setLoading(true) // ⬅️ СТАРТ загрузки

      const formData = new FormData()
      formData.append('file', file)

      // 1️⃣ создаём группу и flashcards
      const uploadRes = await api.post('/groups/upload', formData)

      const groupId = uploadRes.data.group_id
      setCurrentGroupId(groupId)

      // 2️⃣ получаем flashcards
      const cardsRes = await api.get(`/flashcards/group/${groupId}`)

      // 3️⃣ приводим к формату QuizScreen
      const formattedQuestions = cardsRes.data.map((card) => ({
        question: card.question,
        options: card.options,
        correctAnswer: card.correct_index,
      }))

      setQuestions(formattedQuestions)
      setCurrentScreen('quiz')
    } catch (err) {
      console.error(err)
      alert('Ошибка при обработке PDF')
    } finally {
    setLoading(false) // ⬅️ КОНЕЦ загрузки (всегда)
    }
  }

  // ----------------------------
  // Завершение теста
  // ----------------------------
  const handleQuizComplete = (results) => {
    setQuizResults(results)
    setCurrentScreen('results')
  }

  // ----------------------------
  // Сброс состояния
  // ----------------------------
  const handleRestart = () => {
    setQuestions(null)
    setQuizResults(null)
    setCurrentGroupId(null)
    setCurrentScreen('main')
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="app">
      <Header
        onAvatarClick={() =>
          setCurrentScreen(isAuth ? 'main' : 'registration')
        }
        onHistoryClick={() =>
          setCurrentScreen(isAuth ? 'history' : 'login')
        }
      />

      <main className="main-content">
        {loading && (
          <div className="loading-screen">
            <div className="loader"></div>
            <p>Генерируем вопросы, пожалуйста подождите…</p>
          </div>
        )}

        {!loading && currentScreen === 'main' && (
          <MainScreen onFileUpload={handleFileUploaded} />
        )}
        
        {currentScreen === 'main' && (
          <MainScreen onFileUpload={handleFileUploaded} />
        )}

        {currentScreen === 'registration' && (
          <RegistrationScreen
            onBack={() => setCurrentScreen('main')}
            onGoToLogin={() => setCurrentScreen('login')}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onBack={() => setCurrentScreen('main')}
            onGoToRegister={() => setCurrentScreen('registration')}
          />
        )}

        {currentScreen === 'quiz' && questions && (
          <QuizScreen
            questions={questions}
            onComplete={handleQuizComplete}
            onBack={() => setCurrentScreen('main')}
          />
        )}

        {currentScreen === 'results' && quizResults && (
          <ResultsScreen
            results={quizResults}
            onRestart={handleRestart}
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
