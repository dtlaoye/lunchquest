import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../../pages/Home";

describe("Home", () => {
  it("renders header and search bar", () => {
    render(<Home />);
    expect(
      screen.getByPlaceholderText(/search restaurants/i)
    ).toBeInTheDocument();
  });
});
