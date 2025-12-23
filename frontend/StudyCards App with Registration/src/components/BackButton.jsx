import React from 'react'
import './BackButton.css'

const BackButton = ({ onBack }) => {

  return (
    <button className="back-button" onClick={onBack}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path 
          d="M15 18L9 12L15 6" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      <span>Назад</span>
    </button>
  )
}

export default BackButton
