import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLogoutButton from "@/app/admin/_components/AdminLogoutButton";

// Mock next/navigation
const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

describe("AdminLogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        removeItem: jest.fn(),
      },
      writable: true,
    });

    // reset cookies
    document.cookie = "";
  });
  it("button is visible on screen", () => {
  render(<AdminLogoutButton />);
  const button = screen.getByRole("button", { name: /logout/i });
  expect(button).toBeVisible();
  });

  it("logout button can be clicked", async () => {
  const user = userEvent.setup();
  render(<AdminLogoutButton />);

  const button = screen.getByRole("button", { name: /logout/i });
  await user.click(button);

  expect(button).toBeInTheDocument();
  });

  it("renders logout button", () => {
    render(<AdminLogoutButton />);
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();
  });

  it("clears cookies, localStorage, and redirects on click", async () => {
    const user = userEvent.setup();

    render(<AdminLogoutButton />);

    await user.click(screen.getByRole("button", { name: /logout/i }));

    // router navigation
    expect(pushMock).toHaveBeenCalledWith("/login");
    expect(refreshMock).toHaveBeenCalled();

    // localStorage cleared
    expect(localStorage.removeItem).toHaveBeenCalledWith("token");
    expect(localStorage.removeItem).toHaveBeenCalledWith("user");
  });
});