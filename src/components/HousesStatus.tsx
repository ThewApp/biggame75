import React from "react";
import { Theme, makeStyles, createStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

import { useHouses } from "../contexts/Houses";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: theme.spacing(1)
    },
    card: { height: "100%" },
    houseName: {},
    houseBlood: {}
  })
);

function HousesStatus() {
  const classes = useStyles();

  const housesData = useHouses();
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center">
          Baan Status
        </Typography>
      </Grid>
      {housesData.map(house => (
        <Grid item xs={12} md={6} lg={3} key={house.index}>
          <Card className={classes.card}>
            <Typography
              className={classes.houseName}
              variant="h5"
              gutterBottom
              align="center"
            >
              {house.name}
            </Typography>
            <Typography
              variant="body1"
              align="center"
              className={classes.houseBlood}
            >
              Blood: {house.blood}/2000
            </Typography>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default HousesStatus;
