import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { DividerSection } from "components/Common/Dividers";
import { getModalStyle, useModalStyles } from "components/Common/Modals";
import TextField from "@material-ui/core/TextField/TextField";

export const TutorialModal = ({
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
        <Typography variant={"h4"} align={"center"} gutterBottom>
          Tutorial
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={applySettings}
        >
          Close Me!
        </Button>
      </div>
    </Modal>
  );
};
