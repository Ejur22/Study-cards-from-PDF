import React, { useState, useEffect, useMemo } from 'react'
import BackButton from './BackButton'
import StudyItem from './StudyItem'
import './HistoryPage.css'
import api from "../api"
import { useAuth } from "../AuthContext"

const ITEMS_PER_PAGE = 5

const HistoryPage = ({ onBack }) => {
  const [historyItems, setHistoryItems] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc') // asc | desc
  const { isAuth, role } = useAuth()

  useEffect(() => {
    if (!isAuth) return

    const fetchHistoryData = async () => {
      try {
        const res = await api.get("/groups/")
        setHistoryItems(res.data)
      } catch (err) {
        console.error("Ошибка загрузки истории:", err)
        setHistoryItems([])
      }
    }

    fetchHistoryData()
  }, [isAuth])

  // ---------- Сортировка ----------
  const sortedItems = useMemo(() => {
    if (sortOrder === 'asc') {
      return [...historyItems]
  }
  return [...historyItems].reverse()
  }, [historyItems, sortOrder])
  // ---------- Пагинация ----------
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE)

  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return sortedItems.slice(startIndex, endIndex)
  }, [sortedItems, currentPage])

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))
    setCurrentPage(1)
  }

  const handleRepeatTest = (itemId) => {
    console.log(`Повторить тест для элемента с ID: ${itemId}`)
  }

  return (
    <div className="history-page">
      <div className="history-header">
        <BackButton onBack={onBack} />
        <h1 className="history-title">История</h1>
      </div>

      {/* ---------- Панель управления ---------- */}
      <div className="history-controls">
        <button className="sort-button" onClick={toggleSortOrder}>
          {sortOrder === 'asc' ? '↑ Сначала новые' : '↓ Сначала старые'}
        </button>
      </div>

      <div className="history-content">
        <div className="history-list">
          {historyItems.length === 0 ? (
            <div className="loading">Загрузка...</div>
          ) : (
            paginatedItems.map(item => (
              <StudyItem
                key={item.id}
                filename={item.filename}
                score={item.score}
                totalQuestions={item.totalQuestions}
                onRepeatTest={(role === "user" || role === "admin") ? () => handleRepeatTest(item.id) : undefined}
                canRepeat={role === "user" || role === "admin"}
              />
            ))
          )}
        </div>
      </div>

      {/* ---------- Пагинация ---------- */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="history-button pagination-button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            ← Назад
          </button>

          <span>
            Страница {currentPage} из {totalPages}
          </span>

          <button className="history-button pagination-button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Вперёд →
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
