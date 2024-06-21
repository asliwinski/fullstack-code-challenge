import { render, screen } from "@testing-library/react";
import { Home } from "@/components";

jest.mock("@/components/Users/Users", () => ({
  Users: () => <div data-testid="users-component">Users Component</div>,
}));

jest.mock("@/components/Questions/Questions", () => ({
  Questions: () => (
    <div data-testid="questions-component">Questions Component</div>
  ),
}));

describe("Home Component", () => {
  test("renders Users and Questions sections", () => {
    render(<Home />);

    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByTestId("users-component")).toBeInTheDocument();

    expect(screen.getByText("Questions")).toBeInTheDocument();
    expect(screen.getByTestId("questions-component")).toBeInTheDocument();
  });
});
