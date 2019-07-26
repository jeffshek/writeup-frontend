import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/Inbox";
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

const ListItemPrompt = ({ prompt, index, selected, onClick }) => {
  return (
    <StyledListItem
      button
      selected={selected}
      autoFocus={selected}
      onClick={onClick}
    >
      <ListItemIcon>
        <InboxIcon />
      </ListItemIcon>
      <ListItemText primary={prompt} />
    </StyledListItem>
  );
};

export const PromptSelectComponent = function SimpleList({
  onClick,
  onTextClick,
  selectedIndex = 2
}) {
  const classes = useStyles();

  const promptOne = `${lorem_twenty_words}`;
  const promptTwo = `${lorem_twenty_words_alternative}`;
  const promptThree = `${lorem_twenty_words} 3`;
  const promptFour = `${lorem_twenty_words_alternative} 4`;

  const promptSelections = [promptOne, promptTwo, promptThree, promptFour];

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="prompt-selection-list">
        {promptSelections.map((prompt, index) => {
          const onClick = onTextClick(prompt);
          const itemIsSelected = selectedIndex === index;
          return (
            <ListItemPrompt
              key={index}
              prompt={prompt}
              selected={itemIsSelected}
              onClick={onClick}
            />
          );
        })}
      </List>
    </div>
  );
};
