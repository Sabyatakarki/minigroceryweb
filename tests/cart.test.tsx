import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import CartPage from "@/app/(protected)/cart/page";

// Mock next/navigation
const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  usePathname: () => "/cart",
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock next/link
jest.mock("next/link", () => {
  return ({ children }: any) => children;
});

// Mock toast
jest.mock("react-hot-toast", () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
  },
  Toaster: () => <div />,
}));

describe("CartPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    Storage.prototype.getItem = jest.fn(() =>
      JSON.stringify([
        {
          _id: "1",
          name: "Apple",
          image: "apple.jpg",
          category: "Fruit",
          quantity: 2,
          price: 100,
        },
      ])
    );

    Storage.prototype.setItem = jest.fn();
    Storage.prototype.removeItem = jest.fn();
  });


  test("renders cart items correctly", async () => {
    render(<CartPage />);

    expect(await screen.findByText("Apple")).toBeInTheDocument();

    // Instead of getByText (which fails due to duplicates)
    const prices = await screen.findAllByText("₹200");
    expect(prices.length).toBeGreaterThan(0);
  });

  test("increments quantity", async () => {
    render(<CartPage />);

    // Select only the PLUS buttons
    const plusButtons = await screen.findAllByRole("button");
    
    // The plus button is the 4th button rendered in item card
    // (menu, trash, minus, plus)
    const plusButton = plusButtons.find((btn) =>
      btn.querySelector("svg.lucide-plus")
    );

    expect(plusButton).toBeTruthy();

    fireEvent.click(plusButton!);

    await waitFor(() => {
      expect(Storage.prototype.setItem).toHaveBeenCalled();
    });
  });

  test("opens checkout modal", async () => {
    render(<CartPage />);

    // Select ONLY the checkout button (not the modal heading)
    const checkoutButtons = await screen.findAllByRole("button", {
      name: /checkout/i,
    });

    fireEvent.click(checkoutButtons[0]);

    expect(
      await screen.findByText(/cash on delivery/i)
    ).toBeInTheDocument();
  });

  test("confirms order and navigates", async () => {
    render(<CartPage />);

    const checkoutButton = await screen.findByRole("button", {
      name: /checkout/i,
    });

    fireEvent.click(checkoutButton);

    const confirmButton = await screen.findByRole("button", {
      name: /confirm/i,
    });

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/orderDetail");
    });
  });

  test("clears basket", async () => {
    render(<CartPage />);

    const clearButton = await screen.findByText(/clear basket/i);

    fireEvent.click(clearButton);

    await waitFor(() => {
      expect(Storage.prototype.removeItem).toHaveBeenCalledWith("cart");
    });
  });
});