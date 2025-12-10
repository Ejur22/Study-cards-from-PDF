import React, { useState } from 'react'

const QuizScreen = ({ questions, onComplete, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [userAnswers, setUserAnswers] = useState([])

  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  const handleAnswerSelect = (optionIndex) => {
    if (showFeedback) return
    setSelectedAnswer(optionIndex)
  }

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const newAnswer = {
      questionIndex: currentQuestionIndex,
      selectedAnswer,
      isCorrect,
      question: currentQuestion.question
    }

    setUserAnswers([...userAnswers, newAnswer])
    setShowFeedback(true)
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length + 
                           (selectedAnswer === currentQuestion.correctAnswer ? 1 : 0)
      const totalQuestions = questions.length
      const accuracy = Math.round((correctAnswers / totalQuestions) * 100)

      onComplete({
        correctAnswers,
        incorrectAnswers: totalQuestions - correctAnswers,
        totalQuestions,
        accuracy,
        answers: [...userAnswers, {
          questionIndex: currentQuestionIndex,
          selectedAnswer,
          isCorrect: selectedAnswer === currentQuestion.correctAnswer,
          question: currentQuestion.question
        }]
      })
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }

  const getOptionClassName = (optionIndex) => {
    let className = 'option-button'
    
    if (selectedAnswer === optionIndex) {
      className += ' selected'
    }
    
    if (showFeedback) {
      className += ' disabled'
      if (optionIndex === currentQuestion.correctAnswer) {
        className += ' correct'
      } else if (selectedAnswer === optionIndex && optionIndex !== currentQuestion.correctAnswer) {
        className += ' incorrect'
      }
    }
    
    return className
  }

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="quiz-screen">
      <header className="quiz-header">
        <div className="question-counter">
          Вопрос {currentQuestionIndex + 1} из {questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </header>

      <div className="question-card">
        <h2 className="question-title">{currentQuestion.question}</h2>
        
        <ul className="options-list">
          {currentQuestion.options.map((option, index) => (
            <li key={index} className="option-item">
              <button
                className={getOptionClassName(index)}
                onClick={() => handleAnswerSelect(index)}
                disabled={showFeedback}
              >
                <div className="option-radio"></div>
                <span>{option}</span>
              </button>
            </li>
          ))}
        </ul>

        {showFeedback && (
          <div className={`feedback ${selectedAnswer === currentQuestion.correctAnswer ? 'correct' : 'incorrect'}`}>
            {selectedAnswer === currentQuestion.correctAnswer 
              ? 'Правильно! Отличная работа.' 
              : `Неправильно. Правильный ответ: ${currentQuestion.options[currentQuestion.correctAnswer]}`
            }
          </div>
        )}
      </div>

      <nav className="quiz-navigation">
        <button className="nav-button back-button" onClick={onBack}>
          ← Назад
        </button>
        
        {!showFeedback ? (
          <button 
            className="nav-button next-button"
            onClick={handleSubmitAnswer}
            disabled={selectedAnswer === null}
          >
            Ответить
          </button>
        ) : (
          <button 
            className="nav-button next-button"
            onClick={handleNextQuestion}
          >
            {isLastQuestion ? 'Завершить тест' : 'Следующий вопрос'} →
          </button>
        )}
      </nav>
    </div>
  )
}

export default QuizScreen
