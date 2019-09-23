import backgroundShape from "images/shape.svg";

export const MainStyles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 50
  },
  grid: {
    width: 1200,
    marginTop: 40,
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.down("md")]: {
      //width: "calc(100% - 20px)",
      width: "100%",
      margin: 0,
      padding: 0
    }
  },
  gridItem: {
    //padding: 0,
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  rangeLabel: {
    display: "flex",
    justifyContent: "space-between",
    paddingTop: theme.spacing(2)
  },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32
  },
  button: {
    marginRight: "0.25rem"
  },
  publishButton: {
    marginTop: "0.5rem",
    marginBottom: "0.5rem"
  },
  undoButton: {
    marginRight: "0.25rem"
  },
  actionButton: {
    textTransform: "uppercase",
    margin: theme.spacing(1),
    width: 152
  },
  blockCenter: {
    padding: theme.spacing(2),
    textAlign: "center"
  },
  block: {
    padding: theme.spacing(2)
  },
  createRandomPromptButton: {
    marginRight: "0.25rem"
    //padding: 0
  },
  copiedContainer: {
    whitespace: "nowrap",
    overflow: "hidden"
  },
  box: {
    marginBottom: 20,
    minHeight: 150
  },
  textBox: {
    backgroundColor: theme.palette.grey["100"],
    padding: "0.5rem",
    marginTop: "0.5rem",
    marginBottom: "0.5rem"
  },
  inlining: {
    display: "inline-block",
    marginRight: 10
  },
  buttonBar: {
    display: "flex"
  },
  alignRight: {
    display: "flex",
    justifyContent: "flex-end"
  },
  noBorder: {
    borderBottomStyle: "hidden"
  },
  loadingState: {
    opacity: 0.05
  },
  loadingMessage: {
    position: "absolute",
    top: "40%",
    left: "40%"
  },
  sentenceSelectionBlock: {
    marginTop: "0rem"
  },
  footer: {
    textAlign: "center"
  },
  algorithmSelectFormMain: {
    marginRight: ".5rem"
  }
});
