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
import { firestore } from "../firebase";

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

jest.mock("../contexts/Items", () => ({
  useItems: jest.fn()
}));

const mockedAdd = jest.fn().mockResolvedValue(undefined);
const mockedRunTransaction = jest.fn().mockResolvedValue(undefined);
const mockedOnSnapshot = jest.fn();

jest.mock("../firebase", () => ({
  firestore: () => ({
    runTransaction: mockedRunTransaction,
    collection: () => ({
      add: mockedAdd,
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

firestore.Timestamp = { fromMillis: jest.fn() } as any;

const mockedUseHouses = useHouses as jest.Mock;
const mockedUseItems = useItems as jest.Mock;

mockedUseHouses.mockReturnValue([
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
  },
  {
    index: 3,
    name: "Harley Quinn",
    blood: 4000,
    img: "harley.jpg"
  },
  {
    index: 4,
    name: "Jerry",
    blood: 4000,
    img: "jerry.jpg"
  },
  {
    index: 5,
    name: "Maleficent",
    blood: 4000,
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
  mockedAdd.mockClear();
  mockedOnSnapshot.mockClear();
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
  await waitForElement(() => getByText("3900"));
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
      blood: 3900,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 4000,
      img: "lotso.jpg"
    },
    {
      index: 3,
      name: "Harley Quinn",
      blood: 4000,
      img: "harley.jpg"
    },
    {
      index: 4,
      name: "Jerry",
      blood: 3900,
      img: "jerry.jpg"
    },
    {
      index: 5,
      name: "Maleficent",
      blood: 3850,
      img: "maleficent.jpg"
    }
  ]);

  mockedOnSnapshot.mock.calls[0][0]([
    {
      get: (key: "attacker" | "item" | "timestamp") => {
        const doc = {
          attacker: 1,
          item: "bomb",
          timestamp: {
            toMillis: () => Date.now()
          }
        };
        return doc[key];
      }
    }
  ]);

  rerender(<AttackLauncher attacker={1} defender={5} item={"bomb"} />);

  getByText("Maleficent");
  await waitForElement(() => getByText("3700"));
  getByText("Attacked by Baan 1 using bomb");
  expect(queryByText("3900")).toBe(null);
  getByText("Jerry");
  getByText("Minions");
  expect(getAllByText("3800").length).toBe(2);
  getByText("Attack Now");
});
