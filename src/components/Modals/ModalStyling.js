import { makeStyles } from "@material-ui/core";

export function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const buttonStyling = {
  marginTop: "1rem",
  // don't judge me TOO HARD for using float
  // but you should still judge me a little.
  float: "right"
};

export const useModalStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none"
  },
  button: buttonStyling,
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1)
  }
}));

export const useWideModalStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: "60%",
    minWidth: 600,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none"
  },
  button: buttonStyling,
  formControl: {
    margin: theme.spacing(1),
    marginTop: "0",
    minWidth: 120,
    width: "100%"
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  },
  rightGridButton: {},
  circularProgress: {
    padding: theme.spacing(1)
  },
  copiedContainer: {
    textAlign: "center"
  },
  tutorialImage: {
    width: "100%",
    height: "auto"
  }
}));
