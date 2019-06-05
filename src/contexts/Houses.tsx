import React from "react";

import defaultData from "../defaultData.json";

declare const firebase: typeof import("./firebase");
const db = firebase.firestore().collection("houses");
const defaultHousesData: houses = defaultData.houses;

const HousesContext = React.createContext<any>(undefined);

type houses = house[];

interface house {
  index: number;
  name: string;
  blood: number;
}

function HousesProvider(props: { children: React.ReactNode }) {
  const [HousesState, setHousesState] = React.useState<houses>([]);

  React.useEffect(() => {
    return db.orderBy("index").onSnapshot(function(querySnapshot) {
      // Initialize houses with defaultData.json if firebase collection is empty
      if (querySnapshot.empty) {
        defaultHousesData.forEach(house => {
          const key = String(house.index);
          db.doc(key).set(house);
        });
      }
      // Get houses from firebase
      const HousesSnapshot: houses = [];
      querySnapshot.forEach(function(doc) {
        HousesSnapshot.push(doc.data() as house);
      });
      setHousesState(HousesSnapshot);
    });
  }, []);
  return (
    <HousesContext.Provider value={HousesState}>
      {props.children}
    </HousesContext.Provider>
  );
}

function useHouses() {
  return React.useContext(HousesContext) as houses;
}

export { HousesProvider, useHouses };
