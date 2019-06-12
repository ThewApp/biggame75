import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from "@testing-library/react";
import ItemsControl from "./ItemsControl";
import { useItems } from "../contexts/Items";

const mockedUseItems = useItems as jest.Mock;

jest.mock("../contexts/Items", () => ({
  useItems: jest.fn()
}));

const mockedUpdate = jest.fn().mockResolvedValue(undefined);

jest.mock("../firebase", () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        update: mockedUpdate
      })
    })
  })
}));

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
  },
  "short knife": {
    index: 4,
    price: 2000,
    damage: 50,
    sideDamage: null,
    availability: true,
    img: "shortKnife.jpg"
  }
});

afterEach(() => {
  mockedUseItems.mockClear();
  mockedUpdate.mockClear();
  cleanup();
});

it("renders empty item", () => {
  mockedUseItems.mockReturnValueOnce({});
  const { getByText } = render(<ItemsControl />);
  getByText("Control Items");
});

it("renders items", () => {
  const { getByText, getAllByText, getByAltText } = render(<ItemsControl />);
  getByText("sword");
  getByAltText("sword");
  getByText("short knife");
  getByAltText("short knife");
  expect(getAllByText("Enable").length).toBe(2);
  expect(getAllByText("Disable").length).toBe(2);
});

it("enable first disabled item", async () => {
  const { getByText, getAllByText, rerender } = render(<ItemsControl />);
  expect(mockedUpdate.mock.calls.length).toBe(0);
  fireEvent.click(getAllByText("Enable")[0]);
  await waitForElement(() => getByText("Enabling..."));
  expect(mockedUpdate.mock.calls.length).toBe(1);
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
      availability: true,
      img: "bomb.jpg"
    },
    gun: {
      index: 3,
      price: 3500,
      damage: 100,
      sideDamage: null,
      availability: false,
      img: "gun.jpg"
    },
    "short knife": {
      index: 4,
      price: 2000,
      damage: 50,
      sideDamage: null,
      availability: true,
      img: "shortKnife.jpg"
    }
  });
  rerender(<ItemsControl />);
  expect(getAllByText("Enable").length).toBe(1);
  expect(getAllByText("Disable").length).toBe(3);
});

it("disable second enabled item", async () => {
  const { getByText, getAllByText, rerender } = render(<ItemsControl />);
  expect(mockedUpdate.mock.calls.length).toBe(0);
  fireEvent.click(getAllByText("Disable")[1]);
  await waitForElement(() => getByText("Disabling..."));
  expect(mockedUpdate.mock.calls.length).toBe(1);
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
    },
    "short knife": {
      index: 4,
      price: 2000,
      damage: 50,
      sideDamage: null,
      availability: false,
      img: "shortKnife.jpg"
    }
  });
  rerender(<ItemsControl />);
  expect(getAllByText("Enable").length).toBe(3);
  expect(getAllByText("Disable").length).toBe(1);
});
