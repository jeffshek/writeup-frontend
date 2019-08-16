import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";

import Button from "@material-ui/core/Button";
import { DividerSection } from "../Layouts";
import { getModalStyle, useModalStyles } from "./ModalStyling";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

export const LoginOrRegisterModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings
}) => {
  const classes = useModalStyles();

  const [modalStyle] = React.useState(getModalStyle);

  const [state, setState] = React.useState({ login: true });

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
        <Typography variant={"h4"} align={"center"}>
          Login
        </Typography>
        <TextField
          id="standard-full-width"
          label="Username or Email"
          style={{ margin: 8 }}
          placeholder=""
          //helperText="Full width!"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="standard-full-width"
          label="Password"
          style={{ margin: 8 }}
          placeholder=""
          //helperText="Full width!"
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <br />
        <br />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Button variant="outlined" color="primary" onClick={applySettings}>
              Register
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              //className={classes.button}
              onClick={applySettings}
            >
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};
