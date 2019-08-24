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
import { Editor } from "slate-react";
import { Value } from "slate";
import { renderBlock, renderMark } from "components/SlateJS";
import FavoriteIcon from "@material-ui/icons/Favorite";

const titleStyles = makeStyles(theme => ({
  composed: {
    marginLeft: "2rem",
    marginBottom: "0rem",
    height: "4rem"
  },
  upvoteContainer: {
    height: "4rem",
    marginTop: "auto",
    marginBottom: "auto",
    verticalAlign: "middle"
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
            <Typography color="primary" variant={"h5"} display={"inline"}>
              <FavoriteIcon /> 20
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
          editorValue: editorValue
        });
      });
    }

    fetchPromptData();
  }, [prompt_uuid]);

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
              />
              <br />
              <Editor
                value={state.editorValue}
                renderBlock={renderBlock}
                renderMark={renderMark}
              />
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
