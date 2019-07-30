import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export function LinearIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      Stuck? Our servers might be overloaded ... ...
      <br />
      <br />
      <LinearProgress />
      <br />
      <LinearProgress color="secondary" />
    </div>
  );
}
