import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemsStatus from "../components/ItemsStatus";
import HousesStatus from "../components/HousesStatus";
import { ItemsProvider } from "../contexts/Items";
import { HousesProvider } from "../contexts/Houses";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {
      padding: theme.spacing(1)
    }
  })
);

function HomePage() {
  const classes = useStyles();

  document.title = "HomePage | Freshy Game";

  return (
    <ItemsProvider>
      <HousesProvider>
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={6} md={4} lg={3} className={classes.item}>
            <ItemsStatus />
          </Grid>
          <Grid item xs className={classes.item}>
            <HousesStatus />
          </Grid>
        </Grid>
      </HousesProvider>
    </ItemsProvider>
  );
}

export default HomePage;
