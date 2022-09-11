import { render, screen } from "@testing-library/react";
import React from "react";
import WholeApp from "../WholeApp";

test("renders learn react link", () => {
  render(<WholeApp />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
