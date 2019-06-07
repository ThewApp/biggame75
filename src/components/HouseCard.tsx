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
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useSpring, animated } from "react-spring";
import clsx from "clsx";
import { db } from "../firebase";

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
    avatar: {},
    inputRoot: {
      minWidth: "200px"
    },
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

  const bloodSpring = useSpring({
    number: newBlood || house.blood,
    from: {
      number: bloodRef.current && typeof newBlood === "undefined" ? bloodRef.current : house.blood
    },
    config: { friction: 100, mass: 3 },
    reset: typeof newBlood !== "undefined"
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
      db.collection("houses")
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
      {!noImage && (
        <div className={classes.mediaWrapper}>
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
