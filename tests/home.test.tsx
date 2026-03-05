// tests/home.test.tsx
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import HomePage from "../app/(auth)/home/page";

// Mock next/link
jest.mock("next/link", () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe("HomePage", () => {
  beforeEach(() => {
    render(<HomePage />);
  });

  test("renders navbar brand and navigation links", () => {
    const brand = screen.getByRole("heading", {
      name: "Fresh Picks",
      level: 1,
    });
    expect(brand).toBeInTheDocument();

    expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "About us" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Categories" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact" })).toBeInTheDocument();
  });

  test("renders Get started link", () => {
    const link = screen.getByRole("link", { name: "Get started" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/register");
  });

  test("renders hero section content", () => {
    expect(
      screen.getByRole("heading", { name: /Daily Essentials/i })
    ).toBeInTheDocument();

    expect(screen.getByText(/Just a Click Away/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Make healthier choices every day/i)
    ).toBeInTheDocument();
  });

  test("renders hero buttons", () => {
    expect(
      screen.getByRole("button", { name: "Shop Now" })
    ).toBeInTheDocument();

    expect(
    screen.getByRole("button", { name: /Explore more/i })
    ).toBeInTheDocument();
  });

  test("renders categories section", () => {
    expect(
      screen.getByRole("heading", { name: /Popular at Fresh Picks/i })
    ).toBeInTheDocument();

    const priceTexts = screen.getAllByText(/starting from Rs 99/i);
    expect(priceTexts.length).toBeGreaterThan(0);
  });

  test("renders testimonials section", () => {
    expect(
      screen.getByText(/Fresh Picks makes grocery shopping so easy/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/I love the dairy products here/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Fast delivery and great customer support/i)
    ).toBeInTheDocument();
  });

  test("renders CTA section", () => {
    expect(
      screen.getByText(/Ready to shop fresh groceries/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Start Shopping" })
    ).toBeInTheDocument();
  });

  test("renders footer content", () => {
    expect(
      screen.getByText(/Your trusted source for fresh and healthy groceries/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/support@freshpicks.com/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/© 2026 Fresh Picks/i)
    ).toBeInTheDocument();
  });
    test("navbar contains multiple navigation links", () => {
    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(3);
    });
    test("Shop Now button is visible to the user", () => {
    const shopButton = screen.getByRole("button", { name: "Shop Now" });
    expect(shopButton).toBeVisible();
    });
});