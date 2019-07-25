import React, { Fragment } from "react";
import { MainStyles } from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";
import { TopbarComponent } from "components/TopbarComponent/Topbar";

export class _MainComponent extends React.Component {
  render() {
    const { classes } = this.props;

    return (
      <Fragment>
        <TopbarComponent />
        <div className={classes.root}>
          <Grid container justify="center">
            <Grid
              spacing={4}
              alignItems="center"
              justify="center"
              container
              className={classes.grid}
            >
              <Grid container item xs={12}>
                <Grid item xs={12}>
                  <Paper className={classes.paper}>
                    <div>
                      <div className={classes.box}>
                        <Typography
                          color="secondary"
                          gutterBottom
                          variant={"h6"}
                        >
                          Writing Prompt ...
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          color={"textPrimary"}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer eu sem vel nisi scelerisque finibus
                          vitae a nibh. Maecenas sed sem felis. Fusce feugiat,
                          mauris nec tempus varius, nisl diam porttitor turpis,
                          non pretium ipsum leo id urna. Pellentesque mattis
                          lectus ornare justo hendrerit, sit amet blandit odio
                          semper. Suspendisse ut dapibus sapien. Phasellus
                          mollis at metus eget imperdiet. Proin lobortis, neque
                          ac mattis hendrerit, dolor justo elementum lectus, eu
                          molestie risus lorem vel felis. Proin a lacinia quam.
                          Praesent laoreet tristique turpis, vel lobortis lectus
                          tempus quis. Etiam efficitur, velit ac bibendum
                          rutrum, lacus odio mollis erat, in sollicitudin massa
                          lorem sed lorem. In bibendum diam nec ligula
                          consectetur iaculis. Nunc posuere mollis risus, id
                          efficitur neque feugiat in. Proin eu augue in turpis
                          convallis cursus.
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          gutterBottom
                          color={"textPrimary"}
                        >
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Integer eu sem vel nisi scelerisque finibus
                          vitae a nibh. Maecenas sed sem felis. Fusce feugiat,
                          mauris nec tempus varius, nisl diam porttitor turpis,
                          non pretium ipsum leo id urna. Pellentesque mattis
                          lectus ornare justo hendrerit, sit amet blandit odio
                          semper. Suspendisse ut dapibus sapien. Phasellus
                          mollis at metus eget imperdiet. Proin lobortis, neque
                          ac mattis hendrerit, dolor justo elementum lectus, eu
                          molestie risus lorem vel felis. Proin a lacinia quam.
                          Praesent laoreet tristique turpis, vel lobortis lectus
                          tempus quis. Etiam efficitur, velit ac bibendum
                          rutrum, lacus odio mollis erat, in sollicitudin massa
                          lorem sed lorem. In bibendum diam nec ligula
                          consectetur iaculis. Nunc posuere mollis risus, id
                          efficitur neque feugiat in. Proin eu augue in turpis
                          convallis cursus.
                        </Typography>
                      </div>
                      <div className={classes.alignRight}>
                        <Button
                          color="primary"
                          variant="contained"
                          className={classes.actionButtom}
                        >
                          Learn more
                        </Button>
                      </div>
                    </div>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
  }
}

export const MainComponent = withRouter(withStyles(MainStyles)(_MainComponent));
