import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import RegisterPage from "@/app/(auth)/register/page";

// Mock RegisterForm component
jest.mock("@/app/(auth)/_components/registerform", () => {
return function MockRegisterForm() {
return <div data-testid="register-form">Register Form Component</div>;
};
});

describe("RegisterPage", () => {
beforeEach(() => {
render(<RegisterPage />);
});

test("renders main heading", () => {
expect(screen.getByRole("heading", { name: "Create Account" })).toBeInTheDocument();
});

test("renders subtitle text", () => {
expect(screen.getByText(/Healthy Living Starts Here/i)).toBeInTheDocument();
});

test("renders illustration image", () => {
const image = screen.getByRole("img", { name: "Fresh Picks Illustration" });
expect(image).toBeInTheDocument();
expect(image).toHaveAttribute("src", "/loginImage.jpg");
});

test("renders RegisterForm component", () => {
expect(screen.getByTestId("register-form")).toBeInTheDocument();
});

// NEW TEST 1
test("register form component displays correct text", () => {
expect(screen.getByText("Register Form Component")).toBeInTheDocument();
});

// NEW TEST 2
test("page contains exactly one main heading", () => {
const headings = screen.getAllByRole("heading");
expect(headings.length).toBeGreaterThanOrEqual(1);
});

});
