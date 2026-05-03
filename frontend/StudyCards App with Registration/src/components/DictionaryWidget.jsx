import React, { useState, useEffect, Suspense } from 'react'
import './DictionaryWidget.css'
import api from '../api'

/**
 * DictionaryWidget - компонент для отображения слова дня
 * - Автоматическая загрузка с бэкэнда
 * - Graceful degradation при ошибке
 * - Lazy loading с состояниями загрузки
 */
const DictionaryWidget = () => {
  const [word, setWord] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWordOfDay = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/dictionary/word-of-day', {
        timeout: 5000  // Таймаут 5 секунд
      })
      
      if (response.data) {
        setWord(response.data)
      }
    } catch (err) {
      console.error('Failed to fetch word of day:', err)
      setError('Не удалось загрузить слово дня')
      
      // Graceful degradation - показываем placeholder
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWordOfDay()
  }, [])

  const handleRetry = async () => {
    await fetchWordOfDay()
  }

  // Состояние загрузки
  if (loading) {
    return (
      <section className="dictionary-widget loading" aria-label="Загрузка слова дня">
        <div className="dict-skeleton">
          <div className="skeleton-word"></div>
          <div className="skeleton-text"></div>
          <div className="skeleton-text short"></div>
        </div>
      </section>
    )
  }

  // Состояние ошибки
  if (error || !word) {
    return (
      <section className="dictionary-widget error" aria-label="Ошибка загрузки слова дня">
        <div className="error-content">
          <h3>📖 Словарь временно недоступен</h3>
          <p>{error || 'Не удалось загрузить слово дня'}</p>
          <button 
            className="retry-btn"
            onClick={handleRetry}
            aria-label="Повторить попытку"
          >
            🔄 Повторить
          </button>
        </div>
      </section>
    )
  }

  // Успешная загрузка
  return (
    <section 
      className="dictionary-widget" 
      aria-label={`Слово дня: ${word.word}`}
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <h2 className="dict-title">📖 Слово дня</h2>
      
      <div className="dict-content">
        <h3 className="dict-word" itemProp="name">
          {word.word}
        </h3>

        {word.part_of_speech && (
          <span className="dict-pos">
            {word.part_of_speech}
          </span>
        )}

        <div className="dict-definition">
          <h4>Определение:</h4>
          <p itemProp="description">
            {word.definition}
          </p>
        </div>

        {word.example && (
          <div className="dict-example">
            <h4>Пример:</h4>
            <p className="example-text">
              <em>«{word.example}»</em>
            </p>
          </div>
        )}

        {word.schema && (
          <script 
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(word.schema) }}
          />
        )}
      </div>


    </section>
  )
}

export default DictionaryWidget
