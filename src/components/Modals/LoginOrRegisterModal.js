import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import { getModalStyle, useModalStyles } from "./ModalStyling";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { loginAPI, registerAPI } from "services/auth";

export const LoginOrRegisterModal = ({
  modalOpen,
  setModal,
  settings,
  setSettings,
  applySettings
}) => {
  const classes = useModalStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [state, setState] = React.useState({
    usernameOrEmail: "",
    password: ""
  });

  //const handleSettingsChange = setting => (event, value) => {
  //  setSettings(setting)(value);
  //};

  const register = () => {
    const postDetails = {
      usernameOrEmail: state.usernameOrEmail,
      password: state.password
    };
    registerAPI(postDetails).then(response => {
      if (response.status === 201) {
        setSettings("loginOrRegisterModal")(false);
      }
    });
  };

  const login = () => {
    const loginDetails = {
      username: state.usernameOrEmail,
      password: state.password
    };
    loginAPI(loginDetails).then(response => {
      if (response.status === 200) {
        setSettings("loginOrRegisterModal")(false);
      }
    });
  };

  const renderSocialAuth = () => {
    return (
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={1}
        style={{ marginTop: "2rem" }}
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
        <Typography variant={"h5"} align={"center"} gutterBottom={true}>
          or ...
        </Typography>
      </Grid>
    );
  };

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.value });
  };

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={modalOpen}
      onClose={setModal}
    >
      <div style={modalStyle} className={classes.paper}>
        {/*{renderSocialAuth()}*/}
        <br />
        <TextField
          id="standard-full-width"
          label="Username or Email"
          style={{ margin: 8 }}
          placeholder={state.usernameOrEmail}
          onChange={handleChange("usernameOrEmail")}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="standard-full-width"
          label="Password"
          style={{ margin: 8, marginBottom: "2rem" }}
          placeholder={state.password}
          fullWidth
          type={"password"}
          onChange={handleChange("password")}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Button variant="outlined" color="primary" onClick={register}>
              Register
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={login}>
              Login
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};
