import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      position: "relative"
    },
    bloodBar: {
      position: "absolute",
      width: "100%",
      height: theme.spacing(1),
      backgroundColor: "pink",
      top: 0
    },
    remainingBloodBar: {
      height: "100%",
      backgroundColor: "red"
    },
    header: {},
    avatar: {},
    mediaWrapper: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center"
    },
    media: {
      objectFit: "contain",
      maxHeight: 130
    }
  })
);

interface houseCardProps extends CardProps {
  house: {
    index: number;
    name: string;
    blood: number;
    img: string;
  };
  noImage?: boolean;
  editable?: boolean;
}

function HouseCard({
  house,
  className,
  noImage,
  editable,
  ...props
}: houseCardProps) {
  const classes = useStyles();
  const [imagePath, setImagePath] = React.useState(".");
  React.useEffect(() => {
    setImagePath(require("../assets/" + house.img));
  }, [house.img]);
  return (
    <Card className={clsx(className, classes.root)} {...props}>
      <div className={classes.bloodBar}>
        <div
          className={classes.remainingBloodBar}
          style={{ width: `${(house.blood / 2000) * 100}%` }}
        />
      </div>
      <CardHeader
        className={classes.header}
        avatar={<Avatar className={classes.avatar}>{house.index}</Avatar>}
        title={house.name}
        subheader={"Blood: " + house.blood + "/2000"}
      />
      {!noImage && (
        <div className={classes.mediaWrapper}>
          <CardMedia
            className={classes.media}
            component="img"
            image={imagePath}
          />
        </div>
      )}
    </Card>
  );
}

export default HouseCard;
