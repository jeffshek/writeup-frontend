import React, { Fragment, useEffect } from "react";
import { TopbarComponent } from "./TopbarComponent/Topbar";
import { GridLayout } from "./MainComponent/Layouts";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from "@material-ui/core";
import backgroundShape from "../images/shape.svg";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";
import Grid from "@material-ui/core/Grid";
import { getPublishedPrompts } from "services/resources";
import { PrettyPromptCard } from "components/TopbarComponent/PrettyPromptCard";
import { LoginOrRegisterModal } from "components/Modals/LoginOrRegisterModal";

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
            rel="noopener noreferrer"
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
  const [data, setData] = React.useState({
    data: []
  });

  const [loginOrRegisterModal, setLoginOrRegisterModal] = React.useState(false);

  // react data hooks recommend functions nested inside useEffect to prevent
  // issues w/stale data or some odd-other edge cases
  useEffect(() => {
    function fetchAllPublishedPrompts() {
      getPublishedPrompts().then(data => {
        if (data) {
          setData({ data: data });
        }
      });
    }

    fetchAllPublishedPrompts();
  }, []);

  const closeModal = () => {
    // this is an embarrassment of spaghetti
    setLoginOrRegisterModal(false);
  };

  return (
    <Fragment>
      <Helmet>
        <meta charSet="utf-8" />
        <title>writeup.ai | Best Human Composed Prompts</title>
      </Helmet>
      <LoginOrRegisterModal
        modalOpen={loginOrRegisterModal}
        setModal={closeModal}
      />
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
                {data.data.map(prompt => {
                  return (
                    <Grid item xs={6} md={4} lg={3} key={prompt.uuid}>
                      <PrettyPromptCard
                        prompt={prompt}
                        setLoginOrRegisterModal={setLoginOrRegisterModal}
                      />
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
