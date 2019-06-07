import React from "react";
import { render, cleanup } from "@testing-library/react";
import HousesStatus from "./HousesStatus";
import { useHouses } from "../contexts/Houses";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUseHouses = useHouses as jest.Mock;

jest.mock("../firebase", () => ({}));

afterEach(() => {
  mockedUseHouses.mockClear();
  cleanup();
});

test("render empty", () => {
  mockedUseHouses.mockReturnValueOnce([]);
  const { getByText } = render(<HousesStatus />);

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  getByText("Baan Status");
});

test("render non-empty", () => {
  mockedUseHouses.mockReturnValueOnce([
    {
      index: 1,
      name: "Minions",
      blood: 2000,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 2000,
      img: "lotso.jpg"
    }
  ]);
  const { getByText } = render(<HousesStatus />);

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  getByText("Baan Status");
  getByText("Minions");
  getByText("Lotso Bear");
});

test("rerender non-empty", () => {
  mockedUseHouses.mockReturnValueOnce([]).mockReturnValueOnce([
    {
      index: 1,
      name: "Minions",
      blood: 2000,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 2000,
      img: "lotso.jpg"
    }
  ]);
  const { getByText, queryByText, rerender } = render(<HousesStatus />);

  getByText("Baan Status");
  expect(queryByText("Minions")).toBe(null);

  rerender(<HousesStatus />);

  expect(mockedUseHouses.mock.calls.length).toBe(2);
  getByText("Baan Status");
  getByText("Minions");
  getByText("Lotso Bear");
});
