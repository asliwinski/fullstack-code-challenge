import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Questions } from "./Questions";
import { trpc } from "@api/trpcClient";
import { Question } from "@/types";

jest.mock("@api/trpcClient", () => ({
  trpc: {
    getQuestions: {
      useQuery: jest.fn(),
    },
    upsertQuestion: {
      useMutation: jest.fn(),
    },
    deleteQuestion: {
      useMutation: jest.fn(),
    },
  },
}));

const mockQuestions: Question[] = [
  { _id: "1", content: "Question 1" },
  { _id: "2", content: "Question 2" },
];

describe("Questions Component", () => {
  beforeEach(() => {
    (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({
      data: mockQuestions,
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    });
  });

  it("renders loading state", () => {
    (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
    });

    render(<Questions />);
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    (trpc.getQuestions.useQuery as jest.Mock).mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      error: { message: "Error fetching questions" },
    });

    render(<Questions />);
    expect(
      screen.getByText("Error: Error fetching questions")
    ).toBeInTheDocument();
  });

  it("renders questions", () => {
    render(<Questions />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
    expect(screen.getByText("Question 2")).toBeInTheDocument();
  });

  it("opens upsert question modal on edit button click", async () => {
    render(<Questions />);
    fireEvent.click(screen.getAllByText("Edit")[0]);
    await waitFor(() => {
      expect(screen.getByText("Edit question")).toBeInTheDocument();
    });
  });

  it("opens delete question modal on delete button click", async () => {
    render(<Questions />);
    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Delete question" })
      ).toBeInTheDocument();
    });
  });

  it("opens upsert question modal on create new question button click", async () => {
    render(<Questions />);
    fireEvent.click(screen.getByText("Create new question"));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add question" })
      ).toBeInTheDocument();
    });
  });

  it("closes modal on ESC key press", async () => {
    render(<Questions />);
    fireEvent.click(screen.getByText("Create new question"));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add question" })
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Add question" })
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Delete question" })
      ).toBeInTheDocument();
    });

    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Delete question" })
      ).not.toBeInTheDocument();
    });
  });

  it("closes modal on close button click", async () => {
    render(<Questions />);
    fireEvent.click(screen.getByText("Create new question"));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Add question" })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close", { selector: "span.sr-only" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Add question" })
      ).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText("Delete")[0]);
    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: "Delete question" })
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Close", { selector: "span.sr-only" }));
    await waitFor(() => {
      expect(
        screen.queryByRole("heading", { name: "Delete question" })
      ).not.toBeInTheDocument();
    });
  });
});
