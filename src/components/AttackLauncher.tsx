import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import { useHouses } from "../contexts/Houses";
import { useItems } from "../contexts/Items";
import HouseCard from "./HouseCard";
import { firestore } from "../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    houseItem: {
      display: "flex",
      flexDirection: "column"
    },
    card: {
      flexGrow: 1
    }
  })
);

function getLeft(index: number, length: number): number {
  return index - 1 >= 1 ? index - 1 : length;
}

function getRight(index: number, length: number): number {
  return index + 1 <= length ? index + 1 : 1;
}

function AttackLauncher(props: {
  attacker: number | null;
  defender: number | null;
  item: string | null;
}) {
  const classes = useStyles();

  const housesData = useHouses();
  const itemsData = useItems();

  const [attacking, setAttacking] = React.useState(false);
  const [successSnackbar, setSuccessSnackbar] = React.useState(false);

  function handleClose() {
    setSuccessSnackbar(false);
  }

  function doAttack() {
    setAttacking(true);
    firestore()
      .runTransaction(transaction => {
        const itemDoc = firestore().collection("items").doc(String(props.item));
        const defenderDoc = firestore().collection("houses").doc(String(props.defender));
        const leftDefenderDoc = firestore()
          .collection("houses")
          .doc(String(getLeft(props.defender!, housesData.length)));
        const rightDefenderDoc = firestore()
          .collection("houses")
          .doc(String(getRight(props.defender!, housesData.length)));
        return transaction.get(itemDoc).then(itemSnapshot => {
          const itemDamage = itemSnapshot.data()!.damage;
          const itemSideDamage = itemSnapshot.data()!.sideDamage;
          let newDefenderBlood: number,
            newLeftBlood: number,
            newRightBlood: number;
          return transaction.get(defenderDoc).then(defenderSnapshot => {
            const currentBlood = defenderSnapshot.data()!.blood;
            newDefenderBlood = Math.max(currentBlood - itemDamage, 0);
            return transaction
              .get(leftDefenderDoc)
              .then(leftDefenderSnapshot => {
                const currentBlood = leftDefenderSnapshot.data()!.blood;
                newLeftBlood = Math.max(currentBlood - itemSideDamage, 0);
                return transaction
                  .get(rightDefenderDoc)
                  .then(rightDefenderSnapshot => {
                    const currentBlood = rightDefenderSnapshot.data()!.blood;
                    newRightBlood = Math.max(currentBlood - itemSideDamage, 0);
                    transaction.update(itemDoc, {});
                    transaction.update(defenderDoc, {
                      blood: newDefenderBlood
                    });
                    transaction.update(leftDefenderDoc, {
                      blood: newLeftBlood
                    });
                    transaction.update(rightDefenderDoc, {
                      blood: newRightBlood
                    });
                  });
              });
          });
        });
      })
      .then(() => {
        firestore().collection("attacks").add({
          attacker: props.attacker,
          defender: props.defender,
          item: props.item,
          timestamp: firestore.Timestamp.fromMillis(Date.now())
        });
        setAttacking(false);
        setSuccessSnackbar(true);
      })
      .catch(reason => console.error(reason));
  }

  if (props.attacker && props.defender && props.item) {
    const defenderData = housesData[props.defender - 1];
    const leftDefenderData =
      housesData[getLeft(props.defender, housesData.length) - 1];
    const rightDefenderData =
      housesData[getRight(props.defender, housesData.length) - 1];
    const itemData = itemsData[props.item];
    const defenderBlood = Math.max(defenderData.blood - itemData.damage, 0);
    const leftDefenderBlood = Math.max(
      leftDefenderData.blood - Number(itemData.sideDamage),
      0
    );
    const rightDefenderBlood = Math.max(
      rightDefenderData.blood - Number(itemData.sideDamage)
    );

    return (
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Simulated Results
          </Typography>
        </Grid>
        <Grid item xs={12} sm={4} md={12} lg={4} className={classes.houseItem}>
          <Typography variant="h5" gutterBottom>
            Left
          </Typography>
          <HouseCard
            className={classes.card}
            house={leftDefenderData}
            newBlood={leftDefenderBlood}
            key={leftDefenderData.index}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={12} lg={4} className={classes.houseItem}>
          <Typography variant="h5" gutterBottom>
            Defender
          </Typography>
          <HouseCard
            className={classes.card}
            house={defenderData}
            newBlood={defenderBlood}
            key={defenderData.index}
          />
        </Grid>
        <Grid item xs={12} sm={4} md={12} lg={4} className={classes.houseItem}>
          <Typography variant="h5" gutterBottom>
            Right
          </Typography>
          <HouseCard
            className={classes.card}
            house={rightDefenderData}
            newBlood={rightDefenderBlood}
            key={rightDefenderData.index}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={doAttack}
            disabled={attacking}
            fullWidth
          >
            {attacking ? "Attacking..." : "Attack Now"}
          </Button>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right"
          }}
          open={successSnackbar}
          autoHideDuration={6000}
          onClose={handleClose}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Attack succeeded</span>}
        />
      </Grid>
    );
  } else {
    // Not enough information to simulate the attacks
    return <p>Not enough information.</p>;
  }
}

export default AttackLauncher;
