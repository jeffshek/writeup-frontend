import React, { Fragment } from "react";
import { MainStyles } from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import { TopbarComponent } from "components/TopbarComponent/Topbar";
import { Editor } from "slate-react";
import { Value } from "slate";
import { lorem_one_paragraph } from "utilities/lorem";
import { PromptSelectComponent } from "components/MainComponent/PromptSelectComponent";
import Divider from "@material-ui/core/Divider/Divider";

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: "block",
        type: "paragraph",
        nodes: [
          {
            object: "text",
            text: lorem_one_paragraph
          }
        ]
      }
    ]
  }
});

const WritingHeader = (
  <Typography color="secondary" gutterBottom variant={"h5"}>
    Write.
  </Typography>
);

const DividerSection = (
  <Fragment>
    <br />
    <Divider />
    <br />
  </Fragment>
);

const LearnMoreButton = ({ classes }) => {
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

export class _MainComponent extends React.Component {
  state = {
    editorValue: initialValue,
    currentDetailIndex: 0,
    numOfListItems: 4
  };

  constructor(props) {
    super(props);
    this.textEditorRef = React.createRef();
  }

  onTextChange = ({ value }) => {
    this.setState({ editorValue: value });
  };

  moveUp = () => {
    if (this.state.currentDetailIndex > 0) {
      this.setState({ currentDetailIndex: this.state.currentDetailIndex - 1 });
    }

    if (this.state.currentDetailIndex === 0) {
      this.setState({ currentDetailIndex: this.state.numOfListItems - 1 });
    }
  };

  moveDown = () => {
    if (this.state.currentDetailIndex < this.state.numOfListItems - 1) {
      this.setState({ currentDetailIndex: this.state.currentDetailIndex + 1 });
    }

    if (this.state.currentDetailIndex === this.state.numOfListItems - 1) {
      this.setState({ currentDetailIndex: 0 });
    }
  };

  onKeyPressed = e => {
    const upKey = 38;
    const downKey = 40;
    const escapeKey = 27;

    // TODO - space can sometimes get caught, when a listitem
    // has been selected
    const spaceKey = 32;

    if (e.keyCode === upKey) {
      this.moveUp();
      e.preventDefault();
    } else if (e.keyCode === downKey) {
      this.moveDown();
      e.preventDefault();
    } else if (e.keyCode === escapeKey) {
      this.focusTextInput();
    }

    // shift every key action back to the text box, this lets
    // user select prompt or disregard halfway and continue writing
    this.focusTextInput();
  };

  insertText = ({ text }) => {
    this.textEditorRef.current.insertText(text);
  };

  // used as helper utilities for list items to easily add text to editor
  onTextClick = prompt => props => {
    this.insertText({ text: prompt });
  };

  focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.textEditorRef.current.focus();
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <TopbarComponent />
        <div className={classes.root} onKeyDown={this.onKeyPressed}>
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
                  <Paper className={classes.paper}>
                    <div className={classes.box}>
                      {WritingHeader}
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        color={"textPrimary"}
                      >
                        <Editor
                          value={this.state.editorValue}
                          onChange={this.onTextChange}
                          autoFocus={true}
                          ref={this.textEditorRef}
                        />
                        {DividerSection}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        color={"textPrimary"}
                      >
                        {/*Don't judge me for using bold. I got lazy.*/}
                        Select using <b>Up</b> & <b>Down</b> Keys. Hit{" "}
                        <b>Enter</b> to Select. <b>Double Clicking </b>
                        Works Too!
                      </Typography>

                      <PromptSelectComponent
                        selectedIndex={this.state.currentDetailIndex}
                        onTextClick={this.onTextClick}
                      />
                    </div>
                    <LearnMoreButton classes={classes} />
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export const MainComponent = withRouter(withStyles(MainStyles)(_MainComponent));
