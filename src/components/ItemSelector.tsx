import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemCard from "./ItemCard";
import clsx from "clsx";
import { useItems } from "../contexts/Items";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { marginBottom: theme.spacing(2) },
    item: {
      position: "relative"
    },
    cardOverlay: {
      position: "absolute",
      width: `calc(100% - ${theme.spacing(1)}px)`,
      height: `calc(100% - ${theme.spacing(1)}px)`,
      borderRadius: theme.shape.borderRadius,
      opacity: 0.6,
      pointerEvents: "none",
      zIndex: 10,
      "&.active": {
        backgroundColor: theme.palette.primary.main
      }
    },
    card: {
      height: "100%",
      cursor: "pointer"
    }
  })
);

function ItemSelector(props: {
  selected: string | null;
  handleSelect: (key: string | null) => void;
}) {
  const classes = useStyles();
  const itemsData = useItems();
  const keys = Object.keys(itemsData);

  if (props.selected && !itemsData[props.selected].availability) {
    props.handleSelect(null);
  }

  return (
    <Grid container spacing={1} className={classes.root}>
      {keys.map(key => (
        <Grid item xs={6} lg key={key} className={classes.item}>
          <div
            className={clsx(classes.cardOverlay, {
              active: key === props.selected
            })}
          />
          <ItemCard
            item={{ ...itemsData[key], name: key }}
            className={classes.card}
            tabIndex={itemsData[key].availability ? 0 : undefined}
            onClick={() => {
              if (itemsData[key].availability) {
                props.handleSelect(key);
              }
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default ItemSelector;
