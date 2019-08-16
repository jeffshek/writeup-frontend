import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
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
        {/*<Typography variant={"h4"} align={"center"} gutterBottom={true}>*/}
        {/*Login Using*/}
        {/*</Typography>*/}
        <br />
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={1}
        >
          <Grid item>
            <Button
              variant="outlined"
              onClick={applySettings}
              className={classes.facebookAuthButton}
            >
              <Typography className={classes.loginText} variant={"body1"}>
                Login With Facebook
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            {/*Seriously reflecting on the usefulness of this OCD */}
            <Button
              variant="outlined"
              color="primary"
              onClick={applySettings}
              className={classes.googleAuthButton}
            >
              <Typography display="inline">Login With </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoG}
                variant={"subtitle2"}
              >
                G
              </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoO1}
                variant={"subtitle2"}
              >
                o
              </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoO2}
                variant={"subtitle2"}
              >
                o
              </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoGO2}
                variant={"subtitle2"}
              >
                g
              </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoL}
                variant={"subtitle2"}
              >
                l
              </Typography>
              <Typography
                display="inline"
                className={classes.googleTextLogoO2}
                variant={"subtitle2"}
              >
                e
              </Typography>
            </Button>
          </Grid>
          <Grid item xs={12} />
        </Grid>
        <br />
        <Typography variant={"h5"} align={"center"} gutterBottom={true}>
          or ...
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
