import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ShareIcon from "@material-ui/icons/Share";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import moment from "moment";
import { DATE_FORMAT } from "utilities/date_and_time";
import { withRouter } from "react-router-dom";
import { checkTokenKeyInLocalStorage } from "services/storage";
import { upvotePrompt } from "services/resources";

const useStyles = makeStyles(theme => ({
  card: {
    margin: "0.5rem"
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500],
    cursor: "pointer"
  }
}));

const ShowFullPromptText = ({ text }) => {
  return <Typography>{text}</Typography>;
};

const _PrettyPromptCard = ({ prompt, history, setLoginOrRegisterModal }) => {
  const classes = useStyles();

  const [expanded, setExpanded] = React.useState(false);
  const [personalPromptScore, setPersonalPromptScore] = React.useState(0);
  const [promptScore, setPromptScore] = React.useState(prompt.score);

  const truncatedText = prompt.text.slice(0, 500);

  const created = moment(prompt.created);
  const createdSerialized = created.format(DATE_FORMAT);

  const promptURL = `/prompts/${prompt.uuid}`;

  function handleExpandClick() {
    setExpanded(!expanded);
  }

  const shareURLClick = () => {
    history.push(promptURL);
  };

  const favoriteAction = () => {
    const loggedIn = checkTokenKeyInLocalStorage();
    if (!loggedIn) {
      setLoginOrRegisterModal(true);
      return;
    }

    let personalScore = personalPromptScore + 1;
    if (personalScore > 3) {
      // don't allow more than 3, even if user gets past this
      // backend will validate much more harshly
      return;
    }

    const updatedPromptScore = promptScore + 1;
    setPromptScore(updatedPromptScore);

    setPersonalPromptScore(personalScore);
    const prompt_uuid = prompt.uuid;

    upvotePrompt({ prompt_uuid, value: personalScore }).then(response => {
      console.log(`Updated to ${personalScore}!`);
    });
  };

  return (
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar aria-label="recipe" className={classes.avatar}>
            {promptScore}
          </Avatar>
        }
        // TODO - Make ability to flag when someone decides to write mean stuff
        //action={
        //  <IconButton aria-label="settings">
        //    <MoreVertIcon />
        //  </IconButton>
        //}
        title={prompt.title}
        subheader={createdSerialized}
        onClick={shareURLClick}
      />
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {truncatedText} ...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={favoriteAction}>
          <FavoriteIcon />
          {personalPromptScore}
        </IconButton>
        <IconButton aria-label="share" onClick={shareURLClick}>
          <ShareIcon />
        </IconButton>
        <IconButton
          className={clsx(classes.expand, {
            [classes.expandOpen]: expanded
          })}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <ShowFullPromptText text={prompt.text} />
        </CardContent>
      </Collapse>
    </Card>
  );
};

export const PrettyPromptCard = withRouter(_PrettyPromptCard);
