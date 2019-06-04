import React from "react";
import { render, cleanup } from "@testing-library/react";
import Items from "./Items";
import { useItems } from "../contexts/Items";

jest.mock("../contexts/Items", () => ({
  useItems: jest.fn()
}));

const mockedUseItems = useItems as jest.Mock;

afterEach(() => {
  mockedUseItems.mockClear();
  cleanup();
});

test("render empty", () => {
  mockedUseItems.mockReturnValueOnce({});
  const { getByText } = render(<Items />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  getByText("Available Items");
});

test("render one item", () => {
  mockedUseItems.mockReturnValueOnce({
    sword: {
      index: 1,
      price: 6000,
      damage: 200,
      sideDamage: null,
      availability: true
    }
  });
  const { getByText } = render(<Items />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  getByText("Available Items");
  getByText("sword");
  getByText(/Price:\s+6000/);
  getByText(/Damage:\s+-200/);
  getByText(/Side Damage:\s+0/);
});

test("render many items", () => {
  mockedUseItems.mockReturnValueOnce({
    sword: {
      index: 1,
      price: 6000,
      damage: 200,
      sideDamage: null,
      availability: true
    },
    bomb: {
      index: 2,
      price: 6500,
      damage: 150,
      sideDamage: 100,
      availability: false
    },
    gun: {
      index: 3,
      price: 3500,
      damage: 100,
      sideDamage: null,
      availability: false
    }
  });
  const { getByText, getAllByText } = render(<Items />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  getByText("Available Items");
  getByText("sword");
  getByText(/Price:\s+6000/);
  getByText(/Damage:\s+-200/);
  getAllByText(/Side Damage:\s+0/);
  getByText("gun");
  getByText(/Price:\s+3500/);
  getByText(/(?<!Side )Damage:\s+-100/);
  getByText(/Side Damage:\s+-100/);
});

test("rerender many items", () => {
  mockedUseItems.mockReturnValueOnce({}).mockReturnValueOnce({
    bomb: {
      index: 2,
      price: 6500,
      damage: 150,
      sideDamage: 100,
      availability: false
    },
    gun: {
      index: 3,
      price: 3500,
      damage: 100,
      sideDamage: null,
      availability: false
    }
  });
  const { getByText, queryByText, rerender } = render(<Items />);

  getByText("Available Items");
  expect(queryByText("bomb")).toBe(null);

  rerender(<Items />);

  getByText("Available Items");
  expect(mockedUseItems.mock.calls.length).toBe(2);
  getByText("bomb");
  getByText("gun");
  getByText(/Price:\s+3500/);
  getByText(/(?<!Side )Damage:\s+-100/);
  getByText(/Side Damage:\s+-100/);
});
