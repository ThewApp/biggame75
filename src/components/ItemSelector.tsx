import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
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
    },
    itemName: {
      textTransform: "capitalize"
    },
    itemPrice: {},
    itemDamage: {},
    itemSideDamage: {}
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
          <Card
            className={clsx(classes.card, {
              active: key === props.selected,
              disabled: !itemsData[key].availability
            })}
            onClick={() => {
              if (itemsData[key].availability) {
                props.handleSelect(key);
              }
            }}
          >
            <Typography
              className={classes.itemName}
              variant="body2"
              gutterBottom
              align="center"
            >
              {key}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.itemPrice}
            >
              Price: {itemsData[key].price}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.itemDamage}
            >
              Damage: -{itemsData[key].damage}
            </Typography>
            <Typography
              variant="body2"
              align="center"
              className={classes.itemSideDamage}
            >
              Side Damage:{" "}
              {(itemsData[key].sideDamage && "-" + itemsData[key].sideDamage) ||
                0}
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default ItemSelector;
