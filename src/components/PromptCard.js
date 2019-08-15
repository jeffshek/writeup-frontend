import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  card: {
    margin: "0.5rem"
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 14
  },
  pos: {
    marginBottom: 12
  }
});

export const PromptCard = ({ prompt }) => {
  const classes = useStyles();

  const truncatedText = prompt.text.slice(0, 500);

  return (
    <Card className={classes.card}>
      <CardContent>
        {/*https://material-ui.com/components/cards/*/}
        <Typography variant="h5" component="h2">
          {prompt.title}
        </Typography>
        <Typography className={classes.pos} color="textSecondary">
          {prompt.email}
        </Typography>
        <Typography variant="body2" component="p">
          {truncatedText}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Read More</Button>
      </CardActions>
    </Card>
  );
};
