import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ItemsControl from "../components/ItemsControl";
import HousesControl from "../components/HousesControl";
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

function ControlPage() {
  const classes = useStyles();

  document.title = "Control | Freshy Game";

  return (
    <ItemsProvider>
      <HousesProvider>
        <Grid container className={classes.root}>
          <Grid item xs={12} sm={6} md={4} lg={3} className={classes.item}>
            <ItemsControl />
          </Grid>
          <Grid item xs className={classes.item}>
            <HousesControl />
          </Grid>
        </Grid>
      </HousesProvider>
    </ItemsProvider>
  );
}

export default ControlPage;
