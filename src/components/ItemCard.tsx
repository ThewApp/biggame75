import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardAction from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import clsx from "clsx";
import { db } from "../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "stretch"
    },
    disabled: {
      opacity: 0.3,
      cursor: "not-allowed"
    },
    itemImageWrapper: {
      flex: "0 2 130px",
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
    itemDetails: {
      flex: "1 0 auto"
    },
    itemContent: {},
    itemName: { textTransform: "capitalize" },
    itemPrice: { minHeight: "1.5em" },
    itemDamage: { minHeight: "1.5em" },
    itemSideDamage: { minHeight: "1.5em" },
    itemAction: {},
    itemButton: {}
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
  const [toggling, setToggling] = React.useState(false);
  const availabilityCache = React.useRef<boolean>();
  React.useEffect(() => {
    setImagePath(require("../assets/" + item.img));
  }, [item.img]);
  const hideDetails = mask && !item.availability;
  const displayedSideDamage = (item.sideDamage && "-" + item.sideDamage) || 0;

  function toggleItem() {
    availabilityCache.current = item.availability;
    setToggling(true);
    db.collection("items")
      .doc(item.name)
      .update({ availability: !item.availability })
      .then(() => {
        setToggling(false);
      });
  }
  return (
    <Card
      className={clsx(className, classes.root, {
        [classes.disabled]: !item.availability && !editable
      })}
      {...props}
    >
      <div
        className={clsx(classes.itemImageWrapper, {
          [classes.disabled]: !item.availability && editable
        })}
      >
        <CardMedia
          component="img"
          alt={item.name}
          className={classes.itemImage}
          image={imagePath}
        />
      </div>
      <div className={classes.itemDetails}>
        <CardContent
          className={clsx(classes.itemContent, {
            [classes.disabled]: !item.availability && editable
          })}
        >
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
        {editable && (
          <CardAction className={classes.itemAction}>
            <Button
              color="primary"
              className={classes.itemButton}
              fullWidth
              onClick={toggleItem}
              disabled={toggling}
            >
              {toggling
                ? availabilityCache.current
                  ? "Disabling..."
                  : "Enabling..."
                : item.availability
                ? "Disable"
                : "Enable"}
            </Button>
          </CardAction>
        )}
      </div>
    </Card>
  );
}

export default ItemCard;
