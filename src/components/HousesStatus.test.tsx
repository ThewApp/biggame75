import React from "react";
import { render, cleanup } from "@testing-library/react";
import HousesStatus from "./HousesStatus";
import { useHouses } from "../contexts/Houses";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUseHouses = useHouses as jest.Mock;

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
      balance: 0,
      blood: 100
    },
    {
      index: 2,
      name: "Lotso Bear",
      balance: 0,
      blood: 100
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
      balance: 0,
      blood: 100
    },
    {
      index: 2,
      name: "Lotso Bear",
      balance: 0,
      blood: 100
    }
  ]);
  const { getByText, queryByText, rerender } = render(<HousesStatus />);

  getByText("Baan Status");
  expect(queryByText("Minions")).toBe(null);
  
  rerender(<HousesStatus />)

  expect(mockedUseHouses.mock.calls.length).toBe(2);
  getByText("Baan Status");
  getByText("Minions");
  getByText("Lotso Bear");
});