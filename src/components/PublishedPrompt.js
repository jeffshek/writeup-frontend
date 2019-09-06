import React, { Fragment, useEffect } from "react";
import { TopbarComponent } from "./TopbarComponent/Topbar";
import { GridLayout } from "./MainComponent/Layouts";
import Paper from "@material-ui/core/Paper/Paper";
import { makeStyles } from "@material-ui/core";
import backgroundShape from "../images/shape.svg";
import Typography from "@material-ui/core/Typography";
import { withRouter } from "react-router-dom";
import { getPrompt, upvotePrompt } from "../services/resources";
import { Helmet } from "react-helmet";

import TwitterIcon from "../images/icons/twitter.png";
import InstagramIcon from "../images/icons/instagram.png";
import WebsiteIcon from "../images/icons/website.png";
import Grid from "@material-ui/core/Grid";
import { Editor } from "slate-react";
import { Value } from "slate";
import { renderBlock, renderMark } from "components/SlateJS";
import FavoriteIcon from "@material-ui/icons/Favorite";
import { checkTokenKeyInLocalStorage } from "services/storage";
import { LoginOrRegisterModal } from "components/Modals/LoginOrRegisterModal";
import { getSerializedWebsite } from "components/Modals/PublishModal";

const titleStyles = makeStyles(theme => ({
  composed: {
    marginLeft: "2rem",
    marginBottom: "0rem",
    height: "4rem"
  },
  upvoteContainer: {
    color: "#e31b23",
    cursor: "pointer"
  }
}));

const TitleHeader = ({
  title,
  author,
  twitter,
  website,
  instagram,
  score,
  onUpvote
}) => {
  const classes = titleStyles();

  const twitterURL = `https://www.twitter.com/${twitter}`;
  const instagramURL = `https://www.instagram.com/${instagram}`;
  const websiteURL = getSerializedWebsite({ website });

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
            <Typography color="secondary" variant={"h3"} display={"inline"}>
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
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Typography
                display={"inline"}
                variant={"h5"}
                className={classes.upvoteContainer}
                onClick={onUpvote}
              >
                <FavoriteIcon /> {score}
              </Typography>
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
                    <img
                      src={TwitterIcon}
                      alt={"Twitter Icon"}
                      style={{ height: "4rem" }}
                    />
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
                    <img
                      src={InstagramIcon}
                      alt={"Instagram Icon"}
                      style={{ height: "4rem" }}
                    />
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
                    // don't be targetted by bots spamming
                    rel="noopener noreferrer nofollow"
                  >
                    <img
                      src={WebsiteIcon}
                      alt={"Website Icon"}
                      style={{ height: "4rem" }}
                    />
                  </a>
                </Typography>
              ) : null}
            </Grid>
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

const LoadingValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "Loading ... "
          }
        ]
      }
    ]
  }
});

export const _PublishedPromptComponent = props => {
  const classes = useStyles();
  const prompt_uuid = props.match.params.uuid;
  const [personalPromptScore, setPersonalPromptScore] = React.useState(0);
  const [promptScore, setPromptScore] = React.useState(0);
  const [state, setState] = React.useState({
    text: "",
    prompt_uuid: prompt_uuid,
    title: "",
    email: "",
    website: "",
    instagram: "",
    twitter: "",
    editorValue: LoadingValue
  });
  const [loginOrRegisterModal, setLoginOrRegisterModal] = React.useState(false);

  // react data hooks recommend functions nested inside useEffect to prevent
  // issues w/stale data or some odd-other edge cases
  useEffect(() => {
    function fetchPromptData() {
      getPrompt({ prompt_uuid }).then(response => {
        let editorValue;
        if (response.content === "{}") {
          console.log("Unable To Find Content, Reverting to Text");
          editorValue = Value.fromJSON({
            document: {
              nodes: [
                {
                  object: "block",
                  type: "paragraph",
                  nodes: [
                    {
                      object: "text",
                      text: response.text
                    }
                  ]
                }
              ]
            }
          });
        } else {
          const content = JSON.parse(response.content);
          editorValue = Value.fromJSON(content);
        }

        setState({
          text: response.text,
          content: response.content,
          email: response.email,
          instagram: response.instagram,
          title: response.title,
          twitter: response.twitter,
          website: response.website,
          score: response.score,
          editorValue: editorValue,
          uuid: response.uuid
        });

        setPromptScore(response.score);
      });
    }

    fetchPromptData();
  }, [prompt_uuid]);

  const closeModal = () => {
    // this is an embarrassment of spaghetti
    setLoginOrRegisterModal(false);
  };

  const onUpvote = () => {
    // a garbage copy and paste job from PromptCard.js
    // a bit too short on time to make this right
    const loggedIn = checkTokenKeyInLocalStorage();
    if (!loggedIn) {
      setLoginOrRegisterModal(true);
      return;
    }

    let personalScore = personalPromptScore + 1;
    if (personalScore > 3) {
      // don't allow more than 3, even if user gets past this
      // backend will validate much more harshly
      return;
    }

    const updatedPromptScore = promptScore + 1;
    setPromptScore(updatedPromptScore);

    setPersonalPromptScore(personalScore);
    const prompt_uuid = state.uuid;

    upvotePrompt({ prompt_uuid, value: personalScore }).then(response => {
      console.log(`Updated to ${personalScore}!`);
    });
  };

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
              <TitleHeader
                title={state.title}
                author={state.email}
                instagram={state.instagram}
                twitter={state.twitter}
                website={state.website}
                score={promptScore}
                onUpvote={onUpvote}
              />
              <br />
              <Typography
                variant="subtitle1"
                gutterBottom
                color={"textPrimary"}
              >
                <Editor
                  value={state.editorValue}
                  renderBlock={renderBlock}
                  renderMark={renderMark}
                />
              </Typography>
            </div>
          </Paper>
          <br />
          <Footer />
        </GridLayout>
        <LoginOrRegisterModal
          modalOpen={loginOrRegisterModal}
          setModal={closeModal}
        />
      </div>
    </Fragment>
  );
};

export const PublishedPromptComponent = withRouter(_PublishedPromptComponent);
