import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import {
  lorem_twenty_words,
  lorem_twenty_words_alternative
} from "utilities/lorem";
import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

const StyledListItem = withStyles(theme => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white
      }
    }
  }
}))(ListItem);

export const PromptSelectComponent = function SimpleList() {
  const classes = useStyles();

  const promptOne = `${lorem_twenty_words}`;
  const promptTwo = `${lorem_twenty_words_alternative}`;
  const promptThree = `${lorem_twenty_words}`;
  const promptFour = `${lorem_twenty_words_alternative}`;

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="main mailbox folders">
        <StyledListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={promptOne} />
        </StyledListItem>
        <StyledListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={promptTwo} />
        </StyledListItem>
        <StyledListItem button>
          <ListItemIcon>
            <InboxIcon />
          </ListItemIcon>
          <ListItemText primary={promptThree} />
        </StyledListItem>
        <StyledListItem button>
          <ListItemIcon>
            <DraftsIcon />
          </ListItemIcon>
          <ListItemText primary={promptFour} />
        </StyledListItem>
      </List>
    </div>
  );
};
