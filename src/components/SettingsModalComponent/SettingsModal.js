import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

import Button from "@material-ui/core/Button";
import { DividerSection } from "components/Common/Dividers";
import { getModalStyle, useModalStyles } from "components/Common/ModalStyling";

export const SettingsModal = ({
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
        <Typography id="discrete-slider" variant={"h6"}>
          Creativity | {settings.temperature}
        </Typography>

        <Slider
          defaultValue={settings.temperature}
          aria-labelledby="discrete-slider"
          step={0.1}
          marks
          min={0.1}
          max={1}
          onChange={handleSettingsChange("temperature")}
          valueLabelDisplay="auto"
        />
        <Typography variant={"body2"}>
          Higher creativity (aka, temperatures) result in more creative
          suggestions. Max 1.0
        </Typography>
        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Generated Sentence Length | {settings.length}
        </Typography>
        <Slider
          defaultValue={settings.length}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={50}
          valueLabelDisplay="auto"
          onChange={handleSettingsChange("length")}
        />

        <Typography variant={"body2"}>
          Amount of words per each suggestion. More words generate slower. Max
          50. Temporarily limited during Product Launch. Can generate up to 1024
          words.
        </Typography>

        {DividerSection}
        <Typography id="discrete-slider" variant={"h6"} gutterBottom>
          Suggestion Quantity | {settings.batch_size}
        </Typography>

        <Slider
          defaultValue={settings.batch_size}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={10}
          valueLabelDisplay="auto"
          onChange={handleSettingsChange("batch_size")}
        />
        <Typography variant={"body2"}>
          # of Simultaneously Different Suggestions. Max 10.
        </Typography>

        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Prompt Diversity | {settings.top_k}
        </Typography>

        <Slider
          defaultValue={settings.top_k}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={40}
          valueLabelDisplay="auto"
          onChange={handleSettingsChange("top_k")}
        />
        <Typography variant={"body2"}>
          Also known as Top K, a higher value results in different similar
          suggestions amongst prompts. Max 40.
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          className={classes.button}
          onClick={applySettings}
        >
          Apply Settings
        </Button>
      </div>
    </Modal>
  );
};
