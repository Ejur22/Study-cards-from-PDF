import React, { useState } from 'react'
import './RegistrationScreen.css'
import api from "../api";
import { useNavigate } from "react-router-dom";


const RegistrationScreen = ({ onBack, onGoToLogin }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // РЕГИСТРАЦИЯ
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      await api.post("/auth/register", {
        full_name: formData.name,   // 👈 адаптация под backend
        email: formData.email,
        password: formData.password
      });

      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.detail || "Ошибка регистрации"
      );
    }
  };

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
                placeholder="Придумайте пароль"
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
            <p>Уже есть аккаунт? 
              <button
                type="button"
                className="link-button"
                onClick={onGoToLogin}
              >
                Войти
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationScreen
