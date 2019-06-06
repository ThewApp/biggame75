import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    itemName: { textTransform: "capitalize" },
    itemPrice: {},
    itemDamage: {},
    itemSideDamage: {}
  })
);

interface itemCardProps extends CardProps {
  item: {
    name: string;
    price: number;
    damage: number;
    sideDamage: number | null;
  };
  disabled?: boolean;
  editable?: boolean;
}

function ItemCard({ item, className, ...props }: itemCardProps) {
  const classes = useStyles();
  return (
    <Card className={clsx(className, classes.root)} {...props}>
      <Typography
        className={classes.itemName}
        variant="h5"
        gutterBottom
        align="center"
      >
        {item.name}
      </Typography>
      <Typography variant="body1" align="center" className={classes.itemPrice}>
        Price: {item.price}
      </Typography>
      <Typography variant="body1" align="center" className={classes.itemDamage}>
        Damage: -{item.damage}
      </Typography>
      <Typography
        variant="body1"
        align="center"
        className={classes.itemSideDamage}
      >
        Side Damage: {(item.sideDamage && "-" + item.sideDamage) || 0}
      </Typography>
    </Card>
  );
}

export default ItemCard;
