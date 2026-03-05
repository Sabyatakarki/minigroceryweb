import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ForgetPasswordPage, { RequestPasswordResetSchema } from "../app/(auth)/forget-password/page"; // adjust path
import '@testing-library/jest-dom';
import { toast } from "react-toastify";

// Mock next/navigation (if you navigate inside page in future)
import { useRouter } from "next/navigation";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock toast notifications
jest.mock("react-toastify", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  ToastContainer: () => <div />,
}));

// Mock API function
jest.mock("@/lib/api/auth", () => ({
  requestPasswordReset: jest.fn(),
}));
import { requestPasswordReset } from "@/lib/api/auth";

describe("ForgetPasswordPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    render(<ForgetPasswordPage />);
  });

  test("renders heading, subtitle, input, and button", () => {
    expect(screen.getByText(/Forget password\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Enter your email and we’ll send you a reset link/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Send reset link/i })).toBeInTheDocument();
  });

  test("shows validation error when email is empty or invalid", async () => {
    const button = screen.getByRole("button", { name: /Send reset link/i });

    // Submit empty input
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });

    // Type invalid email
    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), { target: { value: "invalid" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  test("allows typing in email input", () => {
    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput).toHaveValue("test@example.com");
  });

  test("calls requestPasswordReset and shows success toast on valid email", async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce({ success: true, message: "Reset link sent!" });

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const button = screen.getByRole("button", { name: /Send reset link/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith("user@example.com");
      expect(toast.success).toHaveBeenCalledWith("Reset link sent!");
    });
  });

  test("shows error toast if API call fails", async () => {
    (requestPasswordReset as jest.Mock).mockResolvedValueOnce({ success: false, message: "Failed to send reset link." });

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const button = screen.getByRole("button", { name: /Send reset link/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(requestPasswordReset).toHaveBeenCalledWith("user@example.com");
      expect(toast.error).toHaveBeenCalledWith("Failed to send reset link.");
    });
  });

  test("shows error toast if API throws exception", async () => {
    (requestPasswordReset as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    const emailInput = screen.getByPlaceholderText(/you@example.com/i);
    const button = screen.getByRole("button", { name: /Send reset link/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Network Error");
    });
  });
});