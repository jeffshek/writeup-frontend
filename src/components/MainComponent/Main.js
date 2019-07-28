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

import moment from "moment";
import { LinearIndeterminate } from "components/Loading";

const WebSocketURL =
  "wss://open.senrigan.io/ws/writeup/gpt2_medium/session/test/";

const GridLayout = ({ classes, children }) => {
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

export class _MainComponent extends React.Component {
  constructor(props) {
    super(props);

    // editor reference to insert text outside of the editor direct control
    this.textEditorRef = React.createRef();

    const textPrompts = [];

    this.state = {
      editorValue: initialValue,
      currentDetailIndex: null,
      textPrompts: textPrompts,

      // with each spacebar key, unsent set to true
      unsent: false,

      // create a false lastSent to ensure first send is easy
      lastSent: moment().subtract(5, "seconds")
    };
  }

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

    setInterval(this.checkToSend, 3000);
  }

  componentWillUnmount() {
    this.websocket.dissembleWebSocket();
  }

  // timing utilities
  enoughTimeSinceLastSend = () => {
    //fast typists shouldn't send multiple API calls to the server,
    //especially if they know what they're about to write
    const delayLimit = moment().subtract(2, "seconds");

    // return true only if we've waited enough time to not hammer
    // the servers
    return this.state.lastSent < delayLimit;
  };

  checkToSend = () => {
    if (this.state.unsent) {
      const canSend = this.enoughTimeSinceLastSend();
      if (canSend) {
        this.sendTextToWebSocket();
      }
    }
  };

  // websocket handles
  handleWebSocketData = data => {
    const messageSerialized = JSON.parse(data);
    const message = messageSerialized["message"];

    const textPrompts = serializeAPIMessageToPrompts({ message });
    const text = this.state.editorValue.document.text;

    // This will only show texts that were meant for the prompt ...
    // this happens if the user types very quickly and it fires off a lot
    // of API requests, then we keep on receiving additional messages
    // from previous words
    if (message.prompt.trim() === text.trim()) {
      this.setState({
        textPrompts: textPrompts
      });
    }
  };

  webSocketConnected = () => {
    this.sendTextToWebSocket();
  };

  sendTextToWebSocket = () => {
    if (!this.websocket.initialized) {
      return;
    }

    this.setState({
      unsent: false,
      lastSent: moment(),
      textPrompts: []
    });

    // gets a concatenated list of all the text so far
    const text = this.state.editorValue.document.text;
    const message = { message: text };

    console.log("Sending| " + text);
    const messageSerialized = JSON.stringify(message);

    this.websocket.sendMessage(messageSerialized);
  };

  // text editor utilities
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
    // set unsent here, but if the writer is typing really quickly
    // then ensure that they can only send one api call a second
    // otherwise, his/her own api calls will trip
    this.setState({ unsent: true, textPrompts: [] });

    const canSend = this.enoughTimeSinceLastSend();

    if (canSend) {
      this.sendTextToWebSocket();
    }
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
      // TODO - consider maybe including periods other end of sentences?
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
    // when selecting a new text, empty out the previous prompts
    let waitForEditorTextInsert = this.insertEditorText({ text: prompt });

    waitForEditorTextInsert.then(response => {
      this.sendTextToWebSocket();
    });

    this.focusTextInput();

    // after something has been selected, no items should be selected
    //this.clearSelectedPrompt()
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
          <GridLayout classes={classes}>
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
                {this.state.textPrompts.length > 0 ? (
                  <Fragment>
                    {HowToSelectPromptSection}
                    <PromptSelectComponent
                      selectedIndex={this.state.currentDetailIndex}
                      onTextClick={this.onTextClick}
                      textPrompts={this.state.textPrompts}
                    />
                  </Fragment>
                ) : (
                  <LinearIndeterminate />
                )}
              </div>
              {/*<LearnMoreButton classes={classes} />*/}
            </Paper>
          </GridLayout>
        </div>
      </Fragment>
    );
  }
}

export const MainComponent = withRouter(withStyles(MainStyles)(_MainComponent));
