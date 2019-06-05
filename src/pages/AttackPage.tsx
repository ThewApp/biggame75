import React from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { ItemsProvider } from "../contexts/Items";
import { HousesProvider } from "../contexts/Houses";
import HouseSelector from "../components/HouseSelector";
import ItemSelector from "../components/ItemSelector";
import AttackLauncher from "../components/AttackLauncher";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    item: {
      padding: theme.spacing(1)
    },
    title: {}
  })
);

interface attackingState {
  attacker: number | null;
  defender: number | null;
  item: string | null;
}

function AttackPage() {
  const classes = useStyles();

  document.title = "Attack";

  const [attacking, setAttacking] = React.useState<attackingState>({
    attacker: null,
    defender: null,
    item: null
  });

  function handleSelectAttacker(index: attackingState["attacker"]) {
    setAttacking({ ...attacking, attacker: index });
  }

  function handleSelectDefender(index: attackingState["defender"]) {
    setAttacking({
      ...attacking,
      defender: index
    });
  }

  function handleSelectItem(index: attackingState["item"]) {
    setAttacking({ ...attacking, item: index });
  }

  return (
    <ItemsProvider>
      <HousesProvider>
        <Grid container className={classes.root}>
          <Grid item sm={12} md={8} className={classes.item}>
            <Typography className={classes.title} variant="h4" gutterBottom>
              Attacker:
            </Typography>
            <HouseSelector
              selected={attacking.attacker}
              disabled={[attacking.defender]}
              handleSelect={handleSelectAttacker}
            />
            <Typography className={classes.title} variant="h4" gutterBottom>
              Defender:
            </Typography>
            <HouseSelector
              side
              selected={attacking.defender}
              disabled={[attacking.attacker]}
              handleSelect={handleSelectDefender}
            />
            <Typography className={classes.title} variant="h4" gutterBottom>
              Item:
            </Typography>
            <ItemSelector
              selected={attacking.item}
              handleSelect={handleSelectItem}
            />
          </Grid>
          <Grid item xs className={classes.item}>
            <AttackLauncher
              attacker={attacking.attacker}
              defender={attacking.defender}
              item={attacking.item}
            />
          </Grid>
        </Grid>
      </HousesProvider>
    </ItemsProvider>
  );
}

export default AttackPage;
