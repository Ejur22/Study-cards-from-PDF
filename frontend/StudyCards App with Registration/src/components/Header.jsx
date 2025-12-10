import React from 'react'
import './Header.css'

const Header = ({ onAvatarClick }) => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#4285f4"/>
              <path d="M8 12L16 8L24 12V20L16 24L8 20V12Z" fill="white"/>
            </svg>
          </div>
          <h1 className="logo-text">StudyCards</h1>
        </div>
        <div className="header-right">
          <span className="history-text">История</span>
          <button className="avatar-button" onClick={onAvatarClick}>
            <div className="avatar-circle">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C11.1046 2 12 2.89543 12 4C12 5.10457 11.1046 6 10 6C8.89543 6 8 5.10457 8 4C8 2.89543 8.89543 2 10 2Z" fill="#9ca3af"/>
                <path d="M10 8C12.7614 8 15 10.2386 15 13V16C15 16.5523 14.5523 17 14 17H6C5.44772 17 5 16.5523 5 16V13C5 10.2386 7.23858 8 10 8Z" fill="#9ca3af"/>
              </svg>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
