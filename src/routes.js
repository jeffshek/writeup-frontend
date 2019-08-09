import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainComponent } from "components/MainComponent/Main";
import { PublishedPromptComponent } from "components/PublishedPrompt";

export default props => (
  <BrowserRouter>
    <Route exact path="/" component={MainComponent} />
    <Route exact path="/prompts/:uuid/" component={PublishedPromptComponent} />
  </BrowserRouter>
);
