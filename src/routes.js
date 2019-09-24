import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainComponent } from "components/MainComponent/Main";
import { PublishedPromptComponent } from "components/PublishedPrompt";
import { BestPromptsComponent } from "components/BestPrompts";
import { PrivacyPolicyComponent } from "components/PrivacyPolicy";

export default props => (
  <BrowserRouter>
    <Route exact path="/" component={MainComponent} />
    <Route exact path="/legal" component={MainComponent} />
    <Route exact path="/hp" component={MainComponent} />
    <Route exact path="/got" component={MainComponent} />
    <Route exact path="/lyrics" component={MainComponent} />
    <Route exact path="/companies" component={MainComponent} />
    <Route exact path="/research" component={MainComponent} />
    <Route exact path="/prompts/:uuid/" component={PublishedPromptComponent} />
    <Route exact path="/best/" component={BestPromptsComponent} />
    <Route exact path="/policy/" component={PrivacyPolicyComponent} />
  </BrowserRouter>
);
