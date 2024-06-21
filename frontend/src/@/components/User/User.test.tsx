import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter, useParams } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { User } from "./User";
import { trpc } from "@api/trpcClient";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: jest.fn(),
}));

jest.mock("@api/trpcClient", () => ({
  trpc: {
    getAnswersForUser: {
      useQuery: jest.fn(),
    },
    getUsers: {
      useQuery: jest.fn(),
    },
    getQuestions: {
      useQuery: jest.fn(),
    },
    upsertAnswer: {
      useMutation: jest.fn(),
    },
    deleteAnswer: {
      useMutation: jest.fn(),
    },
  },
}));

const queryClient = new QueryClient();

const renderComponent = () =>
  render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <User />
      </BrowserRouter>
    </QueryClientProvider>
  );

describe("User Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useParams as jest.Mock).mockReturnValue({ userId: "user1" });
  });
  describe("query states", () => {
    it("renders loading state initially", () => {
      (trpc.getAnswersForUser.useQuery as jest.Mock).mockReturnValue({
        isLoading: true,
      });
      (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({ data: [] });
      (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({ data: [] });

      renderComponent();

      expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("renders error state", () => {
      (trpc.getAnswersForUser.useQuery as jest.Mock).mockReturnValue({
        isError: true,
        error: { message: "Error fetching answers" },
      });
      (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({ data: [] });
      (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({ data: [] });

      renderComponent();

      expect(
        screen.getByText("Error: Error fetching answers")
      ).toBeInTheDocument();
    });
  });

  describe("user data", () => {
    beforeEach(() => {
      (trpc.getAnswersForUser.useQuery as jest.Mock).mockReturnValue({
        data: [{ _id: "1", question: "q1", content: "Answer 1" }],
      });
      (trpc.getUsers.useQuery as jest.Mock).mockReturnValue({
        data: [{ _id: "user1", name: "John Doe" }],
      });
      (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({
        data: [{ _id: "q1", content: "Question 1" }],
      });
    });

    it("renders user data", () => {
      renderComponent();
      expect(screen.getByText("User:")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Question 1")).toBeInTheDocument();
      expect(screen.getByText("Answer 1")).toBeInTheDocument();
    });

    it("opens the upsert answer modal on edit button click", () => {
      renderComponent();

      fireEvent.click(screen.getByText("Edit"));
      expect(screen.getByText("Edit answer")).toBeInTheDocument();
    });

    it("opens the delete answer modal on delete button click", () => {
      renderComponent();

      fireEvent.click(screen.getByText("Delete"));
      expect(
        screen.getByRole("heading", { name: "Delete answer" })
      ).toBeInTheDocument();
    });

    it("closes modal on ESC key press", async () => {
      renderComponent();

      fireEvent.click(screen.getByText("Edit"));
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Edit answer" })
        ).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: "Edit answer" })
        ).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Delete"));
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Delete answer" })
        ).toBeInTheDocument();
      });

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: "Delete answer" })
        ).not.toBeInTheDocument();
      });
    });

    it("closes modal on close button click", async () => {
      renderComponent();

      fireEvent.click(screen.getByText("Edit"));
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Edit answer" })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Close", { selector: "span.sr-only" }));
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: "Edit answer" })
        ).not.toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Delete"));
      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Delete answer" })
        ).toBeInTheDocument();
      });

      fireEvent.click(screen.getByText("Close", { selector: "span.sr-only" }));
      await waitFor(() => {
        expect(
          screen.queryByRole("heading", { name: "Delete answer" })
        ).not.toBeInTheDocument();
      });
    });
  });
});
