import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "@api/trpcClient";
import { Users } from "./Users";
import { User } from "@/components";

jest.mock("@api/trpcClient", () => ({
  trpc: {
    createClient: jest.fn(),
    getUsers: {
      useQuery: jest.fn(),
    },
    getAnswersForUser: {
      useQuery: jest.fn(),
    },
    getQuestions: {
      useQuery: jest.fn(),
    },
  },
}));

const queryClient = new QueryClient();

function renderWithProviders() {
  const routes = [
    {
      path: "/",
      element: <Users />,
    },
    {
      path: "users/:userId",
      element: <User />,
    },
  ];

  const router = createMemoryRouter(routes, { initialEntries: ["/"] });

  render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );

  return router;
}

describe("Users component", () => {
  it("renders loading state", () => {
    (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
    });

    renderWithProviders();

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: true,
      error: { message: "Error fetching users" },
      data: null,
    });

    renderWithProviders();

    expect(screen.getByText("Error: Error fetching users")).toBeInTheDocument();
  });

  it("renders users list", () => {
    const users = [
      { _id: "1", name: "User One" },
      { _id: "2", name: "User Two" },
    ];

    (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: users,
    });

    renderWithProviders();

    expect(screen.getByText("User One")).toBeInTheDocument();
    expect(screen.getByText("User Two")).toBeInTheDocument();
  });

  it("navigates to user page on link click", () => {
    const users = [{ _id: "1", name: "User One" }];

    (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: users,
    });

    (trpc.getAnswersForUser.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    const router = renderWithProviders();

    fireEvent.click(screen.getByText("User One"));

    expect(router.state.location.pathname).toBe("/users/1");
    expect(screen.getByText("User:")).toBeInTheDocument();
    expect(screen.getByText("Add answer")).toBeInTheDocument();
  });
});
