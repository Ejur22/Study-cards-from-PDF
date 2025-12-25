import React, { useState, useEffect } from 'react'
import BackButton from './BackButton'
import StudyItem from './StudyItem'
import './HistoryPage.css'
import api from "../api";
import { useAuth } from "../AuthContext";



const HistoryPage = ({ onBack }) => {
  const [historyItems, setHistoryItems] = useState([])
  const { isAuth } = useAuth();

  useEffect(() => {
    if (!isAuth) return;
    
    const fetchHistoryData = async () => {
      try {
        const res = await api.get("/groups/"); // GET "/" на backend
        // ожидаем формат: [{ id, filename, score, totalQuestions }]
        setHistoryItems(res.data); 
      } catch (err) {
        console.error("Ошибка загрузки истории:", err);
        setHistoryItems([]);
      }
    }

    fetchHistoryData();
  }, [isAuth]);

  const handleRepeatTest = (itemId) => {
    console.log(`Повторить тест для элемента с ID: ${itemId}`)
    // Здесь будет логика для повторного прохождения теста
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <BackButton onBack={onBack} />
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
