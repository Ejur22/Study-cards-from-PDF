import { render, screen, fireEvent } from "@testing-library/react"
import LoginScreen from "../../components/LoginScreen"
import { vi } from "vitest"

// mock useAuth
const mockLogin = vi.fn()

vi.mock("../../AuthContext", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}))

describe("LoginScreen", () => {
  test("пользователь может ввести email и password", () => {
    render(<LoginScreen />)

    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    fireEvent.change(emailInput, {
      target: { value: "test@test.com" },
    })
    fireEvent.change(passwordInput, {
      target: { value: "123456" },
    })

    expect(emailInput.value).toBe("test@test.com")
    expect(passwordInput.value).toBe("123456")
  })

  test("submit вызывает login", () => {
    render(<LoginScreen />)

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@test.com" },
    })

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "123456" },
    })

    fireEvent.click(screen.getByRole("button"))

    expect(mockLogin).toHaveBeenCalledWith(
      "test@test.com",
      "123456"
    )
  })
})