import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  getModalStyle,
  useModalStyles,
  useTutorialModalStyles
} from "components/Common/ModalStyling";
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";

export const PublishModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings,
  publishDisabled
}) => {
  const classes = useTutorialModalStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const handleSettingsChange = setting => (event, value) => {
    setSettings(setting)(value);
  };

  const genericHelperTextLabel = "Shown next to article. Optional";

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
          Publish Changes
        </Typography>
        <Typography variant={"body1"}>
          Publish your composition to your friends (or the world).
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <Grid container direction="row" justify="center" alignItems="center">
            <Grid item xs={11}>
              <TextField
                id="outlined-full-width"
                label="Title"
                className={classes.textField}
                value={""}
                helperText="Shown at the beginning of your article."
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                id="outlined-full-width"
                label="Email"
                className={classes.textField}
                value={""}
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
                value={""}
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
                value={""}
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
                label="Instagram"
                className={classes.textField}
                value={""}
                helperText={genericHelperTextLabel}
                fullWidth
                margin="normal"
                variant="outlined"
              />
            </Grid>
          </Grid>
        </form>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={applySettings}
          disabled={publishDisabled}
        >
          Publish!
        </Button>
      </div>
    </Modal>
  );
};
