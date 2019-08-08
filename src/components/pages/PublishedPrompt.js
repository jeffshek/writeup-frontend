import React, { Fragment, useEffect } from "react";
import { TopbarComponent } from "../TopbarComponent/Topbar";
import { GridLayout } from "../MainComponent/utilities";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from "@material-ui/core";
import backgroundShape from "../../images/shape.svg";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import { getPrompt } from "services/resources";
import { Helmet } from "react-helmet";

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
      {title ? (
        <Typography color="secondary" variant={"h3"}>
          {title}
        </Typography>
      ) : null}

      {author ? (
        <Typography
          color="secondary"
          gutterBottom
          variant={"subtitle1"}
          className={classes.composed}
        >
          Composed and Written By {author}
        </Typography>
      ) : null}
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

const PromptText = ({ text }) => {
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
          {". "}Made with ♥ by{" "}
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

export const _PublishedPromptComponent = props => {
  const classes = useStyles();
  const prompt_uuid = props.match.params.uuid;
  const [state, setState] = React.useState({
    text: "",
    prompt_uuid: prompt_uuid,
    title: "",
    email: "",
    website: "",
    instagram: "",
    twitter: ""
  });

  const fetchPromptData = () => {
    getPrompt({ prompt_uuid }).then(response => {
      setState({
        text: response.text,
        email: response.email,
        instagram: response.instagram,
        title: response.title,
        twitter: response.twitter,
        website: response.website
      });
    });
  };

  useEffect(() => fetchPromptData(), []);

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>writeup.ai | {state.title} </title>
      </Helmet>
      <TopbarComponent showSettings={false} />
      <div className={classes.root}>
        <GridLayout classes={classes}>
          <Paper className={classes.paper}>
            <div className={classes.box}>
              {state.text ? null : "Loading ... "}
              <TitleHeader title={state.title} author={state.email} />
              <PromptText text={state.text} />
            </div>
          </Paper>
          <br />
          <Footer />
        </GridLayout>
      </div>
    </Fragment>
  );
};

export const PublishedPromptComponent = withRouter(_PublishedPromptComponent);
