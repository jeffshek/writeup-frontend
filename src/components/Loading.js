import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";

const useStyles = makeStyles({
  root: {
    flexGrow: 1
  }
});

export const LinearIndeterminate = ({ show }) => {
  const classes = useStyles();

  if (!show) {
    return null;
  }

  return (
    <div className={classes.root}>
      Still Loading? Apologies, our servers are evaluating 1.5 billion
      parameters from your prompt and might be overloaded ... ...
      <br />
      <br />
      <LinearProgress />
      <br />
      {/*<LinearProgress color="secondary" />*/}
    </div>
  );
};
