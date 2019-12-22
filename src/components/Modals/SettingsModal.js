import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

import Button from "@material-ui/core/Button";
import { getModalStyle, useModalStyles } from "./ModalStyling";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import {
  GPT2_LARGE_MODEL_NAME,
  GPT2_MEDIUM_COMPANIES_MODEL_NAME,
  GPT2_MEDIUM_HP_MODEL_NAME,
  GPT2_MEDIUM_LEGAL_MODEL_NAME,
  GPT2_MEDIUM_RESEARCH_MODEL_NAME
} from "components/MainComponent/constants";
import Grid from "@material-ui/core/Grid";

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

  const onSelectChange = event => {
    const value = event.target.value;
    setSettings("model_name")(value);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={modalOpen}
      onClose={setModal}
    >
      <div style={modalStyle} className={classes.paper}>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="flex-start"
          spacing={3}
        >
          <Grid item xs={6}>
            <Typography id="discrete-slider" variant={"h6"}>
              Sentence Length | {settings.length}
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
              Amount of words per each suggestion. More words generate slower.
              Max 50. Temporarily limited during Product Launch. Can generate up
              to 1024 words.
            </Typography>
          </Grid>
          <Grid item xs={6}>
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
          </Grid>

          <Grid item xs={12}>
            <Typography id="discrete-slider" variant={"h6"}>
              Quantity | {settings.batch_size}
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
              # of Different Suggestions. Max 10.
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography id="discrete-slider" variant={"h6"}>
              Prompt Diversity | {settings.top_k}
            </Typography>

            <Slider
              defaultValue={settings.top_k}
              aria-labelledby="discrete-slider"
              step={1}
              marks
              min={0}
              max={40}
              valueLabelDisplay="auto"
              onChange={handleSettingsChange("top_k")}
            />
            <Typography variant={"body2"} gutterBottom>
              Also known as Top K, a low value will limit to the most
              probabilistic ranked result. Use higher values for more diverse
              suggestions. 0 turns off Top K filtering.
            </Typography>
          </Grid>

          <Grid item xs={6}>
            <Typography id="discrete-slider" variant={"h6"}>
              Top P Filtering | {settings.top_p}
            </Typography>

            <Slider
              defaultValue={settings.top_p}
              aria-labelledby="discrete-slider"
              step={0.1}
              marks
              min={0}
              max={1}
              valueLabelDisplay="auto"
              onChange={handleSettingsChange("top_p")}
            />
            <Typography variant={"body2"} gutterBottom>
              Filters via Nucleus Clustering. 0 turns off. Can be combined with
              Top K or turned one/other off. If both Top K and Top P are greater
              than 0, the results are an independent intersection and NOT
              consequential.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant={"h6"}>
              <b>Machine Learning Algorithm</b>
            </Typography>
            <FormControl className={classes.algorithmSelectForm}>
              <Select
                value={settings.model_name}
                inputProps={{
                  name: "publishOptions",
                  id: "publish-options"
                }}
                onChange={onSelectChange}
              >
                {/*<MenuItem value={GPT2_MEDIUM_LEGAL_MODEL_NAME}>*/}
                {/*  GPT2 (Law/Legal Writing Style)*/}
                {/*</MenuItem>*/}
                <MenuItem value={GPT2_LARGE_MODEL_NAME}>GPT2 (Large)</MenuItem>
                <MenuItem value={GPT2_MEDIUM_RESEARCH_MODEL_NAME}>
                  Research
                </MenuItem>
                <MenuItem value={GPT2_MEDIUM_HP_MODEL_NAME}>
                  Harry Potter
                </MenuItem>
                <MenuItem value={GPT2_MEDIUM_COMPANIES_MODEL_NAME}>
                  Company/Product Vision
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid
            container
            direction="row"
            justify="flex-end"
            alignItems="flex-end"
            spacing={3}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={applySettings}
            >
              Apply Settings
            </Button>
          </Grid>
          <br />
        </Grid>
      </div>
    </Modal>
  );
};
