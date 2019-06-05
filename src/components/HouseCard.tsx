import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    houseName: {},
    houseBlood: {}
  })
);

interface houseCardProps extends CardProps {
  house: {
    name: string;
    blood: number;
  };
}

function HouseCard({ house, className, ...props }: houseCardProps) {
  const classes = useStyles();
  return (
    <Card className={clsx(className, classes.root)} {...props}>
      <Typography
        className={classes.houseName}
        variant="body2"
        gutterBottom
        align="center"
      >
        {house.name}
      </Typography>
      <Typography variant="body2" align="center" className={classes.houseBlood}>
        Blood: {house.blood}/2000
      </Typography>
    </Card>
  );
}

export default HouseCard;
