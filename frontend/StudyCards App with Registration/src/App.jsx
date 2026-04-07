import React, { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const [questions, setQuestions] = useState(null)
  const [quizResults, setQuizResults] = useState(null)
  const [currentGroupId, setCurrentGroupId] = useState(null)
  const [loading, setLoading] = useState(false)

  // ----------------------------
  // Навигация при изменении статуса аутентификации
  // ----------------------------
  useEffect(() => {
    // Если пользователь залогинился и был на login/registration, переводим на главную
    if (isAuth && (window.location.pathname === '/login' || window.location.pathname === '/registration')) {
      navigate('/')
    }
  }, [isAuth, navigate])

  // ----------------------------
  // Загрузка PDF → генерация теста
  // ----------------------------
  const handleFileUploaded = async (file) => {
    if (!isAuth) {
      navigate('/login')
      return
    }

    try {
      setLoading(true)

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
      navigate(`/quiz/${groupId}`)
    } catch (err) {
      console.error(err)
      alert('Ошибка при обработке PDF')
    } finally {
      setLoading(false)
    }
  }

  // ----------------------------
  // Завершение теста
  // ----------------------------
  const handleQuizComplete = async (results) => {
    setQuizResults(results)

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
    
    navigate('/results')
  }

  // ----------------------------
  // Сброс состояния
  // ----------------------------
  const handleRestart = () => {
    setQuestions(null)
    setQuizResults(null)
    setCurrentGroupId(null)
    navigate('/')
  }

  // ----------------------------
  // SEO заголовки в зависимости от пути
  // ----------------------------
  const getSEOHead = () => {
    const pathname = window.location.pathname
    
    if (pathname === '/') {
      return (
        <SEOHead
          title="StudyCards - Создавайте тесты из PDF"
          description="Автоматически создавайте интерактивные карточки и тесты из PDF файлов. Эффективное обучение с визуализацией и отслеживанием результатов."
          canonical="https://studycards.app/"
          keywords="pdf тесты, интерактивные карточки, обучение, создание тестов, студенты"
        />
      )
    } else if (pathname.startsWith('/quiz')) {
      return (
        <SEOHead
          title="Тест - StudyCards"
          description="Проходите интерактивный тест для проверки ваших знаний"
          robots="noindex, follow"
        />
      )
    } else if (pathname === '/results') {
      return (
        <SEOHead
          title="Результаты - StudyCards"
          description="Ваши результаты тестирования"
          robots="noindex, follow"
        />
      )
    } else if (pathname === '/history') {
      return (
        <SEOHead
          title="История - StudyCards"
          description="Ваша история обучения"
          robots="noindex, follow"
        />
      )
    } else if (pathname === '/login' || pathname === '/registration') {
      return (
        <SEOHead
          title="Вход - StudyCards"
          description="Войдите или зарегистрируйтесь в StudyCards"
          robots="noindex, follow"
        />
      )
    } else {
      return <SEOHead />
    }
  }

  // ----------------------------
  // UI с React Router
  // ----------------------------
  return (
    <div className="app">
      {/* SEO управление заголовками */}
      {getSEOHead()}

      <Header
        onAvatarClick={() => navigate(isAuth ? '/' : '/registration')}
        onHistoryClick={() => navigate(isAuth ? '/history' : '/login')}
        onUsersClick={() => navigate('/users')}
      />

      <main className="main-content">
        {loading && (
          <div className="loading-screen">
            <div className="loader"></div>
            <p>Генерируем вопросы, пожалуйста подождите…</p>
          </div>
        )}

        {!loading && (
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<MainScreen onFileUpload={handleFileUploaded} />} />

            {/* Аутентификация */}
            <Route 
              path="/registration" 
              element={
                <RegistrationScreen
                  onBack={() => navigate('/')}
                  onGoToLogin={() => navigate('/login')}
                />
              } 
            />
            <Route 
              path="/login" 
              element={
                <LoginScreen
                  onBack={() => navigate('/')}
                  onGoToRegister={() => navigate('/registration')}
                />
              } 
            />

            {/* Тестирование */}
            <Route 
              path="/quiz/:groupId" 
              element={
                questions ? (
                  <QuizScreen
                    questions={questions}
                    onComplete={handleQuizComplete}
                    onBack={() => navigate('/')}
                  />
                ) : (
                  <MainScreen onFileUpload={handleFileUploaded} />
                )
              } 
            />
            <Route 
              path="/results" 
              element={
                quizResults ? (
                  <ResultsScreen
                    results={quizResults}
                    onRestart={handleRestart}
                  />
                ) : (
                  <MainScreen onFileUpload={handleFileUploaded} />
                )
              } 
            />

            {/* История обучения */}
            <Route 
              path="/history" 
              element={
                <HistoryPage onBack={() => navigate('/')} />
              } 
            />

            {/* Админка */}
            <Route 
              path="/users" 
              element={
                <UsersPage onBack={() => navigate('/')} />
              } 
            />

            {/* 404 - не найдено */}
            <Route 
              path="*" 
              element={
                <div style={{textAlign: 'center', padding: '40px'}}>
                  <h1>404 - Страница не найдена</h1>
                  <p>Запрошенная страница не существует</p>
                  <button onClick={() => navigate('/')} style={{padding: '10px 20px', marginTop: '20px'}}>
                    Вернуться на главную
                  </button>
                </div>
              } 
            />
          </Routes>
        )}
      </main>
    </div>
  )
}

export default App
