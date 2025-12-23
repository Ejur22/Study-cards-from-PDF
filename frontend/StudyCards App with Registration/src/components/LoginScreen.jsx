import React, { useState } from 'react'
import './RegistrationScreen.css'

const LoginScreen = ({ onBack, onGoToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
    // Логика входа
    console.log('Login data:', formData)
  }

  return (
    <div className="registration-screen">
      <div className="registration-wrapper">
        <button className="back-button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Назад
        </button>

        <div className="registration-content">
          <h1 className="registration-title">Вход</h1>
          <p className="registration-subtitle">
            Войдите в аккаунт, чтобы продолжить работу
          </p>

          <form className="registration-form" onSubmit={handleSubmit}>
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
                placeholder="Введите пароль"
                required
              />
            </div>

            <button type="submit" className="submit-button">
              Войти
            </button>
          </form>

          <div className="login-link">
            <p>
              Нет аккаунта?{' '}
              <button className="link-button" onClick={onGoToRegister}>
                Зарегистрироваться
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
