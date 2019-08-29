export const TopbarStyles = theme => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    borderBottom: `1px solid ${theme.palette.grey["100"]}`,
    backgroundColor: "white"
  },
  inline: {
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  flex: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "space-evenly",
      alignItems: "center"
    }
  },
  rightGridContainer: {
    [theme.breakpoints.up("sm")]: {
      marginRight: "2rem"
    }
  },
  leftGridContainerItem: {
    display: "flex",
    [theme.breakpoints.up("sm")]: {
      //marginLeft: "2rem"
    }
  },
  link: {
    textDecoration: "none",
    color: "inherit"
  },
  productLogo: {
    display: "inline-block",
    borderLeft: `1px solid ${theme.palette.grey["A100"]}`,
    marginLeft: 32,
    paddingLeft: 24,
    [theme.breakpoints.up("md")]: {
      paddingTop: "1.5em"
    }
  },
  tagline: {
    display: "inline-block",
    fontWeight: "normal",
    marginLeft: 10,
    [theme.breakpoints.up("md")]: {
      paddingTop: "0.8em"
    }
  },
  iconContainer: {
    display: "none",
    [theme.breakpoints.down("sm")]: {
      display: "block"
    }
  },
  iconButton: {
    float: "right"
  },
  tabContainer: {
    marginLeft: 32,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  tabContainerRight: {
    //marginLeft: 32,
    [theme.breakpoints.down("sm")]: {
      display: "none"
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: "0.8em"
    }
  },
  tabItem: {
    paddingTop: 20,
    paddingBottom: 20,
    minWidth: "auto"
  },
  settingsContainer: {
    paddingBottom: "0.5rem"
  },
  textTagContainer: {
    padding: "1rem"
  },
  strikeInline: {
    display: "inline-block",
    paddingRight: "0.25rem",
    paddingLeft: "0.25rem",
    "text-decoration": "line-through"
  },
  inlineBlockTagLine: {
    display: "inline-block"
  },
  modalStyle: {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  },
  modalPaper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none"
  },
  modalContainer: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none",
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  }
});
