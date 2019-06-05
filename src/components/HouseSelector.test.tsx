import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import HouseSelector from "./HouseSelector";
import { useHouses } from "../contexts/Houses";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUseHouses = useHouses as jest.Mock;

afterEach(() => {
  mockedUseHouses.mockClear();
  cleanup();
});

test("renders blank house", () => {
  const handleSelect = jest.fn();
  mockedUseHouses.mockReturnValueOnce([]);
  render(
    <HouseSelector
      selected={null}
      disabled={[null]}
      handleSelect={handleSelect}
    />
  );

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);
});

test("renders many houses", () => {
  const handleSelect = jest.fn();
  mockedUseHouses.mockReturnValueOnce([
    {
      index: 1,
      name: "Minions",
      blood: 2000
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 1900
    }
  ]);
  const { getByText } = render(
    <HouseSelector
      selected={null}
      disabled={[null]}
      handleSelect={handleSelect}
    />
  );

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);
  getByText("Minions");
  getByText(/Blood:\s+1900/);
});

test("selects house", () => {
  const handleSelect = jest.fn();
  mockedUseHouses.mockReturnValue([
    {
      index: 1,
      name: "Minions",
      blood: 2000
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 1900
    }
  ]);
  const { getByText, rerender } = render(
    <HouseSelector
      selected={null}
      disabled={[null]}
      handleSelect={handleSelect}
    />
  );

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(handleSelect.mock.calls.length).toBe(0);

  fireEvent.click(getByText("Minions"));
  expect(handleSelect.mock.calls.length).toBe(1);

  rerender(
    <HouseSelector selected={1} disabled={[2]} handleSelect={handleSelect} />
  );
  expect(mockedUseHouses.mock.calls.length).toBe(2);
});
