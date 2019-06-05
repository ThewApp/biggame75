import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

jest.mock("./contexts/Items", () => {
  return {
    ItemsProvider: (props: { children: React.ReactNodeArray }) =>
      props.children,
    useItems: () => ({})
  };
});

jest.mock("./contexts/Houses", () => {
  return {
    HousesProvider: (props: { children: React.ReactNodeArray }) =>
      props.children,
    useHouses: () => []
  };
});

jest.mock("./firebase", () => {
  return {
    db: jest.fn()
  };
});

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
