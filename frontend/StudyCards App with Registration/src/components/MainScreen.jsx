import React, { useState } from 'react'
import './MainScreen.css'
import DictionaryWidget from './DictionaryWidget'

const MainScreen = ({ onFileUpload }) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      onFileUpload(file)   // ← вызываем передачу файла в App.jsx
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      onFileUpload(file)   // ← вызываем передачу файла в App.jsx
    }
  }


  return (
    <main className="main-screen">
      {/* Основной контент */}
      <article className="content-wrapper">
        <h1 className="main-title">Загрузите PDF для создания карточек</h1>
        <p className="main-subtitle">
          Мы автоматически создадим интерактивные карточки на основе вашего материала
        </p>
        
        {/* Семантическая разметка для области загрузки */}
        <section 
          className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          aria-label="Область для загрузки PDF файла"
          role="region"
        >
          <div className="upload-icon" aria-hidden="true">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="24" r="24" fill="#e5e7eb"/>
              <path d="M24 16L24 32M16 24L32 24" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          
          <h2 className="upload-title">Перетащите PDF файл сюда</h2>
          <p className="upload-subtitle">или нажмите для выбора файла</p>
          
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="file-input"
            id="file-upload"
            aria-label="Выбрать PDF файл для обработки"
          />
          <label htmlFor="file-upload" className="upload-button">
            Выбрать файл
          </label>
        </section>
        
        {/* Информация о поддерживаемых форматах */}
        <aside className="file-info" role="complementary">
          <strong>Требования:</strong> Поддерживается только PDF (макс. 10 МБ)
        </aside>
      </article>

      {/* Dictionary Widget - публичный контент без аутентификации */}
      <DictionaryWidget />
    </main>
  )
}

export default MainScreen
