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
  GPT2_MEDIUM_MODEL_NAME,
  PROMPTS_TO_USE,
  SPECIAL_CHARACTERS,
  WebSocketURL
} from "components/MainComponent/constants";
import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import { PublishModal } from "components/Modals/PublishModal";
import { TutorialModal } from "components/Modals/TutorialModal";
import { Helmet } from "react-helmet";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { getRandomItemFromArray } from "utilities/utilities";
import { LoginOrRegisterModal } from "components/Modals/LoginOrRegisterModal";
import { checkTokenKeyInLocalStorage } from "services/storage";
import {
  Icon,
  isBoldHotkey,
  isCodeHotkey,
  isItalicHotkey,
  isUnderlinedHotkey,
  renderBlock,
  renderMark,
  Toolbar
} from "components/SlateJS";

const DEFAULT_NODE = "paragraph";

// this file is a beast and should be refactored into 2-3 separate files, sorry
// state management is difficult to manage with writing apps

export class _MainComponent extends React.Component {
  constructor(props) {
    super(props);

    const textPrompts = [];

    // this is getting into spaghetti, but needed this for async
    this.undoAdd = this.undoAdd.bind(this);

    const showTutorial = process.env.REACT_APP_ENV !== "development";

    this.state = {
      editorValue: initialValue,
      currentDetailIndex: null,
      textPrompts: textPrompts,

      // with each spacebar key, unsent set to true
      unsent: false,

      // ux settings
      arrowKeysSelect: true,
      aiAssistEnabled: true,

      userLoggedIn: checkTokenKeyInLocalStorage(),

      // create a false lastSent to ensure first send is easy
      lastSent: moment().subtract(5, "seconds"),

      // algo settings
      model_name: GPT2_MEDIUM_MODEL_NAME,
      temperature: 0.5,
      // low top_k results in all the same prompts
      top_k: 30,

      // nucleus (or top-p) sampling
      // turn off until you can fix cuda issues
      top_p: 0,

      // 45 words felt like a good number, 17 just loads way faster
      length: 19,
      batch_size: 7, // having higher batch sizes doesn't slow it down much

      // modals
      loginOrRegisterModal: false,
      settingsModalOpen: false,
      publishModalOpen: false,
      tutorialModalOpen: showTutorial,

      // during saving, only let one request happen
      publishDisabled: false,

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
    this.editor.moveToEndOfDocument();

    // Set interval helpers to run in the background to make UX feel smoother
    // if a user forgets to hit spacebar, this will send a signal
    this.intervalID = setInterval(this.checkToSend, 2000);
  }

  // editor utilities - pulled from slatejs
  // all the smart code begins here
  // https://github.com/ianstormtaylor/slate/blob/master/examples/rich-text/index.js
  hasMark = type => {
    const { editorValue } = this.state;
    return editorValue.activeMarks.some(mark => mark.type === type);
  };

  hasBlock = type => {
    const { editorValue } = this.state;
    return editorValue.blocks.some(node => node.type === type);
  };

  renderEditorToolbar = () => {
    return (
      <Fragment>
        <Toolbar>
          {this.renderMarkButton("bold", "format_bold")}
          {this.renderMarkButton("italic", "format_italic")}
          {this.renderMarkButton("underlined", "format_underlined")}
          {this.renderMarkButton("code", "code")}
          {this.renderBlockButton("heading-one", "looks_one")}
          {this.renderBlockButton("heading-two", "looks_two")}
          {this.renderBlockButton("block-quote", "format_quote")}
          {this.renderBlockButton("numbered-list", "format_list_numbered")}
          {this.renderBlockButton("bulleted-list", "format_list_bulleted")}
        </Toolbar>
      </Fragment>
    );
  };

  renderMarkButton = (type, icon) => {
    const isActive = this.hasMark(type);

    return (
      <Button
        active={isActive.toString()}
        onMouseDown={event => this.onClickMark(event, type)}
      >
        <Fragment>
          <Icon>{icon}</Icon>
          {isActive ? "ON" : null}
        </Fragment>
      </Button>
    );
  };

  renderBlockButton = (type, icon) => {
    let isActive = this.hasBlock(type);

    if (["numbered-list", "bulleted-list"].includes(type)) {
      const {
        editorValue: { document, blocks }
      } = this.state;

      if (blocks.size > 0) {
        const parent = document.getParent(blocks.first().key);
        isActive = this.hasBlock("list-item") && parent && parent.type === type;
      }
    }

    return (
      <Button
        active={isActive.toString()}
        onMouseDown={event => this.onClickBlock(event, type)}
      >
        <Icon>{icon}</Icon>
      </Button>
    );
  };

  onKeyDown = (event, editor, next) => {
    let mark;

    if (isBoldHotkey(event)) {
      mark = "bold";
    } else if (isItalicHotkey(event)) {
      mark = "italic";
    } else if (isUnderlinedHotkey(event)) {
      mark = "underlined";
    } else if (isCodeHotkey(event)) {
      mark = "code";
    } else {
      return next();
    }

    event.preventDefault();
    editor.toggleMark(mark);
  };

  ref = editor => {
    // not smart enough to know why this works and react's createref didn't
    this.editor = editor;
  };

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.toggleMark(type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this;
    const { value } = editor;
    const { document } = value;

    // Handle everything but list buttons.
    if (type !== "bulleted-list" && type !== "numbered-list") {
      const isActive = this.hasBlock(type);
      const isList = this.hasBlock("list-item");

      if (isList) {
        editor
          .setBlocks(isActive ? DEFAULT_NODE : type)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else {
        editor.setBlocks(isActive ? DEFAULT_NODE : type);
      }
    } else {
      // Handle the extra wrapping required for list buttons.
      const isList = this.hasBlock("list-item");
      const isType = value.blocks.some(block => {
        return !!document.getClosest(block.key, parent => parent.type === type);
      });

      if (isList && isType) {
        editor
          .setBlocks(DEFAULT_NODE)
          .unwrapBlock("bulleted-list")
          .unwrapBlock("numbered-list");
      } else if (isList) {
        editor
          .unwrapBlock(
            type === "bulleted-list" ? "numbered-list" : "bulleted-list"
          )
          .wrapBlock(type);
      } else {
        editor.setBlocks("list-item").wrapBlock(type);
      }
    }
  };

  // end of code from https://github.com/ianstormtaylor/slate/blob/master/examples/rich-text/index.js
  // smart code ends here

  // dumb code begins here
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
    const delayLimit = moment().subtract(2, "seconds");

    // return true only if we've waited enough time to not hammer
    // the servers
    return this.state.lastSent < delayLimit;
  };

  checkToSend = () => {
    // i sort of worry I'm writing a huge ddos attack on myself to
    // only slightly improve UX  ...

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

    //console.log(message.text_0);

    // This will only show texts that were meant for the prompt ...
    // this happens if the user types very quickly and it fires off a lot
    // of API requests, then we keep on receiving additional messages
    // from previous phrases that no longer apply
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
      top_p: this.state.top_p,
      length: this.state.length,
      batch_size: this.state.batch_size,
      model_name: this.state.model_name,
      message_type: "new_request" // frontend should end new_requests
    };

    console.log("Sending  | ");
    const messageSerialized = JSON.stringify(message);
    this.websocket.sendMessage(messageSerialized);
  };

  ////////////////////
  // text editor utilities
  ////////////////////
  onTextChange = ({ value }) => {
    if (value.document !== this.state.editorValue.document) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem("content", content);
    }

    this.setState({ editorValue: value });
  };

  checkEditorPositionAtEnd = () => {
    // pretty sure it shouldn't this hard to check positions, but i haven't
    // groked all of slatejs documentation because i'm focusing on optimizing
    // on the backend
    const currentOffset = this.editor.value.selection.focus.offset;
    const endTextLength = this.editor.value.endText.text.length;

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

    // even optimized with cascade lakes or v100s can't handle how fast some humans
    // type, so add a linter check to prevent humans that type super fast
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

  insertEditorText = ({ text }) => {
    // This is an ugly hack to hide my JS incompetence
    let self = this;
    return new Promise(function(resolve, reject) {
      // Do a bit of logic here to contain if text character ending
      // has a space or doesn't ... and if the chosen text contains
      // an end of text prompt
      const editor = self.editor;

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
        editor.moveToEndOfDocument().insertText(text);
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
  };

  focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.editor.focus();
  };

  startNewText = () => {
    const textLength = this.state.editorValue.document.text.length;
    this.editor.deleteBackward(textLength);

    const randomPrompt = getRandomItemFromArray(PROMPTS_TO_USE);
    this.editor.insertText(randomPrompt);

    this.focusTextInput();

    // hack, didn't want to use promises
    setTimeout(this.sendTextToWebSocket, 100);
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

  renderLoginOrRegisterModal = () => {
    if (!this.state.loginOrRegisterModal) {
      return null;
    }

    return (
      <LoginOrRegisterModal
        modalOpen={this.state.loginOrRegisterModal}
        setModal={this.setModal("loginOrRegisterModal")}
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
        {this.renderLoginOrRegisterModal()}
      </Fragment>
    );
  };

  renderWordCountAndPublishButton = () => {
    const { classes } = this.props;

    const wordCount = this.getWordCount();

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>Word Count: {wordCount}</Grid>
        <Grid item>
          <Button
            variant="contained"
            color="secondary"
            className={classes.publishButton}
            onClick={this.setModal("publishModalOpen")}
          >
            Publish
          </Button>
        </Grid>
      </Grid>
    );
  };

  getWordCount = () => {
    const text = this.state.editorValue.document.text;
    return text.trim().split(" ").length;
  };

  renderHeaderAndTutorial = () => {
    const { classes } = this.props;

    const aiLabel = this.state.aiAssistEnabled ? "ON" : "OFF";
    const aiButtonStyle = this.state.aiAssistEnabled ? "contained" : "outlined";

    if (!this.state.editorValue.document) {
      return;
    }

    const text = this.state.editorValue.document.text;

    const wordCount = this.getWordCount();
    const showInstructions = wordCount < 50;

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>{showInstructions ? WritingHeader : null}</Grid>
        <Grid item>
          <span className={classes.copiedContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.createRandomPromptButton}
              onClick={this.startNewText}
            >
              Start New Text
            </Button>
            <CopyToClipboard text={text}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: "0.25rem" }}
              >
                <FileCopyIcon />
              </Button>
            </CopyToClipboard>
          </span>
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

  undoEditorInsert = () => {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.editor.undo();
      resolve("Success");
    });
  };

  async undoAdd() {
    await this.undoEditorInsert();
    this.sendTextToWebSocket();
  }

  renderTextPromptSelectionSection = () => {
    const { classes } = this.props;

    if (!this.state.aiAssistEnabled) {
      return null;
    }

    const validPrompts = this.state.textPrompts.length > 0;
    const wordCount = this.getWordCount();
    const showInstructions = wordCount < 50;

    if (validPrompts) {
      return (
        <Fragment>
          <Grid
            container
            direction="row"
            justify="space-between"
            alignItems="center"
          >
            <Grid item>
              {showInstructions ? HowToSelectPromptSection : null}
            </Grid>
            <Grid item xs={1} />
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.undoButton}
                onClick={this.undoAdd}
              >
                Undo
              </Button>
              <Button
                variant={this.state.arrowKeysSelect ? "contained" : "outlined"}
                color="primary"
                onClick={this.setModal("arrowKeysSelect")}
              >
                Arrow Keys Selection:{" "}
                {this.state.arrowKeysSelect ? "On" : "Off"}
              </Button>
            </Grid>
          </Grid>
          <PromptSelectComponent
            selectedIndex={this.state.currentDetailIndex}
            onTextClick={this.onTextClick}
            textPrompts={this.state.textPrompts}
          />
          {HowToSelectPromptBottomSection}
        </Fragment>
      );
    } else {
      return <LinearIndeterminate />;
    }
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
                    {this.renderEditorToolbar()}
                    <Editor
                      spellCheck
                      value={this.state.editorValue}
                      onChange={this.onTextChange}
                      autoFocus={true}
                      ref={this.ref}
                      onKeyDown={this.onKeyDown}
                      renderBlock={renderBlock}
                      renderMark={renderMark}
                    />
                  </Typography>
                </div>
                {this.renderWordCountAndPublishButton()}
                {this.renderTextPromptSelectionSection()}
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
