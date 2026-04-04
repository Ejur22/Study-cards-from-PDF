import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import MainScreen from './components/MainScreen'
import RegistrationScreen from './components/RegistrationScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import LoginScreen from './components/LoginScreen'
import HistoryPage from './components/HistoryPage'
import UsersPage from './components/UsersPage'
import SEOHead from './components/SEOHead'
import './App.css'
import api from './api'
import { useAuth } from './AuthContext'

function App() {
  const { isAuth, loading: authLoading } = useAuth()
  const [currentScreen, setCurrentScreen] = useState('main')
  const [questions, setQuestions] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [loading, setLoading] = useState(false)

  // ----------------------------
  // Навигация при изменении статуса аутентификации
  // ----------------------------
  useEffect(() => {
    // Если пользователь залогинился, переводим на главную
    if (isAuth && (currentScreen === 'login' || currentScreen === 'registration')) {
      setCurrentScreen('main')
    }
  }, [isAuth, currentScreen])

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
  const handleQuizComplete = async (results) => {
    setQuizResults(results)
    setCurrentScreen('results')

    // Save score to database
    if (currentGroupId) {
      try {
        await api.put(`/groups/${currentGroupId}/score`, {
          score: results.accuracy,
          correct: results.correctAnswers,
          total: results.totalQuestions
        })
      } catch (err) {
        console.error('Failed to save score:', err)
      }
    }
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
  // SEO заголовки в зависимости от страницы
  // ----------------------------
  const getSEOHead = () => {
    switch (currentScreen) {
      case 'main':
        return (
          <SEOHead
            title="StudyCards - Создавайте тесты из PDF"
            description="Автоматически создавайте интерактивные карточки и тесты из PDF файлов. Эффективное обучение с визуализацией и отслеживанием результатов."
            canonical="https://studycards.app/"
            keywords="pdf тесты, интерактивные карточки, обучение, создание тестов, студенты"
          />
        )
      case 'quiz':
        return (
          <SEOHead
            title="Тест - StudyCards"
            description="Проходите интерактивный тест для проверки ваших знаний"
            robots="noindex, follow"
          />
        )
      case 'results':
        return (
          <SEOHead
            title="Результаты - StudyCards"
            description="Ваши результаты тестирования"
            robots="noindex, follow"
          />
        )
      case 'history':
        return (
          <SEOHead
            title="История - StudyCards"
            description="Ваша история обучения"
            robots="noindex, follow"
          />
        )
      case 'login':
      case 'registration':
        return (
          <SEOHead
            title="Вход - StudyCards"
            description="Войдите или зарегистрируйтесь в StudyCards"
            robots="noindex, follow"
          />
        )
      default:
        return (
          <SEOHead />
        )
    }
  }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="app">
      {/* SEO управление заголовками */}
      {getSEOHead()}

      <Header
        onAvatarClick={() =>
          setCurrentScreen(isAuth ? 'main' : 'registration')
        }
        onHistoryClick={() =>
          setCurrentScreen(isAuth ? 'history' : 'login')
        }
        onUsersClick={() => setCurrentScreen('users')}
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

        {currentScreen === 'users' && (
          <UsersPage
            onBack={() => setCurrentScreen('main')}
          />
        )}
      </main>
    </div>
  )
}

export default App
