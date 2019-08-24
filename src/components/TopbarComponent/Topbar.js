import React, { Component } from "react";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import { Link, withRouter } from "react-router-dom";
import { TopbarStyles } from "components/TopbarComponent/Topbar.styles";
import withStyles from "@material-ui/styles/withStyles";

import Toolbar from "@material-ui/core/Toolbar";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { Link as MaterialLink } from "@material-ui/core";
import logo from "images/logo.svg";

const LogoAndLinkSection = ({ classes }) => {
  return (
    <div className={classes.inline}>
      <Link to="/" className={classes.link}>
        <img
          width={40}
          src={logo}
          alt="writeup.ai logo"
          style={{ marginLeft: "auto", marginRight: "auto", display: "block" }}
        />
        <Typography>writeup.ai</Typography>
      </Link>
    </div>
  );
};

const TextTagline = ({ classes }) => {
  return (
    <div className={classes.textTagContainer}>
      <Typography className={classes.inlineBlockTagLine}>
        use machine learning to
      </Typography>
      <Typography className={classes.strikeInline}>right</Typography>
      <Typography className={classes.inlineBlockTagLine}>
        write, fast.
      </Typography>
    </div>
  );
};

class _TopbarComponent extends Component {
  state = {
    value: 1
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  routeToBestPrompts = () => {
    this.props.history.push("/best/");
  };

  renderRightContainer = () => {
    const { classes } = this.props;

    return (
      <Tabs
        value={this.state.value}
        indicatorColor="primary"
        textColor="primary"
        onChange={this.handleChange}
      >
        <Tab
          key={"bestPrompts"}
          component={MaterialLink}
          onClick={this.routeToBestPrompts}
          classes={{ root: classes.tabItem }}
          label={"Best Prompts"}
        />
        <Tab
          key={"customize"}
          component={MaterialLink}
          onClick={this.props.setModal}
          classes={{ root: classes.tabItem }}
          label={"Customize"}
        />
      </Tabs>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid
            container
            spacing={1}
            justify="space-between"
            alignItems="center"
          >
            <Grid item xs={4} className={classes.leftGridContainerItem}>
              <LogoAndLinkSection classes={classes} />
              <TextTagline classes={classes} />
            </Grid>
            <Grid item xs={5} className={classes.flex}>
              <Grid
                container
                justify="flex-end"
                alignItems="center"
                className={classes.rightGridContainer}
              >
                {this.renderRightContainer()}
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

_TopbarComponent.defaultProps = {};

export const TopbarComponent = withRouter(
  withStyles(TopbarStyles)(_TopbarComponent)
);
