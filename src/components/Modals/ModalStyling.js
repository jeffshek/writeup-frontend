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
  marginTop: "1rem"
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
  },
  algorithmSelectForm: {
    marginTop: "0",
    width: "50%"
  },
  facebookAuthButton: {
    borderRadius: 100,
    backgroundColor: "#3b5998"
  },
  googleAuthButton: {
    borderRadius: 100
  },
  loginText: {
    textColor: "white",
    color: "white"
  },
  googleTextLogoG: {
    color: "#4285F4",
    marginLeft: "0.25rem"
  },
  googleTextLogoO1: {
    color: "#DB4437"
  },
  googleTextLogoO2: {
    color: "#F4B400"
  },
  googleTextLogoGO2: {
    color: "#4285F4"
  },
  googleTextLogoL: {
    color: "#0F9D58"
  },
  googleTextLogoE: {
    color: "#DB4437"
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
    outline: "none",
    [theme.breakpoints.down("sm")]: {
      minWidth: 300,
      width: "95%",
      margin: 0,
      padding: 0
    }
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
  },
  helperLoginText: {
    marginLeft: "2",
    paddingLeft: "2",
    fontSize: ".75rem"
  }
}));
