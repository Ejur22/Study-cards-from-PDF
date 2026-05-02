"""
FRONTEND TESTING GUIDE - React + Vitest

Этот файл показывает как писать тесты для фронтенда на React
"""

# ==================== СТРУКТУРА ФРОНТЕНД ТЕСТОВ ====================

Структура папок:
frontend/StudyCards App with Registration/
├── src/
│   ├── __tests__/
│   │   ├── unit/
│   │   │   ├── AuthContext.test.jsx
│   │   │   ├── utils/
│   │   │   │   └── validators.test.js
│   │   │   └── components/
│   │   │       ├── LoginForm.test.jsx
│   │   │       ├── HistoryPage.test.jsx
│   │   │       └── DictionaryWidget.test.jsx
│   │   ├── integration/
│   │   │   ├── AuthFlow.test.jsx
│   │   │   ├── QuizFlow.test.jsx
│   │   │   └── FileUpload.test.jsx
│   │   └── e2e/
│   │       ├── authentication.cy.js
│   │       ├── full-workflow.cy.js
│   │       └── error-handling.cy.js
│   ├── components/
│   ├── utils/
│   └── App.jsx
├── vitest.config.js
└── package.json


# ==================== ПРИМЕРЫ ТЕСТОВ ====================

# 1️⃣ UNIT ТЕСТ - Функция валидации
# tests/unit/utils/validators.test.js

import { describe, it, expect } from 'vitest'
import { isValidEmail, isStrongPassword } from '../../../src/utils/validators'

describe('Email Validation', () => {
  it('should validate correct email', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('test.user+tag@domain.co.uk')).toBe(true)
  })

  it('should reject invalid emails', () => {
    expect(isValidEmail('invalid.email')).toBe(false)
    expect(isValidEmail('user@')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('Password Strength', () => {
  it('should accept strong passwords', () => {
    expect(isStrongPassword('SecurePass123!')).toBe(true)
    expect(isStrongPassword('MyPassword456@')).toBe(true)
  })

  it('should reject weak passwords', () => {
    expect(isStrongPassword('123')).toBe(false)  // Слишком короткий
    expect(isStrongPassword('password')).toBe(false)  // Нет цифр
    expect(isStrongPassword('PASSWORD')).toBe(false)  // Нет строчных букв
  })
})


# 2️⃣ UNIT ТЕСТ - React Компонент
# tests/unit/components/LoginForm.test.jsx

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '../../../src/components/LoginForm'

describe('LoginForm Component', () => {
  it('should render login form', () => {
    const mockLogin = vi.fn()
    render(<LoginForm onLogin={mockLogin} />)
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /войти/i })).toBeInTheDocument()
  })

  it('should call onLogin with email and password', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true })
    render(<LoginForm onLogin={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'user@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123')
    })
  })

  it('should show error message on login failure', async () => {
    const mockLogin = vi.fn().mockRejectedValue({ 
      response: { data: { detail: 'Invalid credentials' } } 
    })
    render(<LoginForm onLogin={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'user@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'wrong' } 
    })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should disable button while loading', async () => {
    const mockLogin = vi.fn(() => new Promise(r => setTimeout(r, 1000)))
    render(<LoginForm onLogin={mockLogin} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'user@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    })
    
    const button = screen.getByRole('button', { name: /войти/i })
    fireEvent.click(button)
    
    expect(button).toBeDisabled()
    expect(screen.getByText(/загрузка/i)).toBeInTheDocument()
  })
})


# 3️⃣ ИНТЕГРАЦИОННЫЙ ТЕСТ - AuthContext
# tests/integration/AuthFlow.test.jsx

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '../../../src/AuthContext'
import { LoginForm } from '../../../src/components/LoginForm'

const TestComponent = () => {
  const { isAuth, login } = useAuth()
  return (
    <div>
      <div>{isAuth ? 'Authenticated' : 'Not Authenticated'}</div>
      <LoginForm onLogin={login} />
    </div>
  )
}

describe('Authentication Flow', () => {
  it('should update auth state after successful login', async () => {
    // Мокируем API запрос
    global.fetch = vi.fn()
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ access_token: 'token123' }),
        { status: 200 }
      ))
      .mockResolvedValueOnce(new Response(
        JSON.stringify({ email: 'user@example.com' }),
        { status: 200 }
      ))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByText('Not Authenticated')).toBeInTheDocument()

    // Логинимся
    fireEvent.change(screen.getByLabelText(/email/i), { 
      target: { value: 'user@example.com' } 
    })
    fireEvent.change(screen.getByLabelText(/password/i), { 
      target: { value: 'password123' } 
    })
    fireEvent.click(screen.getByRole('button', { name: /войти/i }))

    // Проверяем что auth state обновился
    await waitFor(() => {
      expect(screen.getByText('Authenticated')).toBeInTheDocument()
    })
  })
})


# 4️⃣ E2E ТЕСТ - Полный workflow с Cypress
# tests/e2e/full-workflow.cy.js

describe('Full Workflow E2E Test', () => {
  it('should complete full registration -> login -> upload -> test cycle', () => {
    // 1. Переходим на главную
    cy.visit('http://localhost:5173')
    cy.contains('Загрузите PDF').should('be.visible')

    // 2. Нажимаем "Регистрация"
    cy.contains('Регистрация').click()
    cy.url().should('include', '/registration')

    // 3. Заполняем форму регистрации
    cy.get('input[name="email"]').type('newuser@example.com')
    cy.get('input[name="password"]').type('SecurePass123!')
    cy.get('input[name="full_name"]').type('John Doe')
    cy.contains('Зарегистрироваться').click()

    // 4. Проверяем автоматический редирект на главную
    cy.url().should('eq', 'http://localhost:5173/')
    cy.contains('Загрузите PDF').should('be.visible')

    // 5. Загружаем PDF
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')

    // 6. Видим вопросы теста
    cy.get('.quiz-question', { timeout: 10000 }).should('be.visible')

    // 7. Отвечаем на все вопросы
    for (let i = 0; i < 3; i++) {
      cy.get('.quiz-option').first().click()
      cy.contains('Далее').click()
    }

    // 8. Видим результаты
    cy.get('.results-score').should('contain', '%')
    cy.contains('Вернуться на главную').click()

    // 9. Проверяем что вернулись на главную
    cy.url().should('eq', 'http://localhost:5173/')
  })

  it('should handle login errors gracefully', () => {
    cy.visit('http://localhost:5173/login')

    // Пытаемся логиниться с неправильным паролем
    cy.get('input[name="email"]').type('user@example.com')
    cy.get('input[name="password"]').type('WrongPassword')
    cy.contains('Войти').click()

    // Видим сообщение об ошибке
    cy.contains('Ошибка аутентификации').should('be.visible')

    // Остаёмся на странице логина
    cy.url().should('include', '/login')
  })
})


# ==================== ЗАПУСК ТЕСТОВ ====================

# Unit тесты
npm test

# Unit тесты с UI
npm run test:ui

# Unit тесты + coverage
npm run test:coverage

# E2E тесты (интерактивно)
npm run test:e2e

# E2E тесты (CI/CD)
npm run test:e2e:ci

# Запуск конкретного теста
npm test LoginForm

# Запуск тестов в watch режиме
npm test -- --watch


# ==================== СТРУКТУРА ТЕСТОВОГО КОДА ====================

Хорошие практики:

1. ✅ Ясные имена тестов:
   ❌ it('works')
   ✅ it('should display error message when login fails')

2. ✅ Arrange-Act-Assert (AAA) паттерн:
   describe('LoginForm', () => {
     it('should call onLogin when form submitted', () => {
       // ARRANGE - подготавливаем
       const mockLogin = vi.fn()
       render(<LoginForm onLogin={mockLogin} />)
       
       // ACT - выполняем действие
       fireEvent.click(screen.getByRole('button'))
       
       // ASSERT - проверяем результат
       expect(mockLogin).toHaveBeenCalled()
     })
   })

3. ✅ One assertion per test (когда возможно)
   ❌ it('works', () => {
        expect(a).toBe(1)
        expect(b).toBe(2)
        expect(c).toBe(3)
      })
   ✅ it('should set value to 1', () => {
        expect(result.value).toBe(1)
      })

4. ✅ Используем data-testid для выбора элементов в компонентах
   <button data-testid="submit-button">Отправить</button>
   screen.getByTestId('submit-button')

5. ✅ Мокируем внешние зависимости
   vi.mock('../api', () => ({
     login: vi.fn()
   }))
