import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Items from "../components/Items";
import HousesStatus from "../components/HousesStatus";
import { ItemsProvider } from "../contexts/Items";
import { HousesProvider } from "../contexts/Houses";
// import Paper from "@material-ui/core/Paper";
// import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {
      padding: theme.spacing(1)
    }
  })
);

function ErrorPage() {
  const classes = useStyles();

  document.title = "HomePage";

  return (
    <ItemsProvider>
      <HousesProvider>
        <Grid container className={classes.root}>
          <Grid item sm={12} md={4} lg={3} className={classes.item}>
            <Items />
          </Grid>
          <Grid item xs className={classes.item}>
            <HousesStatus />
          </Grid>
        </Grid>
      </HousesProvider>
    </ItemsProvider>
  );
}

export default ErrorPage;
