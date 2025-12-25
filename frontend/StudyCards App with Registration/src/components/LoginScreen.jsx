import React, { useState } from 'react'
import './RegistrationScreen.css'
import api from "../api";
import { useAuth } from "../AuthContext";


const LoginScreen = ({ onBack, onGoToRegister }) => {
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const params = new URLSearchParams();
      params.append("username", formData.email);
      params.append("password", formData.password);

      const res = await api.post("/auth/login", params, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      login(res.data.access_token);
    } catch (err) {
      alert(
        err.response?.data?.detail || "Ошибка входа"
      );
    }
  };
  
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
