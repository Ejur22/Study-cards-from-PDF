import React, { useEffect, useState } from 'react'
import BackButton from './BackButton'
import api from '../api'
import './HistoryPage.css'

const UsersPage = ({ onBack }) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const res = await api.get('/users')
        setUsers(res.data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Ошибка загрузки пользователей')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="history-page">
      <div className="history-header">
        <BackButton onBack={onBack} />
        <h1 className="history-title">Пользователи</h1>
      </div>

      <div className="history-content">
        {loading ? (
          <div className="loading">Загрузка...</div>
        ) : error ? (
          <div className="loading">{error}</div>
        ) : (
          <div className="history-list">
            {users.map((user) => (
              <div key={user.id} className="study-item">
                <div className="study-item-content">
                  <div className="study-item-info">
                    <span className="filename">{user.email}</span>
                    <span className="score-text">Роль: {user.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UsersPage
