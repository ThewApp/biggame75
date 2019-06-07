import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import AttackLauncher from "./AttackLauncher";
import { useHouses } from "../contexts/Houses";
import { useItems } from "../contexts/Items";
import { db } from "../firebase";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

jest.mock("../contexts/Items", () => ({
  useItems: jest.fn()
}));

jest.mock("../firebase", () => ({
  db: {
    runTransaction: jest.fn().mockResolvedValue(undefined)
  }
}));

const mockedUseHouses = useHouses as jest.Mock;
const mockedUseItems = useItems as jest.Mock;
const mockedRunTransaction = (db.runTransaction as unknown) as jest.Mock;

mockedUseHouses.mockReturnValue([
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
  },
  {
    index: 3,
    name: "Harley Quinn",
    blood: 2000,
    img: "harley.jpg"
  },
  {
    index: 4,
    name: "Jerry",
    blood: 2000,
    img: "jerry.jpg"
  },
  {
    index: 5,
    name: "Maleficent",
    blood: 2000,
    img: "maleficent.jpg"
  }
]);
mockedUseItems.mockReturnValue({
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
    availability: true
  },
  gun: {
    index: 3,
    price: 3500,
    damage: 100,
    sideDamage: null,
    availability: false
  }
});

afterEach(() => {
  mockedUseHouses.mockClear();
  mockedUseItems.mockClear();
  mockedRunTransaction.mockClear();
  cleanup();
});

test("render blank", () => {
  const { getByText } = render(
    <AttackLauncher attacker={null} defender={null} item={null} />
  );
  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(mockedRunTransaction.mock.calls.length).toBe(0);
  getByText("Not enough information.");
});

test("render results", async () => {
  const { getByText } = render(
    <AttackLauncher attacker={1} defender={5} item={"gun"} />
  );
  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(mockedRunTransaction.mock.calls.length).toBe(0);
  getByText("Maleficent");
  await waitForElement(() => getByText("1900"));
  getByText("Jerry");
  getByText("Minions");
  getByText("Attack Now");
});

test("attack", async () => {
  const { getByText, getAllByText, queryByText, rerender } = render(
    <AttackLauncher attacker={1} defender={5} item={"bomb"} />
  );

  expect(mockedUseHouses.mock.calls.length).toBe(1);
  expect(mockedUseItems.mock.calls.length).toBe(1);
  expect(mockedRunTransaction.mock.calls.length).toBe(0);
  fireEvent.click(getByText("Attack Now"));

  expect(mockedRunTransaction.mock.calls.length).toBe(1);

  await waitForElement(() => getByText("Attacking..."));

  mockedUseHouses.mockReturnValue([
    {
      index: 1,
      name: "Minions",
      blood: 1900,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 2000,
      img: "lotso.jpg"
    },
    {
      index: 3,
      name: "Harley Quinn",
      blood: 2000,
      img: "harley.jpg"
    },
    {
      index: 4,
      name: "Jerry",
      blood: 1900,
      img: "jerry.jpg"
    },
    {
      index: 5,
      name: "Maleficent",
      blood: 1850,
      img: "maleficent.jpg"
    }
  ]);

  rerender(<AttackLauncher attacker={1} defender={5} item={"bomb"} />);

  getByText("Maleficent");
  await waitForElement(() => getByText("1700"));
  expect(queryByText("1900")).toBe(null);
  getByText("Jerry");
  getByText("Minions");
  getAllByText("1800");
  getByText("Attack Now");
});
