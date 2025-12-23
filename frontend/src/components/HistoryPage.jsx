import React, { useState, useEffect } from 'react'
import BackButton from './BackButton'
import StudyItem from './StudyItem'
import './HistoryPage.css'

const HistoryPage = () => {
  const [historyItems, setHistoryItems] = useState([])

  // Симуляция загрузки данных из базы данных
  useEffect(() => {
    const fetchHistoryData = async () => {
      // Имитация API запроса
      const mockData = [
        {
          id: 1,
          filename: '123123.pdf',
          score: 17,
          totalQuestions: 20
        },
        {
          id: 2,
          filename: 'trigonometry.pdf',
          score: 15,
          totalQuestions: 20
        }
      ]
      
      // Имитация задержки загрузки
      setTimeout(() => {
        setHistoryItems(mockData)
      }, 500)
    }

    fetchHistoryData()
  }, [])

  const handleRepeatTest = (itemId) => {
    console.log(`Повторить тест для элемента с ID: ${itemId}`)
    // Здесь будет логика для повторного прохождения теста
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <BackButton />
        <h1 className="history-title">История</h1>
      </div>
      
      <div className="history-content">
        <div className="history-list">
          {historyItems.length === 0 ? (
            <div className="loading">Загрузка...</div>
          ) : (
            historyItems.map(item => (
              <StudyItem
                key={item.id}
                filename={item.filename}
                score={item.score}
                totalQuestions={item.totalQuestions}
                onRepeatTest={() => handleRepeatTest(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default HistoryPage
