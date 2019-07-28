import {
  lorem_twenty_words,
  lorem_twenty_words_alternative
} from "utilities/lorem";
import Typography from "@material-ui/core/Typography/Typography";
import React, { Fragment } from "react";
import Divider from "@material-ui/core/Divider/Divider";
import Button from "@material-ui/core/Button/Button";
import { Value } from "slate";

export const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: "Climate change has "
          }
        ]
      }
    ]
  }
});
export const HowToSelectPromptSection = (
  <Typography variant="subtitle1" gutterBottom color={"textPrimary"}>
    {/*Don't judge me for using bold. I got lazy.*/}
    Select using <b>Up</b> & <b>Down</b>. <b>Enter</b> to Insert. Or{" "}
    <b>Click. </b>
    <b>Spacebar</b> triggers suggestions.
  </Typography>
);
export const WritingHeader = (
  <Typography color="secondary" gutterBottom variant={"h5"}>
    Write.
  </Typography>
);
export const DividerSection = (
  <Fragment>
    <br />
    <Divider />
    <br />
  </Fragment>
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
export const promptOne = `${lorem_twenty_words} `;
export const promptTwo = `${lorem_twenty_words_alternative} `;
export const promptThree = `${lorem_twenty_words} 3 `;
export const promptFour = `${lorem_twenty_words_alternative} 4 `;

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const SPECIAL_CHARACTERS = [",", "!", "."];
