import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router'

import App from './App';
import Home from './Home';

import "./index.css";

const Game = () => <div>game</div>

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
