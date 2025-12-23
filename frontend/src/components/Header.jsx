import React from 'react'
import './Header.css'

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect width="32" height="32" rx="8" fill="#4A90E2"/>
            <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white"/>
          </svg>
          <span className="logo-text">StudyCards</span>
        </div>
      </div>
    </header>
  )
}

export default Header
