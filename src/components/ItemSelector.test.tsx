import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import ItemSelector from "./ItemSelector";
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

test("renders blank item", () => {
  const handleSelect = jest.fn();
  mockedUseItems.mockReturnValueOnce([]);
  render(<ItemSelector selected={null} handleSelect={handleSelect} />);

  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);
});

test("renders many items", () => {
  const handleSelect = jest.fn();
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
  const { getByText, getAllByText, queryByText } = render(
    <ItemSelector selected={null} handleSelect={handleSelect} />
  );

  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);
  getByText("bomb");
  expect(queryByText(/(?<!Side )Damage:\s+-100/)).toBe(null);
  expect(getAllByText(/Side Damage:\s+0/).length).toBe(1)
});

test("selects item", () => {
  const handleSelect = jest.fn();
  mockedUseItems.mockReturnValue({
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
  const { getByText, rerender } = render(
    <ItemSelector selected={null} handleSelect={handleSelect} />
  );

  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);

  fireEvent.click(getByText("sword"));
  expect(handleSelect.mock.calls.length).toBe(1);
  rerender(<ItemSelector selected={"sword"} handleSelect={handleSelect} />);
  expect(mockedUseItems.mock.calls.length).toBe(2);

  fireEvent.click(getByText("gun"));
  expect(handleSelect.mock.calls.length).toBe(1);
});
