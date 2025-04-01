import React from "react";
import { render, screen } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("renders restaurant title, rating, and description", () => {
    render(
      <Card
        title="Pizza Palace"
        description="Hot and cheesy pizza."
        rating={4.5}
        rating_count={120}
        imageUrl="pizza.jpg"
        selected={false}
      />
    );

    expect(screen.getByText("Pizza Palace")).toBeInTheDocument();
    expect(screen.getByText(/Hot and cheesy pizza/i)).toBeInTheDocument();
    expect(screen.getByText("4.5")).toBeInTheDocument();
    expect(screen.getByText("(120)")).toBeInTheDocument();
  });
});
