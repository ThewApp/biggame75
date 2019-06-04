import React from "react";

import defaultData from "../defaultData.json";

declare const firebase: typeof import("./firebase");
const db = firebase.firestore();
const defaultItemsData: items = defaultData.items

const ItemsContext = React.createContext<any>(undefined);

interface items {
  [name: string]: item
}

interface item {
  index: number;
  price: number;
  damage: number;
  sideDamage: number | null;
  availability: boolean;
};

function ItemsProvider(props: { children: React.ReactNode }) {
  const [ItemsState, setItemsState] = React.useState({});

  React.useEffect(() => {
    return db.collection("items").orderBy("index").onSnapshot(function(querySnapshot) {
      // Initialize items with defaultData.json if firebase collection is empty
      if (querySnapshot.empty) {
        const keys = Object.keys(defaultItemsData);
        keys.forEach(key => {
          db.collection("items")
            .doc(key)
            .set(defaultItemsData[key]);
        });
      }
      // Get Items from firebase
      const ItemsSnapshot: items = {};
      querySnapshot.forEach(function(doc) {
        ItemsSnapshot[doc.id] = doc.data() as any;
      });
      setItemsState(ItemsSnapshot);
    });
  }, []);
  return (
    <ItemsContext.Provider value={ItemsState}>
      {props.children}
    </ItemsContext.Provider>
  );
}

function useItems() {
  return React.useContext(ItemsContext) as items
}

export { ItemsProvider, useItems };
