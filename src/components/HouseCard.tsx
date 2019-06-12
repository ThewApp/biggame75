import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Card, { CardProps } from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useSpring, animated } from "react-spring";
import clsx from "clsx";
import { firestore } from "../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between"
    },
    bloodBar: {
      width: "100%",
      height: theme.spacing(1),
      backgroundColor: "pink"
    },
    remainingBloodBar: {
      height: "100%",
      backgroundColor: "red"
    },
    avatar: {},
    inputRoot: {
      minWidth: "200px"
    },
    mediaWrapper: {
      flexGrow: 1,
      display: "flex",
      alignItems: "center",
      position: "relative"
    },
    attackedOverlay: {
      position: "absolute",
      width: "100%",
      padding: theme.spacing(2),
      color: theme.palette.common.white,
      backgroundColor: theme.palette.primary.main,
      animation: "$attackedOverlay .5s ease-in-out infinite alternate"
    },
    "@keyframes attackedOverlay": {
      from: {
        opacity: 0.8
      },
      to: {
        opacity: 0.98
      }
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
  newBlood?: number;
}

function HouseCard({
  house,
  className,
  noImage,
  editable,
  newBlood,
  ...props
}: houseCardProps) {
  const classes = useStyles();
  const [imagePath, setImagePath] = React.useState(".");
  const [dialog, setDialog] = React.useState(false);
  const [editedBlood, setEditedBlood] = React.useState<number | null>(null);
  const [savingDialog, setSavingDialog] = React.useState(false);

  React.useEffect(() => {
    setImagePath(require("../assets/" + house.img));
  }, [house.img]);

  const bloodRef = React.useRef<number>();
  React.useEffect(() => {
    bloodRef.current = house.blood;
  });

  const [attackedBy, setAttackedBy] = React.useState<string | null>(null);

  firestore()
    .collection("attacks")
    .where("defender", "==", house.index)
    .orderBy("timestamp", "desc")
    .limit(1)
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        if (Date.now() - doc.get("timestamp").toMillis() <= 5 * 1000) {
          // 5 seconds
          setAttackedBy(String(doc.get("attacker")));
        }
      });
    });

  React.useEffect(() => {
    if (attackedBy !== null) {
      const timeoutId = setTimeout(() => {
        setAttackedBy(null);
      }, 5 * 1000);
      return () => {
        clearTimeout(timeoutId);
      };
    }
  });

  const bloodSpring = useSpring({
    number: newBlood || house.blood,
    from: {
      number:
        bloodRef.current && typeof newBlood === "undefined"
          ? bloodRef.current
          : house.blood
    },
    config: { friction: 100, mass: 2 }
  });

  function handleOpenDialog() {
    setDialog(true);
  }

  function handleCloseDialog() {
    if (!savingDialog) {
      setDialog(false);
      setEditedBlood(null);
    }
  }

  function handleBloodChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value === "") {
      setEditedBlood(null);
    } else {
      setEditedBlood(Number(event.target.value));
    }
  }

  function handleSaveDialog(event: React.FormEvent) {
    if (
      typeof editedBlood === "number" &&
      editedBlood! >= 0 &&
      editedBlood! <= 2000
    ) {
      setSavingDialog(true);
      firestore()
        .collection("houses")
        .doc(String(house.index))
        .update({ blood: editedBlood })
        .then(() => {
          setDialog(false);
          setSavingDialog(false);
          setEditedBlood(null);
        });
    } else {
      handleCloseDialog();
      event.preventDefault();
    }
  }

  const bloodSpan = (
    <>
      Blood:{" "}
      <animated.span>
        {bloodSpring.number.interpolate(number => Math.round(number))}
      </animated.span>
      /2000
    </>
  );
  return (
    <Card className={clsx(className, classes.root)} {...props}>
      <CardHeader
        avatar={<Avatar className={classes.avatar}>{house.index}</Avatar>}
        title={house.name}
        subheader={bloodSpan}
        action={
          editable ? (
            <IconButton aria-label="Edit" onClick={handleOpenDialog}>
              <EditIcon />
            </IconButton>
          ) : (
            undefined
          )
        }
      />
      <div className={classes.bloodBar}>
        <animated.div
          className={classes.remainingBloodBar}
          style={{
            width: bloodSpring.number
              .interpolate({ range: [0, 2000], output: [0, 100] })
              .interpolate(o => `${o}%`)
          }}
        />
      </div>
      {!noImage && (
        <div className={classes.mediaWrapper}>
          {attackedBy && (
            <div className={classes.attackedOverlay}>
              <Typography variant="body2">
                Attacked by Baan {attackedBy}
              </Typography>
            </div>
          )}
          <CardMedia
            className={classes.media}
            component="img"
            image={imagePath}
            alt={house.name}
          />
        </div>
      )}
      <Dialog
        onClose={handleCloseDialog}
        open={dialog}
        aria-labelledby={`edit-${house.name}-dialog`}
      >
        <form onSubmit={handleSaveDialog}>
          <DialogTitle id={`edit-${house.name}-dialog`}>
            Edit {house.name}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              id={`edit-${house.name}-blood`}
              disabled={savingDialog}
              placeholder={String(house.blood)}
              value={editedBlood === null ? "" : editedBlood}
              onChange={handleBloodChange}
              label="Blood"
              type="number"
              fullWidth
              variant="outlined"
              InputProps={{
                className: classes.inputRoot
              }}
              inputProps={{ min: "0", max: "2000" }} // eslint-disable-line react/jsx-no-duplicate-props
            />
          </DialogContent>
          <DialogActions>
            <Button
              disabled={savingDialog}
              onClick={handleCloseDialog}
              color="primary"
            >
              Cancel
            </Button>
            <Button
              disabled={savingDialog}
              onClick={handleSaveDialog}
              color="primary"
              type="submit"
            >
              {savingDialog ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}

export default HouseCard;
