import React from "react";
import { render, screen } from "@testing-library/react";
import { App } from "./App";

test("renders Users", () => {
  render(<App />);
  expect(screen.getByText("Users")).toBeInTheDocument();
});

test("renders Questions", () => {
  render(<App />);
  expect(screen.getByText("Questions")).toBeInTheDocument();
});
