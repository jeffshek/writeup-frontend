import React from "react";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

import Button from "@material-ui/core/Button";
import { getModalStyle, useModalStyles } from "./ModalStyling";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { loginAPI, registerAPI } from "services/auth";
import { getTokenLocalStorage } from "services/storage";

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
    password: "",
    registerUsername: "",
    registerEmail: ""
  });
  const [isLogin, setIsLogin] = React.useState(true);

  const onRegisterClick = () => {
    setIsLogin(false);
  };

  const registerAction = () => {
    const postDetails = {
      username: state.registerUsername,
      password: state.password
    };

    if (state.registerEmail) {
      postDetails["email"] = state.registerEmail;
    }

    registerAPI(postDetails)
      .then(response => {
        if (response.status === 201) {
          const tokenKey = response.data.key;
          getTokenLocalStorage({ tokenKey });

          // trying to jam this modal to fit two areas of login
          // from the best and the main page
          if (setSettings) {
            setSettings("loginOrRegisterModal")(false);
            setSettings("userLoggedIn")(true);
          } else {
            // close the modal if it's regged
            setModal();
          }
        }
      })
      .catch(error => {
        console.log(error.response);
        if (error.response && error.response.data) {
          const errorMsg = JSON.stringify(error.response.data);
          alert(errorMsg);
        }
      });
  };

  const loginAction = () => {
    const loginDetails = {
      username: state.usernameOrEmail,
      password: state.password
    };
    loginAPI(loginDetails)
      .then(response => {
        if (response.status === 200) {
          const tokenKey = response.data.key;
          getTokenLocalStorage({ tokenKey });

          // trying to jam this modal to fit two uses
          // from the best and the main page
          if (setSettings) {
            setSettings("loginOrRegisterModal")(false);
            setSettings("userLoggedIn")(true);
          } else {
            setModal();
          }
        }
      })
      .catch(error => {
        if (error.response && error.response.data) {
          const errorMsg = JSON.stringify(error.response.data);
          alert(errorMsg);
        }
      });
  };

  const primaryAction = () => {
    if (isLogin) {
      loginAction();
    } else {
      registerAction();
    }
  };

  //eslint-disable-next-line
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

  const renderLoginForm = () => {
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="standard-full-width"
          label="Username or Email"
          style={{ margin: 8 }}
          value={state.usernameOrEmail}
          onChange={handleChange("usernameOrEmail")}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="standard-full-width-password"
          label="Password"
          style={{ margin: 8, marginBottom: "2rem" }}
          value={state.password}
          fullWidth
          type={"password"}
          onChange={handleChange("password")}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
      </form>
    );
  };

  const renderRegisterForm = () => {
    return (
      <form noValidate autoComplete="off">
        <TextField
          id="register-username"
          label="Registration Username!"
          style={{ margin: 8 }}
          value={state.registerUsername}
          onChange={handleChange("registerUsername")}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="standard-full-width-email"
          label="Email (Optional)"
          style={{ margin: 8 }}
          value={state.registerEmail}
          onChange={handleChange("registerEmail")}
          fullWidth
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
        <TextField
          id="standard-full-width-register-password"
          label="Password"
          style={{ margin: 8, marginBottom: "2rem" }}
          value={state.password}
          fullWidth
          type={"password"}
          onChange={handleChange("password")}
          margin="normal"
          InputLabelProps={{
            shrink: true
          }}
        />
      </form>
    );
  };

  let canLogin;
  if (isLogin) {
    canLogin = !!(state.password && state.usernameOrEmail);
  } else {
    canLogin = state.registerUsername && state.password;
  }

  return (
    <Modal
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      open={modalOpen}
      onClose={setModal}
    >
      <div style={modalStyle} className={classes.paper}>
        {/*{renderSocialAuth()}*/}
        <Typography
          variant="h4"
          gutterBottom
          color={"primary"}
          align={"center"}
        >
          {isLogin ? "Login" : "Register"}
        </Typography>
        {isLogin ? renderLoginForm() : renderRegisterForm()}
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            {isLogin ? (
              <Button
                variant="outlined"
                color="primary"
                onClick={onRegisterClick}
              >
                Register
              </Button>
            ) : null}
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="secondary"
              onClick={primaryAction}
              disabled={!canLogin}
            >
              {isLogin ? "Login" : "Register"}
            </Button>
          </Grid>
        </Grid>
      </div>
    </Modal>
  );
};
