import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { MainComponent } from "components/MainComponent/Main";
import { ShareComponent } from "components/SharePromptComponent/Share";

export default props => (
  <BrowserRouter>
    <Route exact path="/" component={MainComponent} />
    <Route exact path="/shared/prompts/:uuid/" component={ShareComponent} />
  </BrowserRouter>
);
