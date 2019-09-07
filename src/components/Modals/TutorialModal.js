import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { getModalStyle, useWideModalStyles } from "./ModalStyling";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";

import tutorial_demo from "../../images/tutorial_demo_3.gif";

export const TutorialModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings
}) => {
  const classes = useWideModalStyles();
  const [modalStyle] = React.useState(getModalStyle);

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
          <span role="img" aria-label="notebook">
            📃
          </span>{" "}
          the boring tutorial ...
        </Typography>
        <Carousel>
          <div>
            <img
              src={tutorial_demo}
              alt={"tutorial of features"}
              className={classes.tutorialImage}
            />
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
