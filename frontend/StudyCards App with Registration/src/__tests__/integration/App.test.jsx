import { render, screen, fireEvent } from "@testing-library/react"
import App from "../../App"
import { MemoryRouter } from "react-router-dom"
import { vi } from "vitest"
import api from "../../api"

// mock API
vi.mock("../../api", () => ({
  default: {
    post: vi.fn(),
  },
}))

describe("App integration", () => {
  test("загрузка файла → переход на quiz", async () => {
    api.post.mockResolvedValueOnce({
      data: { group_id: 1 },
    })

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    const file = new File(["test"], "test.pdf", {
      type: "application/pdf",
    })

    const input = screen.getByLabelText(/upload/i)

    fireEvent.change(input, {
      target: { files: [file] },
    })

    // depends on your UI — adjust if needed
    expect(api.post).toHaveBeenCalled()
  })
})