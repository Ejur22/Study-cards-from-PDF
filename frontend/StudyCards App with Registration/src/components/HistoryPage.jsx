import React, { useState, useEffect } from 'react'
import BackButton from './BackButton'
import StudyItem from './StudyItem'
import './HistoryPage.css'
import api, { downloadFile } from "../api"
import { useAuth } from "../AuthContext"

const HistoryPage = ({ onBack }) => {
  const { isAuth, role } = useAuth()
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 10, pages: 0 })
  const [loading, setLoading] = useState(false)

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    dateFrom: '',
    dateTo: '',
    scoreMin: '',
    scoreMax: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  })

  // Sync filters with URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    setFilters({
      search: urlParams.get('search') || '',
      dateFrom: urlParams.get('date_from') || '',
      dateTo: urlParams.get('date_to') || '',
      scoreMin: urlParams.get('score_min') || '',
      scoreMax: urlParams.get('score_max') || '',
      sortBy: urlParams.get('sort_by') || 'created_at',
      sortOrder: urlParams.get('sort_order') || 'desc',
      page: parseInt(urlParams.get('page')) || 1,
      limit: parseInt(urlParams.get('limit')) || 10
    })
  }, [])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString())
      }
    })
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`)
  }, [filters])

  // Fetch data
  useEffect(() => {
    if (!isAuth) return

    const fetchData = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams()
        if (filters.search) params.append('search', filters.search)
        if (filters.dateFrom) params.append('date_from', filters.dateFrom)
        if (filters.dateTo) params.append('date_to', filters.dateTo)
        if (filters.scoreMin) params.append('score_min', filters.scoreMin)
        if (filters.scoreMax) params.append('score_max', filters.scoreMax)
        params.append('sort_by', filters.sortBy)
        params.append('sort_order', filters.sortOrder)
        params.append('page', filters.page.toString())
        params.append('limit', filters.limit.toString())

        const res = await api.get(`/groups/?${params}`)
        setData(res.data)
      } catch (err) {
        console.error("Ошибка загрузки истории:", err)
        setData({ items: [], total: 0, page: 1, limit: 10, pages: 0 })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [isAuth, filters])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 })) // Reset to page 1 on filter change
  }

  const handleDownload = async (groupId, filename) => {
    try {
      await downloadFile(groupId, filename)
    } catch (err) {
      alert('Ошибка скачивания файла')
    }
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

      {/* Filters */}
      <div className="filters-section">
        <div className="filter-row">
          <input
            type="text"
            placeholder="Поиск по имени файла"
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            placeholder="Дата от"
            value={filters.dateFrom}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
            className="filter-input"
          />
          <input
            type="date"
            placeholder="Дата до"
            value={filters.dateTo}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-row">
          <input
            type="number"
            placeholder="Мин. балл"
            value={filters.scoreMin}
            onChange={(e) => handleFilterChange('scoreMin', e.target.value)}
            className="filter-input"
            min="0"
            max="100"
          />
          <input
            type="number"
            placeholder="Макс. балл"
            value={filters.scoreMax}
            onChange={(e) => handleFilterChange('scoreMax', e.target.value)}
            className="filter-input"
            min="0"
            max="100"
          />
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="filter-select"
          >
            <option value="created_at">По дате</option>
            <option value="filename">По имени</option>
            <option value="score">По баллу</option>
          </select>
          <select
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="filter-select"
          >
            <option value="desc">Убывание</option>
            <option value="asc">Возрастание</option>
          </select>
        </div>
      </div>

      <div className="history-content">
        <div className="history-list">
          {loading ? (
            <div className="loading">Загрузка...</div>
          ) : data.items.length === 0 ? (
            <div className="no-data">Нет данных</div>
          ) : (
            data.items.map(item => (
              <StudyItem
                key={item.id}
                filename={item.filename}
                score={item.score}
                correctAnswers={item.correct_answers}
                totalQuestions={item.flashcards_count}
                onDownload={() => handleDownload(item.id, item.filename)}
                onRepeatTest={(role === "user" || role === "admin") ? () => handleRepeatTest(item.id) : undefined}
                canRepeat={role === "user" || role === "admin"}
              />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="pagination">
          <button
            className="history-button pagination-button"
            onClick={() => handleFilterChange('page', filters.page - 1)}
            disabled={filters.page === 1}
          >
            ← Назад
          </button>
          <span>Страница {data.page} из {data.pages}</span>
          <button
            className="history-button pagination-button"
            onClick={() => handleFilterChange('page', filters.page + 1)}
            disabled={filters.page === data.pages}
          >
            Вперед →
          </button>
        </div>
      )}
    </div>
  )
}

export default HistoryPage
