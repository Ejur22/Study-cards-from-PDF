import React from 'react'

const ResultsScreen = ({ results, onRestart }) => {
  const { correctAnswers, incorrectAnswers, totalQuestions, accuracy } = results

  return (
    <div className="results-screen">
      <h1 className="results-title">Результаты теста</h1>
      
      <div className="results-stats">
        <div className="stat-card">
          <div className="stat-number correct">{correctAnswers}</div>
          <div className="stat-label">Правильных ответов</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number incorrect">{incorrectAnswers}</div>
          <div className="stat-label">Неправильных ответов</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number accuracy">{accuracy}%</div>
          <div className="stat-label">Точность</div>
        </div>
      </div>

      <button className="restart-button" onClick={onRestart}>
        Вернуться в меню
      </button>
    </div>
  )
}

export default ResultsScreen
