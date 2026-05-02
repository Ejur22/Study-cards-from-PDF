/**
 * cypress/e2e/authentication.cy.js
 * E2E тесты для аутентификации
 * 
 * Запуск: npx cypress run --spec cypress/e2e/authentication.cy.js
 *        npx cypress open (интерактивный режим)
 */

describe('Authentication E2E Tests', () => {
  beforeEach(() => {
    // Перед каждым тестом переходим на главную
    cy.visit('/')
    // Убеждаемся что приложение загрузилось
    cy.contains('Загрузите PDF').should('be.visible')
  })

  describe('Registration Flow', () => {
    it('should successfully register new user', () => {
      // 1. Нажимаем кнопку "Регистрация"
      cy.contains('button', 'Регистрация').click()
      cy.url().should('include', '/registration')

      // 2. Проверяем что форма видна
      cy.contains('Регистрация').should('be.visible')
      cy.get('input[type="email"]').should('be.visible')
      cy.get('input[type="password"]').should('be.visible')

      // 3. Заполняем форму
      cy.get('input[type="email"]').type('newuser@test.com')
      cy.get('input[type="password"]').type('StrongPass123!')
      cy.get('input[type="text"]').first().type('Test User')

      // 4. Нажимаем "Зарегистрироваться"
      cy.contains('button', 'Зарегистрироваться').click()

      // 5. Должны быть на главной странице
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Загрузите PDF').should('be.visible')

      // 6. Проверяем что авторизованы (есть кнопка выхода)
      cy.contains('button', 'Выход').should('be.visible')
    })

    it('should show error on duplicate email', () => {
      cy.contains('button', 'Регистрация').click()

      // Вводим данные
      cy.get('input[type="email"]').type('existing@test.com')
      cy.get('input[type="password"]').type('StrongPass123!')
      cy.get('input[type="text"]').first().type('Test User')

      cy.contains('button', 'Зарегистрироваться').click()

      // Ошибка в ответе
      cy.contains('уже существует', { timeout: 5000 }).should('be.visible')
    })

    it('should validate weak passwords', () => {
      cy.contains('button', 'Регистрация').click()

      // Пытаемся создать пароль слишком короткий
      cy.get('input[type="email"]').type('user@test.com')
      cy.get('input[type="password"]').type('123')  // Слишком короткий

      // Должна быть ошибка валидации
      cy.contains('Пароль должен быть').should('be.visible')
    })
  })

  describe('Login Flow', () => {
    beforeEach(() => {
      // Сначала регистрируемся
      cy.contains('button', 'Регистрация').click()
      cy.get('input[type="email"]').type('login@test.com')
      cy.get('input[type="password"]').type('LoginPass123!')
      cy.get('input[type="text"]').first().type('Login User')
      cy.contains('button', 'Зарегистрироваться').click()

      // После регистрации логимся (или должны быть автоматически)
      // Выходим для проверки логина
      cy.contains('button', 'Выход').click()
      cy.url().should('include', '/login')
    })

    it('should successfully login', () => {
      // На странице логина
      cy.url().should('include', '/login')

      // Заполняем форму
      cy.get('input[type="email"]').type('login@test.com')
      cy.get('input[type="password"]').type('LoginPass123!')

      // Нажимаем "Войти"
      cy.contains('button', 'Войти').click()

      // Должны быть на главной
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.contains('Загрузите PDF').should('be.visible')
      cy.contains('button', 'Выход').should('be.visible')
    })

    it('should show error on invalid credentials', () => {
      cy.get('input[type="email"]').type('login@test.com')
      cy.get('input[type="password"]').type('WrongPassword')

      cy.contains('button', 'Войти').click()

      // Ошибка
      cy.contains('Неверные учётные данные', { timeout: 5000 }).should('be.visible')

      // Остаёмся на странице логина
      cy.url().should('include', '/login')
    })

    it('should show error on nonexistent email', () => {
      cy.get('input[type="email"]').type('nonexistent@test.com')
      cy.get('input[type="password"]').type('AnyPass123!')

      cy.contains('button', 'Войти').click()

      cy.contains('Неверные учётные данные', { timeout: 5000 }).should('be.visible')
    })

    it('should logout successfully', () => {
      // Логинимся
      cy.get('input[type="email"]').type('login@test.com')
      cy.get('input[type="password"]').type('LoginPass123!')
      cy.contains('button', 'Войти').click()

      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Выходим
      cy.contains('button', 'Выход').click()

      // Должны быть на странице логина
      cy.url().should('include', '/login')
      cy.contains('Выход').should('not.exist')
    })
  })

  describe('Session Persistence', () => {
    it('should maintain session after page refresh', () => {
      // Логинимся
      cy.visit('/login')
      cy.get('input[type="email"]').type('session@test.com')
      cy.get('input[type="password"]').type('SessionPass123!')
      cy.contains('button', 'Войти').click()

      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Перезагружаем страницу
      cy.reload()

      // Должны остаться авторизованы
      cy.contains('Загрузите PDF').should('be.visible')
      cy.contains('button', 'Выход').should('be.visible')
    })
  })
})
