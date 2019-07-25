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
import MenuIcon from "@material-ui/icons/Menu";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link as MaterialLink } from "@material-ui/core";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import logo from "images/logo.svg";
import { Menu } from "components/Menu";
import { TopbarMenu } from "components/TopbarMenu";

const InlineTagline = ({ classes }) => {
  return (
    <div className={classes.inline}>
      <Typography variant="h6" color="inherit" noWrap>
        <Link to="/" className={classes.link}>
          <img width={20} src={logo} alt="writeup.ai logo" />
          <span className={classes.tagline}>writeup.ai</span>
        </Link>
      </Typography>
    </div>
  );
};

const TextTagline = ({ classes }) => {
  return (
    <div className={classes.productLogo}>
      <Typography className={classes.strikeInline}>right</Typography>
      <Typography className={classes.inlineBlockTagLine}>
        write, fast.
      </Typography>
    </div>
  );
};

class _TopbarComponent extends Component {
  state = {
    value: 0,
    menuDrawer: false
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  mobileMenuOpen = event => {
    this.setState({ menuDrawer: true });
  };

  mobileMenuClose = event => {
    this.setState({ menuDrawer: false });
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  current = () => {
    if (this.props.currentPath === "/home") {
      return 0;
    }
    if (this.props.currentPath === "/dashboard") {
      return 1;
    }
    if (this.props.currentPath === "/signup") {
      return 2;
    }
    if (this.props.currentPath === "/wizard") {
      return 3;
    }
    if (this.props.currentPath === "/cards") {
      return 4;
    }
  };

  renderMobileIconContainer = () => {
    const { classes } = this.props;

    return (
      <div className={classes.iconContainer}>
        <IconButton
          onClick={this.mobileMenuOpen}
          className={classes.iconButton}
          color="inherit"
          aria-label="Menu"
        >
          <MenuIcon />
        </IconButton>
      </div>
    );
  };

  renderLeftTabContainer = () => {
    const { classes } = this.props;

    return (
      <div className={classes.tabContainer}>
        <SwipeableDrawer
          anchor="right"
          open={this.state.menuDrawer}
          onClose={this.mobileMenuClose}
          onOpen={this.mobileMenuOpen}
        >
          <AppBar title="Menu" />
          <List>
            {Menu.map((item, index) => (
              <ListItem
                component={item.external ? MaterialLink : Link}
                href={item.external ? item.pathname : null}
                to={
                  item.external
                    ? null
                    : {
                        pathname: item.pathname,
                        search: this.props.location.search
                      }
                }
                button
                key={item.label}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </SwipeableDrawer>

        <Tabs
          value={this.current() || this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          {Menu.map((item, index) => (
            <Tab
              key={index}
              component={item.external ? MaterialLink : Link}
              href={item.external ? item.pathname : null}
              to={
                item.external
                  ? null
                  : {
                      pathname: item.pathname,
                      search: this.props.location.search
                    }
              }
              classes={{ root: classes.tabItem }}
              label={item.label}
            />
          ))}
        </Tabs>
      </div>
    );
  };

  renderRightContainer = () => {
    const { classes } = this.props;

    return (
      <div className={classes.tabContainerRight}>
        <Tabs
          value={this.current() || this.state.value}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
        >
          {TopbarMenu.map((item, index) => (
            <Tab
              key={index}
              component={item.external ? MaterialLink : Link}
              href={item.external ? item.pathname : null}
              to={
                item.external
                  ? null
                  : {
                      pathname: item.pathname,
                      search: this.props.location.search
                    }
              }
              classes={{ root: classes.tabItem }}
              label={item.label}
            />
          ))}
        </Tabs>
      </div>
    );
  };

  render() {
    const { classes } = this.props;

    return (
      <AppBar position="absolute" color="default" className={classes.appBar}>
        <Toolbar>
          <Grid container spacing={2} alignItems="baseline">
            <Grid item xs={10} className={classes.flex}>
              <InlineTagline classes={classes} />
              {!this.props.noTabs && (
                <React.Fragment>
                  <TextTagline classes={classes} />
                  {this.renderMobileIconContainer()}
                  {this.renderLeftTabContainer()}
                </React.Fragment>
              )}
            </Grid>
            <Grid item xs={2} className={classes.flex}>
              {this.renderRightContainer()}
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );
  }
}

export const TopbarComponent = withRouter(
  withStyles(TopbarStyles)(_TopbarComponent)
);
