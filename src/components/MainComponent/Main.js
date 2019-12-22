import React, { Fragment } from "react";
import { MainStyles } from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import { TopbarComponent } from "components/TopbarComponent/Topbar";
import { PromptSelectComponent } from "components/PromptSelectComponent";
import { ReactWebSocket } from "components/ReactWebSocket";
import { serializeAPIMessageToPrompts } from "utilities/apiSerializers";
import {
  getInitialValue,
  GridLayout,
  HowToSelectPromptBottomSection,
  HowToSelectPromptSection,
  MainFooter,
  WritingHeader,
  WritingHeaderSimple
} from "components/MainComponent/Layouts";

import moment from "moment";
import { LinearIndeterminate } from "components/Loading";
import { SettingsModal } from "components/Modals/SettingsModal";
import {
  COMPANY_PROMPTS_TO_USE,
  GPT2_LARGE_MODEL_NAME,
  GPT2_MEDIUM_COMPANIES_MODEL_NAME,
  GPT2_MEDIUM_HP_MODEL_NAME,
  GPT2_MEDIUM_LEGAL_MODEL_NAME,
  GPT2_MEDIUM_RESEARCH_MODEL_NAME,
  HP_PROMPTS_TO_USE,
  LEGAL_PROMPTS_TO_USE,
  PROMPTS_TO_USE,
  RESEARCH_PROMPTS_TO_USE,
  SPECIAL_CHARACTERS,
  WebSocketURL
} from "components/MainComponent/constants";
import Button from "@material-ui/core/Button/Button";
import Grid from "@material-ui/core/Grid/Grid";
import { PublishModal } from "components/Modals/PublishModal";
import { TutorialModal } from "components/Modals/TutorialModal";
import { Helmet } from "react-helmet";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import TrashIcon from "@material-ui/icons/Delete";
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
  Toolbar
} from "components/SlateJS";

import { BrowserView, isBrowser, isMobile } from "react-device-detect";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import { MainEditor } from "components/MainComponent/MainEditor";

const DEFAULT_NODE = "paragraph";

const MobileDisclaimer = ({ wordCount }) => {
  return (
    <Fragment>
      {wordCount > 20 ? "" : "As you type, prompts generate. "}
      Not designed for mobile. For an improved and faster experience, please try
      with a laptop.
    </Fragment>
  );
};

// this file is a beast and should be refactored into 2-3 separate files, sorry
// state management is difficult to manage with writing apps

export class _MainComponent extends React.Component {
  constructor(props) {
    super(props);

    // add some quick links to make URLs a little bit more accessible
    // for external linking
    // ie. writeup.ai/legal will automatically use the legal text gen. models
    const pathname = props.location.pathname;

    let model_name = GPT2_LARGE_MODEL_NAME;
    let initValue = getInitialValue(PROMPTS_TO_USE);
    // 45 words felt like a good number, 17 just loads way faster
    // 25 to see how this works for the time being ..
    let length = 25;
    let batch_size = 7;

    if (pathname === "/legal") {
      model_name = GPT2_MEDIUM_LEGAL_MODEL_NAME;
      initValue = getInitialValue(LEGAL_PROMPTS_TO_USE);
    } else if (pathname === "/hp") {
      model_name = GPT2_MEDIUM_HP_MODEL_NAME;
      initValue = getInitialValue(HP_PROMPTS_TO_USE);
      length = 50;
    } else if (pathname === "/research") {
      model_name = GPT2_MEDIUM_RESEARCH_MODEL_NAME;
    } else if (pathname === "/companies") {
      model_name = GPT2_MEDIUM_COMPANIES_MODEL_NAME;
      initValue = getInitialValue(COMPANY_PROMPTS_TO_USE);
      // these are much smaller, so show more options
      batch_size = 10;
    }

    const textPrompts = [];

    // this is getting into spaghetti, but needed this for async
    this.undoAdd = this.undoAdd.bind(this);

    const showTutorial = process.env.REACT_APP_ENV !== "development";
    //const arrowKeysSelect = isMobile ? false : true;
    // this is good when everything works, but for a lot of text
    // like hp, it doesn't work great
    const arrowKeysSelect = false;

    this.state = {
      editorValue: initValue,
      currentDetailIndex: null,
      textPrompts: textPrompts,

      // with each spacebar key, unsent set to true
      unsent: false,

      // ux settings
      arrowKeysSelect: arrowKeysSelect,
      aiAssistEnabled: true,

      userLoggedIn: checkTokenKeyInLocalStorage(),

      // create a false lastSent to ensure first send is easy
      lastSent: moment().subtract(5, "seconds"),
      lastTextChange: moment(),

      // algo settings
      model_name: model_name,
      temperature: 0.5,
      // low top_k results in all the same prompts
      top_k: 30,

      // nucleus (or top-p) sampling
      // turn off until you can fix cuda issues
      top_p: 0,

      length: length,
      batch_size: batch_size, // having higher batch sizes doesn't slow it down much

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

    this.editor = React.createRef();
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
    this.editor.current.moveToEndOfDocument();

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

  onClickMark = (event, type) => {
    event.preventDefault();
    this.editor.current.toggleMark(type);
  };

  onClickBlock = (event, type) => {
    event.preventDefault();

    const { editor } = this.editor.current;
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
    // okay - i can't optimize it any further, sorry.
    const userHasStoppedTypingCutoff = moment().subtract(500, "milliseconds");
    const userHasStoppedTypingCheck =
      this.state.lastTextChange < userHasStoppedTypingCutoff;

    // if the user is still typing don't send a request yet
    if (!userHasStoppedTypingCheck) {
      return false;
    }

    const delayLimit = moment().subtract(3, "seconds");
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
      if (canSend && this.state.aiAssistEnabled) {
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
    // from previous phrases that no longer apply
    const properMessage =
      message.prompt.trim().slice(-10) === text.trim().slice(-10);
    if (!properMessage) {
      return;
    }

    this.setState({
      textPrompts: textPrompts
    });

    // safari has an issue with slatejs race condition where focus is called
    // before the message has been fully loaded as slatejs text state
    //if (isSafari) {
    //  this.setState(
    //    {
    //      textPrompts: textPrompts
    //    },
    //  );
    //}
    //else {
    //  this.setState(
    //    {
    //      textPrompts: textPrompts
    //    },
    //    this.focusTextInput
    //  );
    //}
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
    // but only get the last 500 characters, otherwise, we run out of
    // memory on gpu instances

    // feels a little unfair, make sure to include this asterik so people
    // don't get confused
    // 500 was fine for higher traffic, now that traffic is less, try it at 700
    const text = this.state.editorValue.document.text.slice(-700);

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
    // this is the worst function, i hate myself for supporting mobile
    const textChanged =
      value.document.text !== this.state.editorValue.document.text;
    // my brain hurts from debugging mobile, don't judge me for having to read easier
    const textDidntChange = !textChanged;

    if (textChanged) {
      const content = JSON.stringify(value.toJSON());
      localStorage.setItem("content", content);
    }

    // if statements are a super hack for mobile, it's hard for slate to detect mobile
    if (isBrowser) {
      if (textChanged) {
        this.setState({
          editorValue: value,
          unsent: true,
          lastTextChange: moment()
        });
      } else {
        this.setState({
          editorValue: value,
          unsent: false
        });
      }
    } else if (isMobile) {
      // making this work on mobile is very hard, slatejs and chrome mobile
      // conflict because of the virtual keyboards
      const positionNearEnd = this.checkEditorPositionNearEnd();

      if (textDidntChange) {
        // text doesn't change don't fire api
        this.setState({
          editorValue: value
        });
      } else if (positionNearEnd) {
        // because state detection doesn't work on chrome, when a user is typing
        // space there are two separate states that get updated, resulting in the user's spacebar
        // jumping back and forth
        this.setState(
          {
            editorValue: value,
            unsent: true,
            lastTextChange: moment()
          },
          this.editor.current.moveToEndOfDocument
        );
      } else {
        // if they are not near the end when hitting spacebar, it normally works ...
        // therefore give default
        this.setState({
          editorValue: value,
          unsent: true,
          lastTextChange: moment()
        });
      }
    }
  };

  checkEditorPositionNearEnd = () => {
    // an attempt to figure out in mobile phones if the user is tying space
    try {
      const currentOffset = this.editor.current.value.selection.focus.offset;
      const endTextLength = this.editor.current.value.endText.text.length;
      return currentOffset + 5 >= endTextLength;
    } catch {
      return false;
    }
  };

  checkEditorHasSelectedWords = () => {};

  checkEditorPositionAtEnd = () => {
    // pretty sure it shouldn't this hard to check positions, but i haven't
    // groked all of slatejs documentation because i'm focusing on optimizing
    // on the backend
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
    try {
      const currentOffset = this.editor.current.value.selection.focus.offset;
      const endTextLength = this.editor.current.value.endText.text.length;
      return currentOffset === endTextLength;
    } catch {
      return false;
    }
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

    if (canSend && this.state.aiAssistEnabled) {
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
      const editor = self.editor.current;

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

      // keep this here in case you occur some one-off serializations
      // you need to do ...
      const formattedText = text;

      if (lastCharacterIsSpace && firstCharacterOfTextIsSpecial) {
        editor.moveAnchorBackward(1).insertText(formattedText);
      } else if (firstCharacterOfTextIsSpace && lastCharacterIsSpace) {
        editor.moveAnchorBackward(1).insertText(formattedText);
      } else {
        editor.moveToEndOfDocument().insertText(formattedText);
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

    if (isBrowser) {
      this.focusTextInput();
    }
  };

  focusTextInput = () => {
    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    this.editor.current.focus();
  };

  startNewText = () => {
    const textLength = this.state.editorValue.document.text.length;
    this.editor.current.deleteBackward(textLength);

    let prompts = PROMPTS_TO_USE;
    if (this.state.model_name === GPT2_MEDIUM_LEGAL_MODEL_NAME) {
      prompts = LEGAL_PROMPTS_TO_USE;
    } else if (this.state.model_name === GPT2_MEDIUM_HP_MODEL_NAME) {
      prompts = HP_PROMPTS_TO_USE;
    } else if (this.state.model_name === GPT2_MEDIUM_RESEARCH_MODEL_NAME) {
      prompts = RESEARCH_PROMPTS_TO_USE;
    } else if (this.state.model_name === GPT2_MEDIUM_COMPANIES_MODEL_NAME) {
      prompts = COMPANY_PROMPTS_TO_USE;
    }

    const randomPrompt = getRandomItemFromArray(prompts);
    this.editor.current.insertText(randomPrompt);

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
    const isMobileUser = isMobile;
    const additionalDisclaimer = isMobileUser ? (
      <MobileDisclaimer wordCount={wordCount} />
    ) : (
      ""
    );

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-start"
      >
        <Grid item>
          <b>Word Count: {wordCount}.</b> If issues, try the spacebar key.{" "}
          {additionalDisclaimer}
        </Grid>
        <BrowserView>
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
        </BrowserView>
      </Grid>
    );
  };

  onSelectChange = event => {
    const value = event.target.value;
    this.setState({ model_name: value }, this.sendTextToWebSocket);
  };

  getWordCount = () => {
    const text = this.state.editorValue.document.text;
    return text.trim().split(" ").length;
  };

  clearText = () => {
    // do this because on mobile, selects dont always work
    const textLength = this.state.editorValue.document.text.length;
    this.editor.current.deleteBackward(textLength);
    this.editor.current.insertText("");
  };

  renderSelectModelContainer = () => {
    const { classes } = this.props;

    return (
      <span className={classes.copiedContainer}>
        <FormControl className={classes.algorithmSelectFormMain}>
          <Select
            value={this.state.model_name}
            inputProps={{
              name: "publishOptions",
              id: "publish-options"
            }}
            onChange={this.onSelectChange}
          >
            <MenuItem value={GPT2_LARGE_MODEL_NAME}>
              General (Advanced)
            </MenuItem>
            {/*<MenuItem value={GPT2_MEDIUM_LEGAL_MODEL_NAME}>Legal</MenuItem>*/}
            <MenuItem value={GPT2_MEDIUM_RESEARCH_MODEL_NAME}>
              Research
            </MenuItem>
            <MenuItem value={GPT2_MEDIUM_HP_MODEL_NAME}>Harry Potter</MenuItem>
            <MenuItem value={GPT2_MEDIUM_COMPANIES_MODEL_NAME}>
              Mission Statements
            </MenuItem>
          </Select>
          <FormHelperText>Writing Style</FormHelperText>
        </FormControl>
      </span>
    );
  };

  renderMobileHeaderAndTutorial = () => {
    const { classes } = this.props;

    if (!this.state.editorValue.document) {
      return;
    }

    const text = this.state.editorValue.document.text;

    const wordCount = this.getWordCount();
    const showInstructions = wordCount < 50 && !isMobile;

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          {showInstructions ? WritingHeader : WritingHeaderSimple}
        </Grid>
        <Grid item xs={6}>
          {this.renderSelectModelContainer()}
        </Grid>
        <Grid item xs={6}>
          <span className={classes.copiedContainer}>
            <Grid
              spacing={0}
              alignItems="center"
              justify="flex-end"
              container
              className={classes.grid}
            >
              <Button
                variant="outlined"
                color="secondary"
                className={classes.createRandomPromptButton}
                onClick={this.startNewText}
                size={"small"}
              >
                New
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                className={classes.createRandomPromptButton}
                onClick={this.clearText}
                size={"small"}
              >
                <TrashIcon />
              </Button>
              <CopyToClipboard text={text}>
                <Button
                  variant="outlined"
                  color="primary"
                  style={{ marginRight: "0.25rem" }}
                  size={"small"}
                  className={classes.createRandomPromptButton}
                >
                  <FileCopyIcon />
                </Button>
              </CopyToClipboard>
            </Grid>
          </span>
        </Grid>
      </Grid>
    );
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
    const showInstructions = wordCount < 50 && !isMobile;

    return (
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="flex-end"
      >
        <Grid item>
          {showInstructions ? WritingHeader : WritingHeaderSimple}
        </Grid>
        <Grid item>
          {this.renderSelectModelContainer()}
          <span className={classes.copiedContainer}>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.createRandomPromptButton}
              onClick={this.startNewText}
              size={"small"}
            >
              New
            </Button>
            <CopyToClipboard text={text}>
              <Button
                variant="outlined"
                color="primary"
                style={{ marginRight: "0.25rem" }}
                size={"small"}
                className={classes.createRandomPromptButton}
              >
                <FileCopyIcon />
              </Button>
            </CopyToClipboard>
          </span>
          <Fragment>
            <Button
              variant="outlined"
              color="secondary"
              className={classes.button}
              onClick={this.setModal("tutorialModalOpen")}
            >
              Tutorial
            </Button>
            <Button
              variant={aiButtonStyle}
              color="primary"
              className={classes.button}
              onClick={this.toggleaiAssistEnabled}
            >
              Assist: {aiLabel}
            </Button>
          </Fragment>
        </Grid>
      </Grid>
    );
  };

  undoEditorInsert = () => {
    let self = this;
    return new Promise(function(resolve, reject) {
      self.editor.current.undo();
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
          <BrowserView>
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
                  variant={
                    this.state.arrowKeysSelect ? "contained" : "outlined"
                  }
                  color="primary"
                  onClick={this.setModal("arrowKeysSelect")}
                >
                  Arrow Keys Selection:{" "}
                  {this.state.arrowKeysSelect ? "On" : "Off"}
                </Button>
              </Grid>
            </Grid>
          </BrowserView>
          <PromptSelectComponent
            selectedIndex={this.state.currentDetailIndex}
            onTextClick={this.onTextClick}
            textPrompts={this.state.textPrompts}
          />

          {isBrowser ? HowToSelectPromptBottomSection : null}
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

        <BrowserView>
          <TopbarComponent setModal={this.setModal("settingsModalOpen")} />
        </BrowserView>

        {this.renderModals()}
        <div className={classes.root} onKeyDown={this.onKeyPressed}>
          <GridLayout classes={classes}>
            <Paper className={classes.paper}>
              <div className={classes.box}>
                {isBrowser
                  ? this.renderHeaderAndTutorial()
                  : this.renderMobileHeaderAndTutorial()}

                <div className={classes.textBox}>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    color={"textPrimary"}
                  >
                    <BrowserView>{this.renderEditorToolbar()}</BrowserView>
                    {/*<Editor*/}
                    {/*spellCheck*/}
                    {/*value={this.state.editorValue}*/}
                    {/*onChange={this.onTextChange}*/}
                    {/*autoFocus={true}*/}
                    {/*ref={this.editor}*/}
                    {/*onKeyDown={this.onKeyDown}*/}
                    {/*renderBlock={renderBlock}*/}
                    {/*renderMark={renderMark}*/}
                    {/*/>*/}
                    <MainEditor
                      editorValue={this.state.editorValue}
                      onTextChange={this.onTextChange}
                      reference={this.editor}
                      onKeyDown={this.onKeyDown}
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
