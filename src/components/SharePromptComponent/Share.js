import React, { Fragment } from "react";
import { TopbarComponent } from "components/TopbarComponent/Topbar";
import { GridLayout } from "components/MainComponent/utilities";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from "@material-ui/core";
import backgroundShape from "images/shape.svg";
import Typography from "@material-ui/core/Typography";
import { lorem_ipsum_five_paragraphs } from "utilities/lorem";

const titleStyles = makeStyles(theme => ({
  composed: {
    marginLeft: "2rem",
    marginBottom: "2rem"
  }
}));

const TitleHeader = ({ title, author }) => {
  const classes = titleStyles();

  return (
    <Fragment>
      <Typography color="secondary" variant={"h3"}>
        {title}
      </Typography>
      <Typography
        color="secondary"
        gutterBottom
        variant={"subtitle1"}
        className={classes.composed}
      >
        Composed and Written By {author}
      </Typography>
    </Fragment>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.grey["100"],
    overflow: "hidden",
    background: `url(${backgroundShape}) no-repeat`,
    backgroundSize: "cover",
    backgroundPosition: "0 400px",
    paddingBottom: 100
  },
  grid: {
    width: 1200,
    marginTop: 20,
    [theme.breakpoints.down("sm")]: {
      width: "calc(100% - 20px)"
    }
  },
  paper: {
    padding: theme.spacing(3),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  box: {
    marginBottom: 20,
    minHeight: 150
  }
}));

const SharedArticle = ({ text }) => {
  return (
    <Fragment>
      <Typography style={{ whiteSpace: "pre-line" }} color={"textPrimary"}>
        {text}
      </Typography>
    </Fragment>
  );
};

const footerStyles = makeStyles(theme => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary
  },
  footer: {
    textAlign: "center"
  }
}));

const Footer = () => {
  const classes = footerStyles();

  return (
    <Paper className={classes.paper}>
      <div className={classes.footer}>
        <Typography color={"textPrimary"}>
          <a
            href="https://github.com/jeffshek/writeup-frontend"
            target={"_blank"}
          >
            Open Sourced
          </a>
          {". "}Created by{" "}
          <a
            href="https://senrigan.io"
            target={"_blank"}
            rel="noopener noreferrer"
          >
            Senrigan Analytics
          </a>
        </Typography>
      </div>
    </Paper>
  );
};

export const ShareComponent = () => {
  const classes = useStyles();

  return (
    <Fragment>
      <TopbarComponent showSettings={false} />
      <div className={classes.root}>
        <GridLayout classes={classes}>
          <Paper className={classes.paper}>
            <div className={classes.box}>
              <TitleHeader title={"The Beginning"} author={"Jeff"} />
              <SharedArticle text={lorem_ipsum_five_paragraphs} />
            </div>
          </Paper>
          <br />
          <Footer />
        </GridLayout>
      </div>
    </Fragment>
  );
};
