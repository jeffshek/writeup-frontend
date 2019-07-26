import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import {
  lorem_twenty_words,
  lorem_twenty_words_alternative
} from "utilities/lorem";
import Typography from "@material-ui/core/Typography/Typography";

const styles = theme => ({
  table: {
    minWidth: 700
  }
});

class _ListComponent extends React.Component {
  render() {
    return <div>Hello</div>;
  }
}

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

export const PromptSelectComponent = function SimpleList() {
  const classes = useStyles();

  const promptOne = `${lorem_twenty_words}`;
  const promptTwo = `${lorem_twenty_words_alternative}`;
  const promptThree = `${lorem_twenty_words}`;
  const promptFour = `${lorem_twenty_words_alternative}`;

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={promptOne} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={promptTwo} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={promptThree} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={promptFour} />
        </ListItem>
      </List>
    </div>
  );
};
