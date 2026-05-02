import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    // Базовый URL приложения
    baseUrl: 'http://localhost:5173',
    
    // Время ожидания элементов (мс)
    defaultCommandTimeout: 10000,
    supportFile: false,
    // Время ожидания загрузки страницы (мс)
    pageLoadTimeout: 30000,
    
    // Размер окна браузера
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Видеозапись тестов
    video: false,
    videoUploadOnPasses: false,  // Не загружать видео успешных тестов
    
    // Скриншоты при ошибках
    screenshotOnRunFailure: true,
    
    // Поддержка API Интернета
    chromeWebSecurity: false,
    
    // Браузеры для запуска
    browser: ['chrome', 'firefox'],
    
    // Хедеры
    headers: {
      'Content-Type': 'application/json',
    },
    
    // Setup ноды для хуков
    setupNodeEvents(on, config) {
      // Логирование
      on('task', {
        log(message) {
          console.log(message)
          return null
        }
      })
      return config
    },
  },
})
