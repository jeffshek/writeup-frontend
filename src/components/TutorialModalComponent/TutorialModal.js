import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import {
  getModalStyle,
  useTutorialModalStyles
} from "components/Common/ModalStyling";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import tutorial_demo from "images/tutorial_demo_3.gif";

export const TutorialModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings
}) => {
  const classes = useTutorialModalStyles();

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
          the boring tutorial ...
        </Typography>
        <Carousel>
          <div>
            <img src={tutorial_demo} />
            {/*<p className="legend">Basic Explanation</p>*/}
          </div>
        </Carousel>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={setModal}
        >
          Close
        </Button>
      </div>
    </Modal>
  );
};
