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
      },
      "&.disabled": {
        backgroundColor: theme.palette.grey[300],
        opacity: 0.7,
        cursor: "not-allowed"
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
        <Grid item xs={6} sm key={key} className={classes.item}>
          <ItemCard
            item={{ ...itemsData[key], name: key }}
            className={clsx(classes.card, {
              active: key === props.selected,
              disabled: !itemsData[key].availability
            })}
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
