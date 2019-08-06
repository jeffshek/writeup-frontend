import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getModalStyle, useModalStyles } from "components/Common/ModalStyling";
import TextField from "@material-ui/core/TextField/TextField";

export const PublishModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings
}) => {
  const classes = useModalStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const handleSettingsChange = setting => (event, value) => {
    setSettings(setting)(value);
  };

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
          Present your composition to the world.
        </Typography>
        <form className={classes.container} noValidate autoComplete="off">
          <TextField
            id="outlined-full-width"
            label="Title"
            className={classes.textField}
            value={""}
            //value={"Title"}
            helperText="Shown at the beginning of your article."
            //onChange={handleChange('name')}
            fullWidth
            margin="normal"
            variant="outlined"
          />
          <TextField
            id="outlined-full-width"
            label="Email"
            className={classes.textField}
            //value={values.name}
            value={""}
            helperText="If you want to show your email next to your article. Optional."
            //onChange={handleChange('name')}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </form>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={applySettings}
        >
          Publish!
        </Button>
      </div>
    </Modal>
  );
};
