import Typography from "@material-ui/core/Typography/Typography";
import React, { Fragment } from "react";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import { Value } from "slate";
import { getRandomItemFromArray } from "utilities/utilities";
import Grid from "@material-ui/core/Grid/Grid";
import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";
import MouseIcon from "@material-ui/icons/Mouse";
import Paper from "@material-ui/core/Paper/Paper";
import { PROMPTS_TO_USE } from "components/MainComponent/constants";

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: getRandomItemFromArray(PROMPTS_TO_USE)
          }
        ]
      }
    ]
  }
});

export const HowToSelectPromptBottomSection = (
  <Typography variant="subtitle2" gutterBottom color={"textPrimary"}>
    Use{" "}
    <b>
      Up
      <ArrowUpIcon fontSize={"small"} />
    </b>
    /<b> Down</b>
    <ArrowDownwardIcon fontSize={"small"} /> keys. <b>Enter</b> to Insert.
    <b> Spacebar</b> gets suggestions.
  </Typography>
);

export const HowToSelectPromptSection = (
  <Fragment>
    <Typography variant="h5" color={"secondary"}>
      Step 2. Choose a prompt to add
    </Typography>
  </Fragment>
);

export const WritingHeader = (
  <Typography color="secondary" gutterBottom variant={"h5"}>
    Step 1. Type a word (or a few)
    <span role="img" aria-label="party">
      🎉
    </span>
  </Typography>
);

export const DividerSection = (
  <Fragment>
    <br />
    <Divider />
    <br />
  </Fragment>
);

export const NetlifyLogo = (
  <a href="https://www.netlify.com">
    <img
      src="https://www.netlify.com/img/global/badges/netlify-light.svg"
      alt={"Netlify Logo"}
    />
  </a>
);
export const LearnMoreButton = ({ classes }) => {
  return (
    <div className={classes.alignRight}>
      <Button
        color="primary"
        variant="contained"
        className={classes.actionButton}
      >
        {/*TODO - Switch To MenuList Upon Click or Speed Dial*/}
        Actions
      </Button>
    </div>
  );
};

export const GridLayout = ({ classes, children }) => {
  // extracted because i really hate seeing the 20 layers of indent in renders
  return (
    <Grid container justify="center">
      <Grid
        spacing={4}
        alignItems="center"
        justify="center"
        container
        className={classes.grid}
      >
        <Grid container item xs={12}>
          <Grid item xs={12}>
            {children}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export const SenriganAnalyticsFooter = (
  <Typography variant="body1" color={"textPrimary"}>
    Made with ♥ by{" "}
    <a
      href="https://home.senrigan.io"
      target={"_blank"}
      rel="noopener noreferrer"
    >
      Senrigan Analytics
    </a>
    {". "}
    Tweet @{" "}
    <a
      href="https://www.twitter.com/shekkery"
      target={"_blank"}
      rel="noopener noreferrer"
    >
      shekkery
    </a>
  </Typography>
);
export const MainFooter = ({ classes }) => {
  return (
    <Paper className={classes.paper}>
      <div className={classes.footer}>
        <Typography variant="subtitle1" color={"textPrimary"}>
          <b>HUGE </b>thanks to{" "}
          <a
            href="https://openai.com/blog/better-language-models/"
            target={"_blank"}
          >
            OpenAI
          </a>{" "}
          for releasing GPT-2 Medium;{" "}
          <a
            href="https://github.com/huggingface/pytorch-transformers"
            target={"_blank"}
          >
            HuggingFace
          </a>{" "}
          for their PyTorch implementation.
        </Typography>
        <Typography variant="subtitle1" color={"textPrimary"}>
          The{" "}
          <a
            href="https://senrigan.io/blog/"
            target={"_blank"}
            rel="noopener noreferrer"
          >
            blog
          </a>{" "}
          will have a featured article detailing technical challenges, solutions
          and tradeoffs.
        </Typography>
        <Typography variant="body1" color={"textPrimary"}>
          <a
            href="https://github.com/jeffshek/writeup-frontend"
            target={"_blank"}
          >
            Open Sourced
          </a>
          {". "}Powered by{" "}
          <a
            href="https://cloud.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google Cloud Platform
          </a>{" "}
          and{" "}
          <a
            href="http://netlify.com"
            target={"_blank"}
            rel="noopener noreferrer"
          >
            Netlify
          </a>
          {". "}
        </Typography>
        {SenriganAnalyticsFooter}
      </div>
    </Paper>
  );
};
