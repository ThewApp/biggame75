import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { useHouses } from "../contexts/Houses";
import HouseCard from "./HouseCard";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { marginBottom: theme.spacing(2) },
    item: {},
    card: {
      height: "100%",
      cursor: "pointer",
      "&.active": {
        backgroundColor: theme.palette.primary.light
      },
      "&.disabled": {
        opacity: 0.3,
        cursor: "not-allowed"
      },
      "&.side": {
        backgroundColor: theme.palette.secondary.light
      }
    },
    houseName: {},
    houseBlood: {}
  })
);

function HouseSelector(props: {
  side?: boolean;
  selected: number | null;
  disabled: Array<number | null>;
  handleSelect: (index: number | null) => void;
}) {
  const classes = useStyles();
  const housesData = useHouses();
  const length = housesData.length;

  return (
    <Grid container spacing={1} className={classes.root}>
      {housesData.map(house => (
        <Grid
          item
          xs={4}
          md={3}
          lg={2}
          key={house.index}
          className={classes.item}
        >
          <HouseCard
            house={house}
            className={clsx(classes.card, {
              active: house.index === props.selected,
              side:
                props.selected &&
                props.side &&
                (house.index === props.selected - 1 ||
                  house.index === props.selected + 1 ||
                  (props.selected === 1 && house.index === length) ||
                  (props.selected === length && house.index === 1)),
              disabled: props.disabled.includes(house.index)
            })}
            tabIndex={!props.disabled.includes(house.index) ? 0 : undefined}
            onClick={() => {
              if (!props.disabled.includes(house.index)) {
                props.handleSelect(house.index);
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default HouseSelector;
