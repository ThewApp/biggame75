import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemCard from "./ItemCard";
import Typography from "@material-ui/core/Typography";

import { useItems } from "../contexts/Items";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1)
    },
    card: {
      height: "100%"
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
        <Typography variant="h4" align="center">
          Available Items
        </Typography>
      </Grid>
      {keys.map((key: string) => (
        <Grid item key={key}>
          <ItemCard mask item={{...itemsData[key], name: key}} />
        </Grid>
      ))}
    </Grid>
  );
}

export default Items;
