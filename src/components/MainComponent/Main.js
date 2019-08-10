import React, { Fragment } from "react";
import { MainStyles } from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import { TopbarComponent } from "components/TopbarComponent/Topbar";
import { Editor } from "slate-react";
import { PromptSelectComponent } from "components/PromptSelectComponent";
import { ReactWebSocket } from "components/ReactWebSocket";
import { serializeAPIMessageToPrompts } from "utilities/apiSerializers";
import {
  DividerSection,
  GridLayout,
  HowToSelectPromptBottomSection,
  HowToSelectPromptSection,
  initialValue,
  MainFooter,
  WritingHeader
} from "components/MainComponent/Layouts";

import moment from "moment";
import { LinearIndeterminate } from "components/Loading";
import { SettingsModal } from "components/Modals/SettingsModal";
import {
  SPECIAL_CHARACTERS,
  WebSocketURL
} from "components/MainComponent/constants";
import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import { PublishModal } from "components/Modals/PublishModal";
import { TutorialModal } from "components/Modals/TutorialModal";
import { Helmet } from "react-helmet";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

// this file is a beast and should be refactored into 2-3 separate files, sorry
// an area of difficulty is writing apps have a lot of "state" management
// which makes it harder to refactor and parse

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

      // ux settings
      arrowKeysSelect: true,
      aiAssistEnabled: true,

      // create a false lastSent to ensure first send is easy
      lastSent: moment().subtract(5, "seconds"),
      temperature: 0.5,
      // lower top_k made all the prompts look the same
      top_k: 30,
      // 45 felt like a good number
      // 17 just loads way faster
      length: 19,
      batch_size: 7,
      settingsModalOpen: false,
      publishModalOpen: false,
      tutorialModalOpen: true,
      // during saving, let only one request happen
      publishDisabled: false,

      // when doing test, uncomment this
      // publish sections
      //title: "Of Lions and Monkeys",
      //email: "email@gmail.com",
      //website: "www.senrigan.io",
      //instagram: "shekgram",
      //twitter: "shekkery",
      //share_state: "published"

      title: "",
      email: "",
      website: "",
      instagram: "",
      twitter: "",
      share_state: "published_link_access_only"
    };
  }

  componentDidMount() {
    this.websocket = new ReactWebSocket({
      url: WebSocketURL,
      debug: true,
      shouldReconnect: true,
      onMessage: this.handleWebSocketData,
      onOpen: this.webSocketConnected
    });

    this.websocket.setupWebSocket();

    // puts cursor at end for easier resuming
    this.textEditorRef.current.moveToEndOfDocument();
    this.intervalID = setInterval(this.checkToSend, 2000);
  }

  handleSwitchCheck = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  componentWillUnmount() {
    this.websocket.dissembleWebSocket();
    clearInterval(this.intervalID);
  }

  ////////////////////
  // timing utilities
  ////////////////////
  enoughTimeSinceLastSend = () => {
    //fast typists shouldn't send multiple API calls to the server,
    //especially if they know what they're about to write
    const delayLimit = moment().subtract(1, "seconds");

    // return true only if we've waited enough time to not hammer
    // the servers
    return this.state.lastSent < delayLimit;
  };

  checkToSend = () => {
    // i sort of worry I'm writing a huge ddos attack on myself to
    // slightly improve UX slightly ...

    const editorAtEndOfText = this.checkEditorPositionAtEnd();
    const userForgotToHitSpace =
      editorAtEndOfText && this.state.textPrompts.length === 0;

    if (this.state.unsent || userForgotToHitSpace) {
      const canSend = this.enoughTimeSinceLastSend();
      if (canSend) {
        this.sendTextToWebSocket();
      }
    }
  };

  ////////////////////
  // websocket handling
  ////////////////////
  handleWebSocketData = data => {
    const messageSerialized = JSON.parse(data);
    const message = messageSerialized["message"];

    const textPrompts = serializeAPIMessageToPrompts({ message });
    const text = this.state.editorValue.document.text;

    // This will only show texts that were meant for the prompt ...
    // this happens if the user types very quickly and it fires off a lot
    // of API requests, then we keep on receiving additional messages
    // from previous words
    if (message.prompt.trim().slice(-10) === text.trim().slice(-10)) {
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
    // but only get the last 1500 characters, otherwise, we run out of
    // memory on gpu instances
    const text = this.state.editorValue.document.text.slice(-1500);

    const textIsBlank = text.trim().length === 0;
    if (textIsBlank) {
      return;
    }

    const message = {
      prompt: text,
      temperature: this.state.temperature,
      top_k: this.state.top_k,
      length: this.state.length,
      batch_size: this.state.batch_size
    };

    console.log("Sending| " + text);
    const messageSerialized = JSON.stringify(message);

    this.websocket.sendMessage(messageSerialized);
  };

  ////////////////////
  // text editor utilities
  ////////////////////
  onTextChange = ({ value }) => {
    this.setState({ editorValue: value });
  };

  checkEditorPositionAtEnd = () => {
    // pretty sure it shouldn't this hard to check positions, but i haven't
    // groked all of slatejs documentation because i'm focusing on optimizing
    // on the backend
    const currentOffset = this.textEditorRef.current.value.selection.focus
      .offset;
    const endTextLength = this.textEditorRef.current.value.endText.text.length;

    /*
    justification of this function ...

    if slatejs's offset is at the same position as the ending text length
    means the user typed a word and forgot spacebar. since using spacebar
    is an odd way to "fire" an api, sometimes users (aka myself) forget to hit
    spacebar. it's a crappy UX feeling when you forget to hit spacebar, so throw
    a hack to check if the user (yourself) made this error

    i didn't just fire the API regardless at any cursor position, because
    there's one killer feature that i wanted to add (ssssh. it's a secret for
    now). thanks for reading this far tho!
    */
    return currentOffset === endTextLength;
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
      this.setState({ currentDetailIndex: 0 });
    } else if (this.state.currentDetailIndex < maxIndex) {
      this.setState({ currentDetailIndex: this.state.currentDetailIndex + 1 });
    } else if (this.state.currentDetailIndex === maxIndex) {
      this.setState({ currentDetailIndex: 0 });
    }
  };

  onSpacebarPressed = () => {
    // everytime a spacebar is hit, it's the end of a word
    // set unsent true, but if the writer is typing really quickly
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
    const spaceKey = 32;

    if (e.keyCode === upKey && this.state.arrowKeysSelect) {
      this.moveUp();
      e.preventDefault();
    } else if (e.keyCode === downKey && this.state.arrowKeysSelect) {
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
      // Do a bit of logic here to contain if text character ending
      // has a space or doesn't ... and if the chosen text contains
      // an end of text prompt
      const editor = self.textEditorRef.current;

      const typedText = self.state.editorValue.document.text;
      const lastCharacterText = typedText.slice(-1);
      const lastCharacterIsSpace = lastCharacterText === " ";

      // if the text input starts with a . or something denoting
      // an end of a phrase, remove a space to add the .
      const firstCharacterOfText = text[0];
      const firstCharacterOfTextIsSpecial = SPECIAL_CHARACTERS.includes(
        firstCharacterOfText
      );
      const firstCharacterOfTextIsSpace = firstCharacterOfText === " ";

      if (lastCharacterIsSpace && firstCharacterOfTextIsSpecial) {
        editor.moveAnchorBackward(1).insertText(text);
      } else if (firstCharacterOfTextIsSpace && lastCharacterIsSpace) {
        editor.moveAnchorBackward(1).insertText(text);
      } else {
        editor.insertText(text);
      }

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

  //////
  // settings & modal helpers
  //////
  setSettings = setting => value => {
    this.setState({ [setting]: value });
  };

  applySettings = () => {
    // This whole function is to make the user feel powerful
    // it forces a websocket call with the updated setting choices
    // kind of unnecessary lol
    this.sendTextToWebSocket();
    this.setModal("settingsModalOpen")();
  };

  setModal = modalStateName => () => {
    const currentModalState = this.state[modalStateName];
    this.setState(
      { [modalStateName]: !currentModalState },
      this.focusTextInput
    );
  };

  toggleaiAssistEnabled = () => {
    // so many utilities to help UX, it amazes me notion is able to do so much.
    // building a SIMPLE text app has already so many custom things
    if (this.state.aiAssistEnabled) {
      // that means we're turning it off, turn off some other stuff too
      this.setState({
        aiAssistEnabled: false,
        arrowKeysSelect: false
      });
    } else {
      this.setState({
        aiAssistEnabled: true,
        arrowKeysSelect: true
      });
    }
  };

  renderSettingsModal = () => {
    if (!this.state.settingsModalOpen) {
      return null;
    }

    return (
      <SettingsModal
        modalOpen={this.state.settingsModalOpen}
        setModal={this.setModal("settingsModalOpen")}
        settings={this.state}
        setSettings={this.setSettings}
        applySettings={this.applySettings}
      />
    );
  };

  renderPublishModal = () => {
    if (!this.state.publishModalOpen) {
      return null;
    }

    return (
      <PublishModal
        modalOpen={this.state.publishModalOpen}
        setModal={this.setModal("publishModalOpen")}
        settings={this.state}
        setSettings={this.setSettings}
        publishDisabled={this.state.publishDisabled}
      />
    );
  };

  renderTutorialModal = () => {
    if (!this.state.tutorialModalOpen) {
      return null;
    }

    return (
      <TutorialModal
        modalOpen={this.state.tutorialModalOpen}
        setModal={this.setModal("tutorialModalOpen")}
        settings={this.state}
        setSettings={this.setSettings}
      />
    );
  };

  renderModals = () => {
    return (
      <Fragment>
        {this.renderSettingsModal()}
        {this.renderPublishModal()}
        {this.renderTutorialModal()}
      </Fragment>
    );
  };

  renderPublishButton = () => {
    const { classes } = this.props;

    return (
      <Grid container direction="row" justify="flex-end" alignItems="center">
        <Button
          variant="contained"
          color="secondary"
          className={classes.publishButton}
          onClick={this.setModal("publishModalOpen")}
        >
          Publish
        </Button>
      </Grid>
    );
  };

  renderHeaderAndTutorial = () => {
    const { classes } = this.props;

    const aiLabel = this.state.aiAssistEnabled ? "ON" : "OFF";
    const aiButtonStyle = this.state.aiAssistEnabled ? "contained" : "outlined";

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>{WritingHeader}</Grid>
        <Grid item>
          <Button
            variant={aiButtonStyle}
            color="primary"
            className={classes.button}
            onClick={this.toggleaiAssistEnabled}
          >
            AI Assist: {aiLabel}
          </Button>
          <Button
            //variant="contained"
            variant="outlined"
            color="secondary"
            className={classes.button}
            onClick={this.setModal("tutorialModalOpen")}
          >
            Tutorial
          </Button>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <Helmet>
          <meta charSet="utf-8" />
          <title>writeup.ai | write fast.</title>
        </Helmet>
        <TopbarComponent setModal={this.setModal("settingsModalOpen")} />
        {this.renderModals()}
        <div className={classes.root} onKeyDown={this.onKeyPressed}>
          <GridLayout classes={classes}>
            <Paper className={classes.paper}>
              <div className={classes.box}>
                {this.renderHeaderAndTutorial()}
                <div className={classes.textBox}>
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
                  </Typography>
                </div>
                {this.renderPublishButton()}
                {/*{DividerSection}*/}

                {this.state.aiAssistEnabled &&
                this.state.textPrompts.length > 0 ? (
                  <Fragment>
                    <Grid
                      container
                      direction="row"
                      justify="space-between"
                      alignItems="center"
                    >
                      <Grid item>{HowToSelectPromptSection}</Grid>
                      <Grid item>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={this.state.arrowKeysSelect}
                              onChange={this.handleSwitchCheck(
                                "arrowKeysSelect"
                              )}
                              value="arrowKeysSelect"
                            />
                          }
                          label="Enable Arrow Keys Selection"
                        />
                      </Grid>
                    </Grid>
                    <PromptSelectComponent
                      selectedIndex={this.state.currentDetailIndex}
                      onTextClick={this.onTextClick}
                      textPrompts={this.state.textPrompts}
                    />
                    {HowToSelectPromptBottomSection}
                  </Fragment>
                ) : (
                  <LinearIndeterminate show={this.state.aiAssistEnabled} />
                )}
              </div>
            </Paper>
            <br />
            <MainFooter classes={classes} />
          </GridLayout>
        </div>
      </Fragment>
    );
  }
}

export const MainComponent = withRouter(withStyles(MainStyles)(_MainComponent));
