import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "../app/(auth)/_components/loginform";
import '@testing-library/jest-dom';
import { useRouter } from "next/navigation";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("LoginForm", () => {
  const replaceMock = jest.fn();
  const refreshMock = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      replace: replaceMock,
      refresh: refreshMock,
    });
    render(<LoginForm />);
  });

  test("renders email, password, and login button", () => {
    expect(screen.getByPlaceholderText(/name@example.com/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/••••••/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();
  });

  test("shows validation errors if empty submit", async () => {
    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      // Match the actual Zod error messages
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument();
      expect(screen.getByText(/Minimum 6 characters/i)).toBeInTheDocument();
    });
  });

  test("successful login redirects to dashboard", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        token: "mockToken",
        user: { email: "test@example.com", role: "user" },
      }),
    } as any);

    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(replaceMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("failed login shows error message", async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: "Invalid credentials" }),
    } as any);

    fireEvent.change(screen.getByPlaceholderText(/name@example.com/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/••••••/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/Invalid credentials/i)).toBeInTheDocument();
    });
  });

  test("updates email input when user types", () => {
  const emailInput = screen.getByPlaceholderText(/name@example.com/i);

  fireEvent.change(emailInput, {
    target: { value: "sabbu@test.com" },
  });

  expect(emailInput).toHaveValue("sabbu@test.com");
});

  test("updates password input when user types", () => {
  const passwordInput = screen.getByPlaceholderText(/••••••/i);

  fireEvent.change(passwordInput, {
    target: { value: "mypassword" },
  });

  expect(passwordInput).toHaveValue("mypassword");
  });
});