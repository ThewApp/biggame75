import React from "react";
import { render, cleanup, getByAltText } from "@testing-library/react";
import Items from "./ItemsStatus";
import { useItems } from "../contexts/Items";

jest.mock("../contexts/Items", () => ({
  useItems: jest.fn()
}));

jest.mock("../firebase", () => ({}));

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
      availability: true,
      img: "sword.jpg"
    }
  });
  const { getByText, getByAltText } = render(<Items />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  getByText("Available Items");
  getByText("sword");
  getByAltText("sword");
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
      availability: true,
      img: "sword.jpg"
    },
    bomb: {
      index: 2,
      price: 6500,
      damage: 150,
      sideDamage: 100,
      availability: false,
      img: "bomb.jpg"
    },
    gun: {
      index: 3,
      price: 3500,
      damage: 100,
      sideDamage: null,
      availability: false,
      img: "gun.jpg"
    }
  });
  const { getByText, getAllByText, queryByText } = render(<Items />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  getByText("Available Items");
  getByText("sword");
  getByText(/Price:\s+6000/);
  getByText(/Damage:\s+-200/);
  getAllByText(/Side Damage:\s+0/);
  getByText("gun");
  expect(queryByText(/Price:\s+3500/)).toBe(null);
  expect(queryByText(/(?<!Side )Damage:\s+-100/)).toBe(null);
  expect(queryByText(/Side Damage:\s+-100/)).toBe(null);
});

test("rerender many items", () => {
  mockedUseItems.mockReturnValueOnce({}).mockReturnValueOnce({
    bomb: {
      index: 2,
      price: 6500,
      damage: 150,
      sideDamage: 100,
      availability: false,
      img: "bomb.jpg"
    },
    gun: {
      index: 3,
      price: 3500,
      damage: 100,
      sideDamage: null,
      availability: false,
      img: "gun.jpg"
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
  expect(queryByText(/Price:\s+3500/)).toBe(null);
  expect(queryByText(/(?<!Side )Damage:\s+-100/)).toBe(null);
  expect(queryByText(/Side Damage:\s+-100/)).toBe(null);
});
