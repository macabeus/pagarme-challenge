import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import 'react-notifications/lib/notifications.css';

import IndexMessage from './components/IndexMessage/IndexMessage';
import NotFound from './components/NotFound/index';
import RoomPanels from './components/Room/RoomPanels';


ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path='/' component={IndexMessage}/>
      <Route exact path='/room/:roomname/user/:username' component={RoomPanels}/>
      <Route path='*' component={NotFound}/>
    </Switch>
  </BrowserRouter>, document.getElementById('root')
);
