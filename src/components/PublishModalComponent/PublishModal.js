import React, { Fragment } from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  getModalStyle,
  useWideModalStyles
} from "components/Common/ModalStyling";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { publishPrompt } from "services/resources";

import CircularProgress from "@material-ui/core/CircularProgress";

const PromptPublishedSuccess = ({ promptUUID, title }) => {
  if (!promptUUID) {
    return null;
  }

  const url = `https://writeup.ai/prompts/${promptUUID}`;

  return (
    <Fragment>
      <br />
      <Typography variant={"h4"} gutterBottom>
        Your Article Has Been Published!{" "}
        <span role="img" aria-label="party">
          🎉
        </span>
      </Typography>
      <br />
      <Typography variant={"h6"}>Title: {title}</Typography>
      <Typography variant={"h6"} style={{ display: "inline" }}>
        Link:{" "}
        <a href={"https:/www.google.com"} target={"_blank"}>
          {url}
        </a>
      </Typography>
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
  const { title, instagram, share_state, text } = settings;

  const handleTextChange = name => event => {
    const value = event.target.value;
    setSettings(name)(value);
  };

  const publishAction = () => {
    setSettings("publishDisabled")(true);
    //const { title, instagram, share_state, text } = settings;
    publishPrompt({ title, instagram, share_state, text }).then(response => {
      setState({ publishedUUID: response.uuid });
    });
  };

  const onSelectChange = event => {
    const value = event.target.value;
    setSettings("share_option")(value);
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
                helperText="Shown at the beginning of your article."
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
            <Grid item xs={5}>
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="age-simple">Share Status</InputLabel>
                <Select
                  value={settings.share_option}
                  inputProps={{
                    name: "publishOptions",
                    //id:   "age-simple", iuno what this really does
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
                  Writing
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={6} />
          </Grid>
        </form>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
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
              disabled={publishDisabled}
            >
              Publish!
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};
