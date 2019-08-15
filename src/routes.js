import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainComponent } from "components/MainComponent/Main";
import { PublishedPromptComponent } from "components/PublishedPrompt";
import { BestPromptsComponent } from "components/BestPrompts";

export default props => (
  <BrowserRouter>
    <Route exact path="/" component={MainComponent} />
    <Route exact path="/prompts/:uuid/" component={PublishedPromptComponent} />
    <Route exact path="/best/" component={BestPromptsComponent} />
  </BrowserRouter>
);
