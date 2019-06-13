import React from "react";
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  waitForElementToBeRemoved
} from "@testing-library/react";
import HousesControl from "./HousesControl";
import { useHouses } from "../contexts/Houses";

const mockedUseHouses = useHouses as jest.Mock;

jest.mock("../contexts/Houses", () => ({
  useHouses: jest.fn()
}));

const mockedUpdate = jest.fn().mockResolvedValue(undefined);
const mockedOnSnapshot = jest.fn();

jest.mock("../firebase", () => ({
  firestore: () => ({
    collection: () => ({
      doc: () => ({
        update: mockedUpdate
      }),
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
    blood: 1000,
    img: "lotso.jpg"
  },
  {
    index: 3,
    name: "Harley Quinn",
    blood: 1500,
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

afterEach(() => {
  mockedUseHouses.mockClear();
  mockedUpdate.mockClear();
  mockedOnSnapshot.mockClear();
  cleanup();
});

it("renders empty item", () => {
  mockedUseHouses.mockReturnValueOnce([]);
  const { getByText } = render(<HousesControl />);
  getByText("Control Baan");
});

it("renders items", async () => {
  const { getByText, getByAltText } = render(<HousesControl />);
  getByText("Minions");
  getByAltText("Minions");
  getByText("Harley Quinn");
  getByAltText("Harley Quinn");
  await waitForElement(() => getByText("1000"));
});

it("edits valid blood", async () => {
  const { getByText, getAllByLabelText, getByLabelText, rerender } = render(
    <HousesControl />
  );
  expect(mockedUpdate.mock.calls.length).toBe(0);
  const editButtons = getAllByLabelText("Edit");
  expect(editButtons.length).toBe(5);
  fireEvent.click(editButtons[0]);
  expect((getByLabelText("Blood") as HTMLInputElement).value).toBe("");
  fireEvent.change(getByLabelText("Blood") as HTMLInputElement, {
    target: { value: "1750" }
  });
  fireEvent.click(getByText("Save"));
  mockedUseHouses.mockReturnValueOnce([
    {
      index: 1,
      name: "Minions",
      blood: 1750,
      img: "minions.jpg"
    },
    {
      index: 2,
      name: "Lotso Bear",
      blood: 1000,
      img: "lotso.jpg"
    },
    {
      index: 3,
      name: "Harley Quinn",
      blood: 1500,
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
  expect(mockedUpdate.mock.calls.length).toBe(1);
  expect(mockedUpdate.mock.calls[0][0]).toEqual({ blood: 1750 });
  rerender(<HousesControl />);
  await waitForElement(() => getByText("1750"));
});

it("edits blank blood", () => {
  const { getByText, getAllByLabelText, getByLabelText } = render(
    <HousesControl />
  );
  expect(mockedUpdate.mock.calls.length).toBe(0);
  const editButtons = getAllByLabelText("Edit");
  expect(editButtons.length).toBe(5);
  fireEvent.click(editButtons[3]);
  expect((getByLabelText("Blood") as HTMLInputElement).value).toBe("");
  fireEvent.change(getByLabelText("Blood") as HTMLInputElement, {
    target: { value: "" }
  });
  fireEvent.click(getByText("Save"));
  expect(mockedUpdate.mock.calls.length).toBe(0);
  return waitForElementToBeRemoved(() => getByLabelText("Blood"));
});

it("edits overrange blood", () => {
  const { getByText, getAllByLabelText, getByLabelText } = render(
    <HousesControl />
  );
  expect(mockedUpdate.mock.calls.length).toBe(0);
  const editButtons = getAllByLabelText("Edit");
  expect(editButtons.length).toBe(5);
  fireEvent.click(editButtons[3]);
  expect((getByLabelText("Blood") as HTMLInputElement).value).toBe("");
  fireEvent.change(getByLabelText("Blood") as HTMLInputElement, {
    target: { value: "2001" }
  });
  fireEvent.click(getByText("Save"));
  expect(mockedUpdate.mock.calls.length).toBe(0);
  return waitForElementToBeRemoved(() => getByLabelText("Blood"));
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

  const { getByText } = render(<HousesControl />);

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

  getByText("Control Baan");
  getByText("Minions");
  getByText("Lotso Bear");
  return waitForElement(() => getByText("Attacked by Baan 5 using bomb"));
});
