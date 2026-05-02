# Frontend тестирование (добавить в frontend/StudyCards App with Registration/package.json)
# devDependencies:
{
  "@testing-library/react": "^14.1.2",
  "@testing-library/jest-dom": "^6.1.5",
  "@testing-library/user-event": "^14.5.1",
  "@vitest/ui": "^1.1.0",
  "vitest": "^1.1.0",
  "jsdom": "^23.0.1",
  "cypress": "^13.6.4",
  "jest-mock-axios": "^4.7.0",
  "msw": "^2.0.11"
}

# Скрипты (добавить в package.json)
"scripts": {
  "test": "vitest",
  "test:ui": "vitest --ui",
  "test:coverage": "vitest --coverage",
  "test:e2e": "cypress open",
  "test:e2e:ci": "cypress run"
}
