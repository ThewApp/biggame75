import React from "react";
import { render, cleanup, waitForElement } from "@testing-library/react";
import HousesStatus from "./HousesStatus";
import { useHouses } from "../contexts/Houses";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUseHouses = useHouses as jest.Mock;
const mockedGet = jest.fn().mockResolvedValue([]);

jest.mock("../firebase", () => ({
  firestore: () => ({
    collection: () => ({
      where: () => ({
        orderBy: () => ({
          limit: () => ({
            get: mockedGet
          })
        })
      })
    })
  })
}));

afterEach(() => {
  mockedUseHouses.mockClear();
  mockedGet.mockClear();
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
      blood: 2000,
      img: "lotso.jpg"
    }
  ]);

  mockedGet.mockResolvedValueOnce([
    {
      get: (key: "attacker" | "timestamp") => {
        const doc = {
          attacker: 5,
          timestamp: {
            toMillis: () => Date.now()
          }
        };
        return doc[key];
      }
    }
  ]);

  const { getByText } = render(<HousesStatus />);

  getByText("Baan Status");
  getByText("Minions");
  getByText("Lotso Bear");
  return waitForElement(() => getByText("Attacked by Baan 5"));
});
