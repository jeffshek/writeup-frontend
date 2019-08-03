import React from "react";
import { HashRouter, BrowserRouter, Route } from "react-router-dom";
import { MainComponent } from "components/MainComponent/Main";
import { ShareComponent } from "components/ShareComponent/Share";

export default props => (
  <BrowserRouter>
    <Route exact path="/" component={MainComponent} />
    <Route exact path="/shared/prompts/:uuid/" component={ShareComponent} />
  </BrowserRouter>
);
