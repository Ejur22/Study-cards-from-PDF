import React from 'react'
import './StudyItem.css'

const StudyItem = ({ filename, score, totalQuestions, onRepeatTest, canRepeat }) => {
  return (
    <div className="study-item">
      <div className="study-item-content">
        <div className="study-item-info">
          <span className="filename">{filename}</span>
        </div>
        
        <div className="study-item-actions">
          <div className="score">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" 
                fill="#22c55e"
              />
            </svg>
            <span className="score-text">{score}/{totalQuestions}</span>
          </div>
          {canRepeat && (
            <button className="repeat-button" onClick={onRepeatTest}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path 
                  d="M11.534 7h3.932a.25.25 0 0 1 .192.41l-1.966 2.36a.25.25 0 0 1-.384 0l-1.966-2.36A.25.25 0 0 1 11.534 7zm-10.66 0h3.932a.25.25 0 0 0 .192-.41L2.732 4.23a.25.25 0 0 0-.384 0L.382 6.59A.25.25 0 0 0 .874 7z" 
                  fill="white"
                />
                <path 
                  d="M8 3c-1.552 0-2.94.707-3.857 1.818a.5.5 0 1 1-.771-.636A6.002 6.002 0 0 1 13.917 7H12.9A5.002 5.002 0 0 0 8 3zM3.1 9a5.002 5.002 0 0 0 4.9 4c1.552 0 2.94-.707 3.857-1.818a.5.5 0 1 1 .771.636A6.002 6.002 0 0 1 2.083 9H3.1z" 
                  fill="white"
                />
              </svg>
              Повторить тест
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default StudyItem
