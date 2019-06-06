import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "stretch",
      "&.disabled": {
        opacity: 0.3,
        cursor: "not-allowed"
      }
    },
    itemImageWrapper: {
      flex: "0 3 auto",
      backgroundColor: "white",
      padding: theme.spacing(1),
      display: "flex",
      flexDirection: "column",
      justifyContent: "center"
    },
    itemImage: {
      maxWidth: 130,
      maxHeight: 130,
      objectFit: "contain"
    },
    itemContent: { flex: "1 0 auto" },
    itemName: { textTransform: "capitalize" },
    itemPrice: { minHeight: "1.5em" },
    itemDamage: { minHeight: "1.5em" },
    itemSideDamage: { minHeight: "1.5em" }
  })
);

interface itemCardProps extends CardProps {
  item: {
    name: string;
    price: number;
    damage: number;
    sideDamage: number | null;
    availability: boolean;
    img: string;
  };
  editable?: boolean;
  mask?: boolean;
}

function ItemCard({
  item,
  className,
  editable,
  mask,
  ...props
}: itemCardProps) {
  const classes = useStyles();
  const [imagePath, setImagePath] = React.useState(".");
  React.useEffect(() => {
    setImagePath(require("../assets/" + item.img));
  }, [item.img]);
  const hideDetails = mask && !item.availability;
  const displayedSideDamage = (item.sideDamage && "-" + item.sideDamage) || 0;
  return (
    <Card
      className={clsx(className, classes.root, {
        disabled: !item.availability
      })}
      {...props}
    >
      <div className={classes.itemImageWrapper}>
        <CardMedia
          component="img"
          alt={item.name}
          className={classes.itemImage}
          image={imagePath}
        />
      </div>
      <CardContent className={classes.itemContent}>
        <Typography
          className={classes.itemName}
          variant="h5"
          gutterBottom
          align="center"
        >
          {item.name}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className={classes.itemPrice}
        >
          {hideDetails ? "" : "Price: " + item.price}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className={classes.itemDamage}
        >
          {hideDetails ? "" : "Damage: -" + item.damage}
        </Typography>
        <Typography
          variant="body1"
          align="center"
          className={classes.itemSideDamage}
        >
          {hideDetails ? "" : "Side Damage: " + displayedSideDamage}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default ItemCard;
