import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { DividerSection } from "components/Common/Dividers";
import { getModalStyle, useModalStyles } from "components/Common/Modals";

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
          Show your composition to the world.
        </Typography>
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
