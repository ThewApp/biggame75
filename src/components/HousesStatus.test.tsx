import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import HousesStatus from "./HousesStatus";
import { useHouses } from "../contexts/Houses";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUseHouses = useHouses as jest.Mock;
const mockedOnSnapshot = jest.fn();

jest.mock("../firebase", () => ({
  firestore: () => ({
    collection: () => ({
      where: () => ({
        orderBy: () => ({
          limit: () => ({
            onSnapshot: mockedOnSnapshot
          })
        })
      })
    })
  })
}));

afterEach(() => {
  mockedUseHouses.mockClear();
  mockedOnSnapshot.mockClear();
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
      blood: 4000,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 4000,
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
      blood: 4000,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 4000,
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

test("show attacks status", () => {
  mockedUseHouses.mockReturnValueOnce([
    {
      index: 1,
      name: "Minions",
      blood: 1800,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 4000,
      img: "lotso.jpg"
    }
  ]);

  const { getByText } = render(<HousesStatus />);

  mockedOnSnapshot.mock.calls[0][0]([
    {
      get: (key: "attacker" | "item" | "timestamp") => {
        const doc = {
          attacker: 5,
          item: "bomb",
          timestamp: {
            toMillis: () => Date.now()
          }
        };
        return doc[key];
      }
    }
  ]);

  getByText("Baan Status");
  getByText("Minions");
  getByText("Lotso Bear");
  return waitForElement(() => getByText("Attacked by Baan 5 using bomb"));
});
