import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
  it("calls onSearch when Enter is pressed", () => {
    const mockSearch = jest.fn();

    render(
      <SearchBar value="tacos" onChange={() => {}} onSearch={mockSearch} />
    );

    const input = screen.getByPlaceholderText(/search restaurants/i);
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(mockSearch).toHaveBeenCalled();
  });
});
