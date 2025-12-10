import React, { useRef, useState } from 'react'

const UploadScreen = ({ onFileUpload, onStartTest, uploadedFile }) => {
  const fileInputRef = useRef(null)
  const [isDragOver, setIsDragOver] = useState(false)

  const handleFileSelect = (file) => {
    if (file && file.type === 'application/pdf') {
      onFileUpload(file)
    } else {
      alert('Пожалуйста, выберите PDF файл')
    }
  }

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
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  return (
    <div className="upload-screen">
      <h1>Генератор тестов</h1>
      <p>Загрузите PDF файл для создания теста на основе его содержания</p>
      
      <div
        className={`upload-area ${isDragOver ? 'dragover' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <div className="upload-icon">📄</div>
        <div className="upload-text">
          {uploadedFile ? uploadedFile.name : 'Перетащите PDF файл сюда'}
        </div>
        <div className="upload-subtext">
          {uploadedFile ? 'Файл загружен успешно' : 'или нажмите для выбора файла'}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInputChange}
        className="file-input"
      />

      {uploadedFile && (
        <button className="start-test-btn" onClick={onStartTest}>
          Начать тест
        </button>
      )}
    </div>
  )
}

export default UploadScreen
