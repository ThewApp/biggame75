import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import HouseCard from "./HouseCard";
import Typography from "@material-ui/core/Typography";

import { useHouses } from "../contexts/Houses";

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

function HousesControl() {
  const classes = useStyles();

  const housesData = useHouses();

  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Control Baan
        </Typography>
      </Grid>
      {housesData.map(house => (
        <Grid item xs={12} md={6} lg={3} key={house.index}>
          <HouseCard editable house={house} className={classes.card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default HousesControl;
