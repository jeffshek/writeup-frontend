import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import AddIcon from "@material-ui/icons/AddCircle";

import withStyles from "@material-ui/core/styles/withStyles";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
}));

const StyledListItem = withStyles(theme => ({
  root: {
    padding: "0.25rem",
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
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary={prompt} />
    </StyledListItem>
  );
};

export const PromptSelectComponent = function SimpleList({
  onClick,
  onTextClick,
  selectedIndex,
  textPrompts
}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="prompt-selection-list">
        {textPrompts.map((prompt, index) => {
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
