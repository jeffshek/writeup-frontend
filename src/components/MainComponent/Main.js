import React, { Fragment } from "react";
import { MainStyles } from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import { TopbarComponent } from "components/TopbarComponent/Topbar";
import { Editor } from "slate-react";
import { PromptSelectComponent } from "components/MainComponent/PromptSelectComponent";
import { ReactWebSocket } from "components/ReactWebSocket";
import { serializeAPIMessageToPrompts } from "utilities/apiSerializers";
import {
  DividerSection,
  HowToSelectPromptSection,
  initialValue,
  WritingHeader
} from "components/MainComponent/utilities";

const WebSocketURL =
  "wss://open.senrigan.io/ws/writeup/gpt2_medium/session/test/";

export class _MainComponent extends React.Component {
  constructor(props) {
    super(props);
    // need a editor reference since to inset text outside of the editor
    this.textEditorRef = React.createRef();

    //const textPrompts = [promptOne, promptTwo, promptThree, promptFour];
    const textPrompts = [];

    this.state = {
      editorValue: initialValue,
      currentDetailIndex: null,
      textPrompts: textPrompts
    };
  }

  handleWebSocketData = data => {
    const messageSerialized = JSON.parse(data);
    const message = messageSerialized["message"];

    const textPrompts = serializeAPIMessageToPrompts({ message });

    this.setState({
      textPrompts: textPrompts
    });
  };

  sendTextToWebSocket = () => {
    if (!this.websocket.initialized) {
      return;
    }

    // gets a concatenated list of all the text so far
    const text = this.state.editorValue.document.text;

    const message = { message: text };
    const messageSerialized = JSON.stringify(message);

    this.websocket.sendMessage(messageSerialized);
  };

  componentDidMount() {
    this.websocket = new ReactWebSocket({
      url: WebSocketURL,
      debug: true,
      reconnect: true,
      onMessage: this.handleWebSocketData,
      onOpen: this.webSocketConnected
    });

    this.websocket.setupWebSocket();

    // puts cursor at end for easier resuming
    this.textEditorRef.current.moveToEndOfDocument();
  }

  webSocketConnected = () => {
    this.sendTextToWebSocket();
  };

  componentWillUnmount() {
    this.websocket.dissembleWebSocket();
  }

  onTextChange = ({ value }) => {
    this.setState({ editorValue: value });
  };

  moveUp = () => {
    const maxIndex = this.state.textPrompts.length - 1;

    // first move, nothing selected
    if (this.state.currentDetailIndex === null) {
      this.setState({ currentDetailIndex: 0 });
    } else if (this.state.currentDetailIndex > 0) {
      this.setState({ currentDetailIndex: this.state.currentDetailIndex - 1 });
    } else if (this.state.currentDetailIndex === 0) {
      this.setState({ currentDetailIndex: maxIndex });
    }
  };

  moveDown = () => {
    const maxIndex = this.state.textPrompts.length - 1;

    if (this.state.currentDetailIndex === null) {
      this.setState({ currentDetailIndex: maxIndex });
    } else if (this.state.currentDetailIndex < maxIndex) {
      this.setState({ currentDetailIndex: this.state.currentDetailIndex + 1 });
    } else if (this.state.currentDetailIndex === maxIndex) {
      this.setState({ currentDetailIndex: 0 });
    }
  };

  onSpacebarPressed = () => {
    // everytime a spacebar is hit, it's the end of a word
    this.sendTextToWebSocket();
  };

  onKeyPressed = e => {
    const upKey = 38;
    const downKey = 40;
    const escapeKey = 27;

    // TODO - space can sometimes get caught, when a listitem has been selected
    const spaceKey = 32;

    if (e.keyCode === upKey) {
      this.moveUp();
      e.preventDefault();
    } else if (e.keyCode === downKey) {
      this.moveDown();
      e.preventDefault();
    } else if (e.keyCode === escapeKey) {
      this.focusTextInput();
    } else if (e.keyCode === spaceKey) {
      this.onSpacebarPressed();
    }

    // shift every key action back to the text box, this lets
    // user select prompt or disregard halfway and continue writing
    this.focusTextInput();
  };

  clearSelectedPrompt = () => {
    // haven't figured out how to deal with async correctly to set the state to
    // null
    this.setState({ currentDetailIndex: null });
  };

  insertEditorText = ({ text }) => {
    // This is an ugly hack to hide my JS incompetence
    let self = this;
    return new Promise(function(resolve, reject) {
      self.textEditorRef.current.insertText(text);
      resolve("Success!");
    });
  };

  // used as helper utilities for list items to easily add text to editor
  onTextClick = prompt => props => {
    let waitForEditorTextInsert = this.insertEditorText({ text: prompt });

    waitForEditorTextInsert.then(response => {
      this.sendTextToWebSocket();
    });

    this.focusTextInput();

    // after something has been selected, no items should be selected
    //this.clearSelectedPrompt()

    // if something has just been selected, it's time to get new options
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
                      {this.state.textPrompts.length > 0 &&
                        HowToSelectPromptSection}
                      <PromptSelectComponent
                        selectedIndex={this.state.currentDetailIndex}
                        onTextClick={this.onTextClick}
                        textPrompts={this.state.textPrompts}
                      />
                    </div>
                    {/*<LearnMoreButton classes={classes} />*/}
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
