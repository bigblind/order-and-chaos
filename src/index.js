import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router'
import "./firebaseApp";

import App from './App';
import Home from './Home';
import Game from './game/Game';

import "./index.css";

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
            <Route path="/games/:gameId" component={Game}/>
            <Redirect from="*" to="/" />
        </Route>
    </Router>,
  document.getElementById('root')
);
