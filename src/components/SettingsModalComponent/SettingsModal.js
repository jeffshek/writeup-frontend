import React, { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { AppContext } from "components/context";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import Divider from "@material-ui/core/Divider/Divider";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles(theme => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 4),
    outline: "none"
  }
}));

const DividerSection = (
  <Fragment>
    <br />
    <Divider />
    <br />
  </Fragment>
);

export const SettingsModal = ({ modalOpen, setModal }) => {
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const appContext = React.useContext(AppContext);

  const handleSettingsChange = setting => (event, value) => {
    appContext.handleContextChange(setting)(value);
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
          Temperature | {appContext.temperature}
        </Typography>

        <Slider
          defaultValue={appContext.temperature}
          aria-labelledby="discrete-slider"
          step={0.1}
          marks
          min={0.1}
          max={1}
          onChange={handleSettingsChange("temperature")}
          valueLabelDisplay="auto"
        />
        <Typography variant={"body2"}>
          Higher temperatures result in more creative suggestions. Max 1.0
        </Typography>
        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Generated Word Length | {appContext.length}
        </Typography>
        <Slider
          defaultValue={appContext.length}
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
          Suggestion Quantity | {appContext.batch_size}
        </Typography>

        <Slider
          defaultValue={appContext.batch_size}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={10}
          valueLabelDisplay="auto"
          onChange={handleSettingsChange("batch_size")}
        />
        <Typography variant={"body2"}>
          # of Simultaneously Different Suggestions. More suggestions generate
          slower. Max 10.
        </Typography>

        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Frequency | {appContext.top_k}
        </Typography>

        <Slider
          defaultValue={appContext.top_k}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={40}
          valueLabelDisplay="auto"
          onChange={handleSettingsChange("top_k")}
        />
        <Typography variant={"body2"}>
          Also known as Top K, a higher value results in more similar
          suggestions. Max 40.
        </Typography>
      </div>
    </Modal>
  );
};
