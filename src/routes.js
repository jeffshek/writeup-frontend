import React from 'react'
import {HashRouter, Route} from 'react-router-dom'
import {MainComponent} from "components/Main";


export default props => (
  <HashRouter>
    <Route exact path='/' component={ MainComponent } />
  </HashRouter>
)