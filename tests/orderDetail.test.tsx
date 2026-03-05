import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CheckoutPage from "../app/(protected)/orderDetail/page"; // adjust path if needed
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";

// Mock router
jest.mock("next/navigation", () => ({
useRouter: jest.fn(),
}));

// Mock react-hot-toast
jest.mock("react-hot-toast", () => ({
__esModule: true,
default: {
success: jest.fn(),
error: jest.fn(),
},
Toaster: () => <div />,
}));

describe("CheckoutPage", () => {
const pushMock = jest.fn();

beforeEach(() => {
(useRouter as jest.Mock).mockReturnValue({
push: pushMock,
});

localStorage.clear();

render(<CheckoutPage />);


});

test("renders checkout form fields", () => {
expect(screen.getByPlaceholderText(/Full Name/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/Phone Number/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/Street Address/i)).toBeInTheDocument();
expect(screen.getByPlaceholderText(/City/i)).toBeInTheDocument();
});

test("shows error if form submitted empty", async () => {
fireEvent.click(screen.getByRole("button", { name: /Place Order/i }));


});

test("fills form correctly", () => {
fireEvent.change(screen.getByPlaceholderText(/Full Name/i), {
target: { value: "John Doe" },
});



});

test("successful order calls API", async () => {
localStorage.setItem("token", "mockToken");
localStorage.setItem(
"cart",
JSON.stringify([
{ _id: "1", price: 100, quantity: 2 }
])
);


});
});
