import React, { Fragment, useEffect } from "react";
import { TopbarComponent } from "./TopbarComponent/Topbar";
import { GridLayout } from "./MainComponent/Layouts";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from "@material-ui/core";
import backgroundShape from "../images/shape.svg";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import { getPrompt } from "../services/resources";
import { Helmet } from "react-helmet";

import TwitterIcon from "../images/icons/twitter.png";
import InstagramIcon from "../images/icons/instagram.png";
import WebsiteIcon from "../images/icons/website.png";
import Grid from "@material-ui/core/Grid";
import { getPublishedPrompts } from "services/resources";
import { PromptCard } from "components/PromptCard";
import { PrettyPromptCard } from "components/TopbarComponent/PrettyPromptCard";

const titleStyles = makeStyles(theme => ({
  composed: {
    marginLeft: "2rem",
    marginBottom: "0rem"
  }
}));

const TitleHeader = ({ title, author, twitter, website, instagram }) => {
  const classes = titleStyles();

  const twitterURL = `https://www.twitter.com/${twitter}`;
  const instagramURL = `https://www.instagram.com/${instagram}`;
  const websiteURL = `//${website}`;

  return (
    <Fragment>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          {title ? (
            <Typography color="secondary" variant={"h3"}>
              {title}
            </Typography>
          ) : null}

          {author ? (
            <Typography
              color="secondary"
              variant={"subtitle1"}
              className={classes.composed}
            >
              Composed and Written By {author}
            </Typography>
          ) : null}
        </Grid>
        <Grid item>
          <div className={classes.composed}>
            {twitter ? (
              <Typography
                color="secondary"
                variant={"subtitle1"}
                display={"inline"}
                style={{ marginRight: ".25rem" }}
              >
                <a
                  href={twitterURL}
                  target={"_blank"}
                  rel="noopener noreferrer"
                >
                  <img src={TwitterIcon} alt={"Twitter Icon"} />
                </a>
              </Typography>
            ) : null}
            {instagram ? (
              <Typography
                color="secondary"
                variant={"subtitle1"}
                display={"inline"}
                style={{ marginRight: ".25rem" }}
              >
                <a
                  href={instagramURL}
                  target={"_blank"}
                  rel="noopener noreferrer"
                >
                  <img src={InstagramIcon} alt={"Instagram Icon"} />
                </a>
              </Typography>
            ) : null}
            {website ? (
              <Typography
                color="secondary"
                variant={"subtitle1"}
                display={"inline"}
                style={{ marginRight: ".25rem" }}
              >
                <a
                  href={websiteURL}
                  target={"_blank"}
                  rel="noopener noreferrer"
                >
                  <img src={WebsiteIcon} alt={"Website Icon"} />
                </a>
              </Typography>
            ) : null}
          </div>
        </Grid>
      </Grid>
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

const _BestPromptsComponent = props => {
  const classes = useStyles();
  const [state, setState] = React.useState({
    data: []
  });

  // react data hooks recommend functions nested inside useEffect to prevent
  // issues w/stale data or some odd-other edge cases
  useEffect(() => {
    function fetchAllPublishedPrompts() {
      getPublishedPrompts().then(data => {
        if (data) {
          setState({ data: data });
        }
      });
    }

    fetchAllPublishedPrompts();
  }, []);

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>writeup.ai | Best Human Composed Prompts</title>
      </Helmet>
      <TopbarComponent showSettings={false} />
      <div className={classes.root}>
        <GridLayout classes={classes}>
          <Paper className={classes.paper}>
            <Typography color={"textPrimary"} variant={"h5"}>
              Most Upvoted Content
              {/*Best Content (By Votes)*/}
            </Typography>
            <div className={classes.box}>
              <Grid
                container
                direction="row"
                justify="center"
                alignItems="center"
              >
                {state.data.map(prompt => {
                  return (
                    <Grid item xs={6} md={4} lg={3} key={prompt.uuid}>
                      <PrettyPromptCard prompt={prompt} />
                    </Grid>
                  );
                })}
              </Grid>
            </div>
          </Paper>
          <br />
          <Footer />
        </GridLayout>
      </div>
    </Fragment>
  );
};

export const BestPromptsComponent = withRouter(_BestPromptsComponent);
