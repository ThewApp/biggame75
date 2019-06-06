import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemCard from "./ItemCard";
import clsx from "clsx";
import { useItems } from "../contexts/Items";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { marginBottom: theme.spacing(2) },
    item: {},
    card: {
      height: "100%",
      cursor: "pointer",
      "&.active": {
        backgroundColor: theme.palette.primary.light
      }
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
          <ItemCard
            item={{ ...itemsData[key], name: key }}
            className={clsx(classes.card, {
              active: key === props.selected
            })}
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
