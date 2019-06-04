import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import green from "@material-ui/core/colors/green";
import clsx from "clsx";

import { useItems } from "../contexts/Items";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1)
    },
    card: {
      height: "100%",
      "&$inactive": {
        opacity: 0.5
      }
    },
    inactive: {
      "& $price, & $damage, & $sideDamage": {
        visibility: "hidden"
      }
    },
    title: {
      textTransform: "capitalize"
    },
    price: {
      color: green[700]
    },
    damage: {
      color: theme.palette.error.main
    },
    sideDamage: {
      color: theme.palette.error.light
    }
  })
);

function Items() {
  const classes = useStyles();

  const itemsData = useItems();
  const keys = Object.keys(itemsData);

  return (
    <Grid container className={classes.root} spacing={2} direction="column">
      <Grid item>
        <Typography className={classes.title} variant="h4" align="center">
          Available Items
        </Typography>
      </Grid>
      {keys.map((key: string) => (
        <Grid item key={key}>
          <Card
            className={clsx(classes.card, {
              [classes.inactive]: !itemsData[key].availability
            })}
          >
            <Typography
              className={classes.title}
              variant="h5"
              gutterBottom
              align="center"
            >
              {key}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              className={classes.price}
            >
              Price: {itemsData[key].price}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              className={classes.damage}
            >
              Damage: -{itemsData[key].damage}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              className={classes.sideDamage}
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

export default Items;
