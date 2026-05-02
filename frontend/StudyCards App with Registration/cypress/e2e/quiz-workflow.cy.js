/**
 * cypress/e2e/quiz-workflow.cy.js
 * E2E тесты для главного workflow - загрузка PDF и прохождение теста
 */

describe('Quiz Workflow E2E Tests', () => {
  beforeEach(() => {
    // Логинимся перед каждым тестом
    cy.visit('/login')
    cy.get('input[type="email"]').type('quiz@test.com')
    cy.get('input[type="password"]').type('QuizPass123!')
    cy.contains('button', 'Войти').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should upload PDF and display questions', () => {
    // 1. На главной странице
    cy.contains('Загрузите PDF').should('be.visible')

    // 2. Загружаем PDF файл
    const fileName = 'sample.pdf'
    cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`)

    // 3. Видим что файл загружен (может быть прогресс)
    cy.contains('Загрузка', { timeout: 10000 }).should('exist')

    // 4. После загрузки видим вопросы (переход на /quiz/:groupId)
    cy.url({ timeout: 15000 }).should('include', '/quiz/')

    // 5. Проверяем структуру вопроса
    cy.contains('Вопрос').should('be.visible')
    cy.get('.quiz-option').should('have.length', 4)
    cy.contains('button', 'Далее').should('be.visible')
  })

  it('should navigate through quiz questions', () => {
    // Загружаем PDF
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')
    cy.url({ timeout: 15000 }).should('include', '/quiz/')

    // Количество вопросов (предположим 3)
    const questionCount = 3

    // Проходим через вопросы
    for (let i = 0; i < questionCount - 1; i++) {
      // Выбираем первый вариант ответа
      cy.get('.quiz-option').first().click()

      // Нажимаем "Далее"
      cy.contains('button', 'Далее').click()

      // Должны быть на следующем вопросе
      cy.contains(`Вопрос ${i + 2}`).should('be.visible')
    }

    // На последнем вопросе
    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Завершить').should('be.visible')
  })

  it('should show results after completing quiz', () => {
    // Загружаем PDF
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')
    cy.url({ timeout: 15000 }).should('include', '/quiz/')

    // Проходим все вопросы быстро
    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()

    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()

    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Завершить').click()

    // Видим результаты
    cy.url({ timeout: 5000 }).should('include', '/results')
    cy.contains('Результаты').should('be.visible')
    cy.contains('%').should('be.visible')  // Скор в процентах
  })

  it('should show history after quiz', () => {
    // Пройти тест
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')
    cy.url({ timeout: 15000 }).should('include', '/quiz/')

    // Быстро пройти все вопросы
    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()

    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()

    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Завершить').click()

    // На странице результатов
    cy.url().should('include', '/results')

    // Нажимаем "Вернуться на главную"
    cy.contains('button', 'Вернуться на главную').click()

    // Снова на главной
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Кликаем на "История"
    cy.contains('button', 'История').click()
    cy.url().should('include', '/history')

    // Видим наш недавний тест в истории
    cy.get('.history-item').should('have.length.greaterThan', 0)
  })

  it('should allow retaking same PDF', () => {
    // Первый раз проходим тест
    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')
    cy.url({ timeout: 15000 }).should('include', '/quiz/')

    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()
    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Далее').click()
    cy.get('.quiz-option').first().click()
    cy.contains('button', 'Завершить').click()

    cy.url().should('include', '/results')

    // Вернёмся на главную
    cy.contains('button', 'Вернуться на главную').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Видим загруженные ранее PDFs или список
    cy.contains('Загруженные материалы').should('be.visible')

    // Кликаем на один из загруженных
    cy.get('.group-item').first().click()

    // Видим вопросы снова
    cy.url({ timeout: 5000 }).should('include', '/quiz/')
  })
})

describe('Error Handling in Quiz', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('error@test.com')
    cy.get('input[type="password"]').type('ErrorPass123!')
    cy.contains('button', 'Войти').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should handle invalid file upload', () => {
    // Пытаемся загрузить текстовый файл вместо PDF
    cy.get('input[type="file"]').selectFile('cypress/fixtures/invalid.txt')

    // Должна быть ошибка
    cy.contains('Пожалуйста загрузите PDF файл', { timeout: 5000 }).should('be.visible')
  })

  it('should show error on network failure', () => {
    // Отключаем сеть
    cy.intercept('POST', '/api/upload', { statusCode: 500 })

    cy.get('input[type="file"]').selectFile('cypress/fixtures/sample.pdf')

    // Ошибка загрузки
    cy.contains('Ошибка при загрузке файла', { timeout: 5000 }).should('be.visible')
  })
})

describe('History Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/login')
    cy.get('input[type="email"]').type('history@test.com')
    cy.get('input[type="password"]').type('HistoryPass123!')
    cy.contains('button', 'Войти').click()
    cy.url().should('eq', Cypress.config().baseUrl + '/')
  })

  it('should display history with sorting', () => {
    cy.contains('button', 'История').click()
    cy.url().should('include', '/history')

    // История может быть пустая если первый раз
    // или иметь предыдущие тесты

    // Проверяем элементы управления
    cy.get('input[type="search"]').should('be.visible')  // Поиск
    cy.contains('Сортировка').should('be.visible')
  })

  it('should filter history by date', () => {
    cy.contains('button', 'История').click()
    cy.url().should('include', '/history')

    // Выбираем дату начала
    cy.get('input[type="date"]').first().type('2024-01-01')

    // История должна фильтраться
    cy.get('.history-item').should('exist')
  })

  it('should search in history', () => {
    cy.contains('button', 'История').click()

    // Вводим поисковый запрос
    cy.get('input[type="search"]').type('sample')

    // Должны отфильтроваться результаты
    cy.get('.history-item').should('have.length.greaterThan', 0)
  })
})
