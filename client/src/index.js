import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'react-notifications/lib/notifications.css';

import Index from './components/Index/index';
import NotFound from './components/NotFound/index';
import TyperacerTextField from './components/Room/TyperacerTextField';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={Index}/>
      <Route exact path='/room/:roomname/user/:username' component={TyperacerTextField}/>
      <Route path='*' component={NotFound}/>
    </Switch>
  </BrowserRouter>, document.getElementById('root')
);
