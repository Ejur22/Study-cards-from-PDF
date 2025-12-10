import React, { useState } from 'react'
import './RegistrationScreen.css'

const RegistrationScreen = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle registration logic here
    console.log('Registration data:', formData)
  }

  return (
    <div className="registration-screen">
      <div className="registration-wrapper">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Назад
        </button>
        
        <div className="registration-content">
          <h1 className="registration-title">Создать аккаунт</h1>
          <p className="registration-subtitle">
            Зарегистрируйтесь, чтобы сохранять свои карточки и отслеживать прогресс
          </p>
          
          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Имя</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Введите ваше имя"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Введите ваш email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password" className="form-label">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Создайте пароль"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">Подтвердите пароль</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Повторите пароль"
                required
              />
            </div>
            
            <button type="submit" className="submit-button">
              Зарегистрироваться
            </button>
          </form>
          
          <div className="login-link">
            <p>Уже есть аккаунт? <a href="#" className="link">Войти</a></p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationScreen
