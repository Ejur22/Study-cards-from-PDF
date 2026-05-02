import { render, screen, fireEvent } from '@testing-library/react'
import QuizScreen from '../../components/QuizScreen'

const questions = [
  {
    question: '2 + 2 = ?',
    options: ['3', '4', '5'],
    correctAnswer: 1
  }
]

describe('QuizScreen', () => {
  test('пользователь проходит вопрос и завершает тест', () => {
    const onComplete = vi.fn()

    render(<QuizScreen questions={questions} onComplete={onComplete} />)

    // выбрать ответ
    fireEvent.click(screen.getByText('4'))

    // нажать "Ответить"
    fireEvent.click(screen.getByText(/ответить/i))

    // появляется feedback
    expect(screen.getByText(/правильно/i)).toBeInTheDocument()

    // завершить тест
    fireEvent.click(screen.getByText(/завершить тест/i))

    expect(onComplete).toHaveBeenCalledWith(
      expect.objectContaining({
        correctAnswers: 1,
        totalQuestions: 1,
        accuracy: 100
      })
    )
  })
})