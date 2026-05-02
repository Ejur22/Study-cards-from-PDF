import { render, screen } from "@testing-library/react"
import MainScreen from "../../components/MainScreen"
import { vi } from "vitest"

// mock API
vi.mock("../../api", () => ({
  default: {
    get: vi.fn().mockResolvedValue({
      data: {
        word: "test",
        definition: "test definition",
      },
    }),
  },
}))

describe("MainScreen", () => {
  test("отображается основной экран", async () => {
    render(<MainScreen />)

    expect(await screen.findByText(/test/i)).toBeInTheDocument()
  })
})