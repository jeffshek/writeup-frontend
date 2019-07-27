export const serializeAPIMessageToPrompts = ({ message }) => {
  // wonder if there's an easier way to go through a dict ...
  const messageKeys = Object.keys(message);
  const textPromptKeys = messageKeys.filter(key => {
    return key.includes("text_");
  });

  const textPrompts = [];
  textPromptKeys.forEach(key => {
    const textPrompt = message[key];

    // it works better with a space
    const textPromptWithSpace = textPrompt + " ";
    textPrompts.push(textPromptWithSpace);
  });

  return textPrompts;
};
