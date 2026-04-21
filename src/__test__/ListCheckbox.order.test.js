import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ListCheckbox from "components/form/ListCheckbox";

describe("ListCheckbox notation order", () => {
  const notationOptions = [
    "Chord extensions",
    "Scale Steps",
    "Relative",
    "Romance",
    "German",
    "English",
  ];

  test("emits selected options in canonical list order regardless of toggle order", () => {
    const handleCheckboxChange = jest.fn();

    render(
      <ListCheckbox
        options={notationOptions}
        initOptions={["Colors"]}
        handleCheckboxChange={handleCheckboxChange}
      />
    );

    fireEvent.click(screen.getByText("English"));
    fireEvent.click(screen.getByText("Chord extensions"));
    fireEvent.click(screen.getByText("German"));

    expect(handleCheckboxChange).toHaveBeenLastCalledWith([
      "Colors",
      "Chord extensions",
      "German",
      "English",
    ]);
  });

  test("syncs state when initOptions prop changes", () => {
    const handleCheckboxChange = jest.fn();

    const { rerender } = render(
      <ListCheckbox
        options={notationOptions}
        initOptions={["Colors", "English"]}
        handleCheckboxChange={handleCheckboxChange}
      />
    );

    rerender(
      <ListCheckbox
        options={notationOptions}
        initOptions={["Colors", "German"]}
        handleCheckboxChange={handleCheckboxChange}
      />
    );

    fireEvent.click(screen.getByText("Relative"));

    expect(handleCheckboxChange).toHaveBeenLastCalledWith([
      "Colors",
      "Relative",
      "German",
    ]);
  });
});
