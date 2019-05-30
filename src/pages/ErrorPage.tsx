import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: "100vh",
      width: "100vw"
    },
    paper: {
      padding: theme.spacing(3, 2),
      backgroundColor: theme.palette.error.dark,
      color: theme.palette.common.white
    }
  })
);

function ErrorPage() {
  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.root}
      spacing={2}
      justify="center"
      alignItems="center"
    >
      <Grid item xs={10} sm={8} md={6} lg={5}>
        <Paper className={classes.paper}>
          <Typography variant="h4" component="h1" gutterBottom>
            Oops! Something went wrong.
          </Typography>
          <Typography component="p">Please contact Thew.</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ErrorPage;
