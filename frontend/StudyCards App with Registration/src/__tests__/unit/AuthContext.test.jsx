import { renderHook, act } from "@testing-library/react"
import { AuthProvider, useAuth } from "../../AuthContext"
import { vi } from "vitest"
import api from "../../api"

// mock API
vi.mock("../../api", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe("AuthContext", () => {
  test("успешный checkAuth устанавливает пользователя", async () => {
    api.get.mockResolvedValueOnce({
      data: { id: 1, email: "test@test.com" },
    })

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.checkAuth()
    })

    expect(result.current.user).toEqual({
      id: 1,
      email: "test@test.com",
    })
  })

  test("ошибка checkAuth → user = null", async () => {
    api.get.mockRejectedValueOnce(new Error("401"))

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.checkAuth()
    })

    expect(result.current.user).toBe(null)
  })

  test("login вызывает API и затем checkAuth", async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    api.get.mockResolvedValueOnce({
      data: { id: 1, email: "test@test.com" },
    })

    const wrapper = ({ children }) => (
      <AuthProvider>{children}</AuthProvider>
    )

    const { result } = renderHook(() => useAuth(), { wrapper })

    await act(async () => {
      await result.current.login("test@test.com", "123456")
    })

    expect(api.post).toHaveBeenCalled()
    expect(api.get).toHaveBeenCalled()
  })
})