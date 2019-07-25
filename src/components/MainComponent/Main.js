import React from "react";
import {MainStyles} from "components/MainComponent/Main.styles";
import withStyles from "@material-ui/core/styles/withStyles";
import {withRouter} from "react-router-dom";
import Paper from "@material-ui/core/Paper/Paper";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";


export class _MainComponent extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container justify="center">
          <Grid spacing={4} alignItems="center" justify="center" container className={classes.grid}>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div className={classes.box}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    First title
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    A first title style <br/> with two lines
                  </Typography>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button color='primary' variant="contained" className={classes.actionButtom}>
                    Learn more
                  </Button>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div className={classes.box}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    Another box
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    A default box
                  </Typography>
                </div>
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <Button color='primary' variant="contained" className={classes.actionButtom}>
                    Learn more
                  </Button>
                </div>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className={classes.paper}>
                <div className={classes.box}>
                  <Typography style={{textTransform: 'uppercase'}} color='secondary' gutterBottom>
                    A box with a carousel
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    If you click in Getting Started, you will see a nice carousel
                  </Typography>
                </div>
                <div className={classes.alignRight}>
                  <Button onClick={this.openDialog}  variant="outlined" className={classes.actionButtom}>
                    Learn more
                  </Button>
                  <Button onClick={this.openGetStartedDialog} color='primary' variant="contained" className={classes.actionButtom}>
                    Dashboard
                  </Button>
                </div>
              </Paper>
            </Grid>
            <Grid container item xs={12}>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <div>
                    <div className={classes.box}>
                      <Typography color='secondary' gutterBottom>
                        Full box
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        This is an example of a full-width box
                      </Typography>
                    </div>
                    <div className={classes.alignRight}>
                      <Button color='primary' variant="contained" className={classes.actionButtom}>
                        Learn more
                      </Button>
                    </div>
                  </div>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>);
  }
}


export const MainComponent = withRouter(withStyles(MainStyles)(_MainComponent));

