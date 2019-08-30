import React, { Fragment } from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getModalStyle, useWideModalStyles } from "./ModalStyling";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { publishPrompt } from "../../services/resources";
import CircularProgress from "@material-ui/core/CircularProgress";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { DividerSection } from "../Layouts";
import { removeTokenKeyFromLocalStorage } from "services/storage";

const writeUpURL = process.env.REACT_APP_URL;

const InstagramComponent = ({ instagram }) => {
  if (!instagram) {
    return null;
  }

  const url = `https://www.instagram.com/${instagram}`;

  return (
    <Typography variant={"subtitle1"}>
      Instagram:{" "}
      <a href={url} target={"_blank"}>
        {instagram}
      </a>
    </Typography>
  );
};

const TwitterComponent = ({ twitter }) => {
  if (!twitter) {
    return null;
  }

  const url = `https://www.twitter.com/${twitter}`;

  return (
    <Typography variant={"subtitle1"}>
      Twitter:{" "}
      <a href={url} target={"_blank"}>
        {twitter}
      </a>
    </Typography>
  );
};

const EmailComponent = ({ email }) => {
  if (!email) {
    return null;
  }

  const url = `mailto:${email}`;

  return (
    <Typography variant={"subtitle1"}>
      Email:{" "}
      <a href={url} target={"_blank"}>
        {email}
      </a>
    </Typography>
  );
};

export const getSerializedWebsite = ({ website }) => {
  const urlPrefix = website.slice(0, 3);

  let urlSerialized = "";
  if (urlPrefix === "htt") {
    urlSerialized = website;
  } else {
    urlSerialized = `http://${website}`;
  }

  return urlSerialized;
};

const WebsiteComponent = ({ website }) => {
  if (!website) {
    return null;
  }

  const urlSerialized = getSerializedWebsite({ website });

  return (
    <Typography variant={"subtitle1"}>
      Website:{" "}
      <a href={urlSerialized} target={"_blank"} rel="noopener noreferrer">
        {website}
      </a>
    </Typography>
  );
};

const PromptPublishedSuccess = ({
  promptUUID,
  title,
  instagram,
  email,
  twitter,
  website
}) => {
  const [state, setState] = React.useState({
    copied: false
  });
  const classes = useWideModalStyles();

  if (!promptUUID) {
    return null;
  }

  const url = `${writeUpURL}/prompts/${promptUUID}/`;

  const buttonText = state.copied ? "Copied! " : "Copy Link to Clipboard ";

  return (
    <Fragment>
      <div style={{ textAlign: "center" }}>
        <Typography
          variant={"h4"}
          gutterBottom
          align={"center"}
          display={"inline"}
          style={{ textDecoration: "underline" }}
        >
          {title}
        </Typography>
        <Typography
          variant={"h5"}
          gutterBottom
          align={"center"}
          display={"inline"}
        >
          {" "}
          Is Published!{" "}
          <span role="img" aria-label="party">
            🎉
          </span>
        </Typography>
      </div>

      {DividerSection}

      <EmailComponent email={email} />
      <WebsiteComponent website={website} />
      <InstagramComponent instagram={instagram} />
      <TwitterComponent twitter={twitter} />
      <br />

      <Typography variant={"subtitle1"} style={{ display: "inline" }}>
        Shareable Link:{" "}
        <a href={url} target={"_blank"}>
          {url}
        </a>
      </Typography>
      <div className={classes.copiedContainer}>
        <CopyToClipboard text={url} onCopy={() => setState({ copied: true })}>
          <Button
            variant="outlined"
            color="secondary"
            style={{ marginTop: "1rem" }}
          >
            {buttonText}
            <FileCopyIcon />
          </Button>
        </CopyToClipboard>
      </div>
    </Fragment>
  );
};

export const PublishModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings,
  publishDisabled
}) => {
  const classes = useWideModalStyles();
  const [modalStyle] = React.useState(getModalStyle);
  const [state, setState] = React.useState({
    publishedUUID: ""
  });
  const { title, instagram, email, twitter, website, share_state } = settings;
  const text = settings.editorValue.document.text;
  const content = localStorage.getItem("content");

  const titleIsBlank = !title;
  const failPublishCheck = publishDisabled || titleIsBlank;

  const handleTextChange = name => event => {
    const value = event.target.value;
    setSettings(name)(value);
  };

  const loginAction = () => {
    setSettings("loginOrRegisterModal")(true);
    setSettings("publishModalOpen")(false);
  };

  const logoutAction = () => {
    removeTokenKeyFromLocalStorage();
    setSettings("userLoggedIn")(false);
  };

  const LoginButton = () => {
    return (
      <Button variant="outlined" color="secondary" onClick={loginAction}>
        Login
      </Button>
    );
  };

  const LogoutButton = () => {
    return (
      <Button variant="outlined" color="secondary" onClick={logoutAction}>
        Logout
      </Button>
    );
  };

  const publishAction = () => {
    setSettings("publishDisabled")(true);

    publishPrompt({
      title,
      content,
      instagram,
      email,
      twitter,
      website,
      share_state,
      text
    })
      .then(response => {
        if (response.uuid) {
          setState({ publishedUUID: response.uuid });
          setSettings("publishDisabled")(false);
        }
      })
      .catch(response => {
        console.log(response);
      });
  };

  const onSelectChange = event => {
    const value = event.target.value;
    setSettings("share_state")(value);
  };

  const genericHelperTextLabel = "Shown beside your article. Optional";

  if (state.publishedUUID) {
    return (
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={modalOpen}
        onClose={setModal}
      >
        <div style={modalStyle} className={classes.paper}>
          <PromptPublishedSuccess
            promptUUID={state.publishedUUID}
            title={title}
            instagram={instagram}
            twitter={twitter}
            website={website}
            email={email}
          />
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={modalOpen}
      onClose={setModal}
    >
      <div style={modalStyle} className={classes.paper}>
        <br />
        <Typography variant={"h4"} align={"center"} gutterBottom>
          Publish Changes{" "}
          <span role="img" aria-label="party">
            🎉
          </span>
        </Typography>
        <Typography variant={"h6"}>
          Publish your composition to your friends (or the world).
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={11}>
              <TextField
                id="outlined-full-width"
                label={"Title"}
                className={classes.textField}
                value={settings.title}
                onChange={handleTextChange("title")}
                helperText="Shown at the beginning of your article. Required"
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <Typography variant={"h6"}>
            Get Known For Your Writing (Optional)
          </Typography>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={5}>
              <TextField
                id="outlined-full-width"
                label="Email"
                className={classes.textField}
                value={settings.email}
                onChange={handleTextChange("email")}
                helperText={genericHelperTextLabel}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <TextField
                id="outlined-full-width"
                label="Your Website"
                className={classes.textField}
                value={settings.website}
                onChange={handleTextChange("website")}
                helperText={genericHelperTextLabel}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="outlined-full-width"
                label="Twitter"
                className={classes.textField}
                value={settings.twitter}
                helperText={genericHelperTextLabel}
                onChange={handleTextChange("twitter")}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={1} />
            <Grid item xs={5}>
              <TextField
                id="outlined-full-width"
                label="Instagram"
                className={classes.textField}
                value={settings.instagram}
                helperText={genericHelperTextLabel}
                onChange={handleTextChange("instagram")}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
          <br />
          <Typography variant={"h6"}>Sharing Options</Typography>
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={7}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Share Status</InputLabel>
                <Select
                  value={settings.share_state}
                  inputProps={{
                    name: "publishOptions",
                    id: "publish-options"
                  }}
                  onChange={onSelectChange}
                >
                  <MenuItem value={"published"}>Published</MenuItem>
                  <MenuItem value={"published_link_access_only"}>
                    Hidden - Accessible Only From Direct Link
                  </MenuItem>
                </Select>
                <FormHelperText>
                  "Published" Articles Will Let Others Find and Share Your
                  Writing. If you want to see what this looks like before, use
                  "Hidden" instead.
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4} />
          </Grid>
          <br />
        </form>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-end"
        >
          <Grid item xs={6}>
            {!settings.userLoggedIn ? <LoginButton /> : <LogoutButton />}
          </Grid>
          <Grid item xs={1}>
            {publishDisabled ? (
              <CircularProgress className={classes.circularProgress} />
            ) : null}
          </Grid>
          <Grid item xs={2}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.rightGridButton}
              onClick={publishAction}
              disabled={failPublishCheck}
            >
              Publish!
            </Button>
          </Grid>
        </Grid>
        {settings.userLoggedIn ? null : (
          <div className={classes.helperLoginText}>
            <Typography className={classes.helperLoginText}>
              * Login For Delete Ability. Optional
            </Typography>
          </div>
        )}
      </div>
    </Modal>
  );
};
