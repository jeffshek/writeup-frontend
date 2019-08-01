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

export const SettingsModal = () => {
  // A bastardization of the elegant version from
  // https://material-ui.com/components/modal/
  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(true);

  const value = React.useContext(AppContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={open}
      onClose={handleClose}
    >
      <div style={modalStyle} className={classes.paper}>
        <Typography id="discrete-slider" variant={"h6"}>
          Temperature | {value.temperature}
        </Typography>

        <Slider
          defaultValue={0.5}
          aria-labelledby="discrete-slider"
          step={0.1}
          marks
          min={0.1}
          max={1}
          valueLabelDisplay="auto"
        />
        <Typography variant={"body2"}>
          Higher temperatures result in more creative suggestions. Max 1.0
        </Typography>
        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Generated Word Length | {value.length}
        </Typography>
        <Slider
          defaultValue={20}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={40}
          valueLabelDisplay="auto"
        />

        <Typography variant={"body2"}>
          Amount of words per each suggestion. More words generate slower. Max
          40.
        </Typography>

        {DividerSection}
        <Typography id="discrete-slider" variant={"h6"} gutterBottom>
          Suggestion Quantity | {value.batch_size}
        </Typography>

        <Slider
          defaultValue={5}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={10}
          valueLabelDisplay="auto"
        />
        <Typography variant={"body2"}>
          # of Simultaneously Different Suggestions. More suggestions generate
          slower. Max 10.
        </Typography>

        {DividerSection}

        <Typography id="discrete-slider" variant={"h6"}>
          Frequency | {value.top_k}
        </Typography>

        <Slider
          defaultValue={10}
          aria-labelledby="discrete-slider"
          step={1}
          marks
          min={1}
          max={40}
          valueLabelDisplay="auto"
        />
        <Typography variant={"body2"}>
          Also known as Top K, a higher value results in more similar
          suggestions. Max 40.
        </Typography>
      </div>
    </Modal>
  );
};
