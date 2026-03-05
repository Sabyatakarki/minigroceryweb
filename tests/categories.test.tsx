// tests/categoriesPage.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoriesPage from "../app/(protected)/categories/page";

// Mock next/navigation
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => "/categories", // <--- MOCK usePathname
}));

// Mock fetch
const mockProducts = [
  { _id: "1", name: "Apple", price: 100, category: "Fruits", image: "apple.png" },
  { _id: "2", name: "Banana", price: 50, category: "Fruits", image: "banana.png" },
  { _id: "3", name: "Carrot", price: 70, category: "Vegetables", image: "carrot.png" },
];

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: mockProducts }),
  })
) as jest.Mock;

global.URL.createObjectURL = jest.fn(() => "mock-url");

describe("CategoriesPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders categories and products", async () => {
    render(<CategoriesPage />);
    await waitFor(() => {
      expect(screen.getByText("Fruits")).toBeInTheDocument();
      expect(screen.getByText("Vegetables")).toBeInTheDocument();
    });
    expect(screen.getByText("Apple")).toBeInTheDocument();
    expect(screen.getByText("Banana")).toBeInTheDocument();
    expect(screen.getByText("Carrot")).toBeInTheDocument();
  });

  it("navigates to product page when View button clicked", async () => {
    render(<CategoriesPage />);
    await waitFor(() => screen.getByText("Apple"));
    const viewButtons = screen.getAllByText("View");
    fireEvent.click(viewButtons[0]);
    expect(mockPush).toHaveBeenCalledWith("/categories/1");
  });

  it("toggles sidebar open/close on menu button click", async () => {
    render(<CategoriesPage />);
    const menuButton = screen.getByRole("button");
    fireEvent.click(menuButton); // open
    fireEvent.click(menuButton); // close
  });

});