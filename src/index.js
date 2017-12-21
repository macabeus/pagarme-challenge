import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import './index.css';
import App from './components/App/App';
import NotFound from './components/NotFound/index';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={App}/>
      <Route path='*' component={NotFound}/>
    </Switch>
  </BrowserRouter>, document.getElementById('root')
);
